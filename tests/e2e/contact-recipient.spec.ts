import { test, expect, type Page } from '@playwright/test'

/**
 * Where enquiries and applications are addressed, in a real browser against a
 * production build.
 *
 * Both forms hand a mailto: to the visitor's own mail client. The hand-off is
 * captured with the Navigation API and CANCELLED, so the exact recipient,
 * subject and body can be asserted without any mail client opening and without
 * a message being sent.
 *
 * The approved address is written out here, never imported: a test that reads
 * the same constant as the page passes whatever that constant holds.
 */

const APPROVED = 'connect@talentpartnerid.com'
const RETIRED = 'jobbohemiacz@gmail.com'
// Public authorities the site legitimately names (privacy policy §12).
const THIRD_PARTY = ['posta@uoou.cz']

/** Records every mailto: navigation and cancels it before it leaves the page. */
async function captureMailHandoff(page: Page) {
  await page.addInitScript(() => {
    const w = window as unknown as { __handoffs: string[]; navigation?: EventTarget }
    w.__handoffs = []
    w.navigation?.addEventListener('navigate', (event) => {
      const e = event as Event & { destination: { url: string } }
      if (e.destination.url.startsWith('mailto:')) {
        w.__handoffs.push(e.destination.url)
        e.preventDefault()
      }
    })
  })
}
const handoffs = (page: Page) => page.evaluate(() => (window as unknown as { __handoffs: string[] }).__handoffs)

function parseMailto(href: string) {
  const [to, query = ''] = href.slice('mailto:'.length).split('?')
  const params: Record<string, string> = {}
  for (const pair of query.split('&')) {
    const [k, v = ''] = pair.split('=')
    if (k) params[k] = decodeURIComponent(v)
  }
  return { to: decodeURIComponent(to), subject: params.subject ?? '', body: params.body ?? '' }
}

/** Every mailto on the rendered page: recipient, and any address shown as its text. */
async function mailtoLinks(page: Page) {
  return page.locator('a[href^="mailto:"]').evaluateAll((els) =>
    els.map((a) => ({ href: a.getAttribute('href') ?? '', text: (a.textContent ?? '').trim() })),
  )
}

test.describe('public contact surfaces', () => {
  const ROUTES = [
    '/', '/contact', '/o-nas', '/privacy-policy', '/offers', '/submit-offer', '/submit-agency',
    '/poptavka-pracovniku', '/en/request-staff', '/de/personal-anfragen', '/en/contact', '/de/kontakt',
    '/pt-br', '/es', '/pt-br/candidatar-se', '/es/postularme',
    '/privacy-cs.html', '/privacy-de.html', '/cookies.html', '/cookies-cs.html', '/cookies-de.html',
    '/terms.html', '/terms-cs.html', '/terms-de.html',
    '/blog/agenturni-pracovnici-vs-interni-zamestnanci.html',
  ]

  test('every mailto sends to the approved address and shows the address it sends to', async ({ page }) => {
    for (const route of ROUTES) {
      const response = await page.goto(route)
      expect(response?.status(), route).toBe(200)
      const links = await mailtoLinks(page)
      expect(links.filter((l) => parseMailto(l.href).to === APPROVED).length, `${route} has no contact mailto`).toBeGreaterThan(0)
      for (const { href, text } of links) {
        const to = parseMailto(href).to
        expect([APPROVED, ...THIRD_PARTY], `${route} mailto recipient`).toContain(to)
        for (const shown of text.match(/[\w.+-]+@[\w.-]+\.[a-z]{2,}/gi) ?? []) expect(shown, `${route} link text`).toBe(to)
      }
      expect(await page.content(), route).not.toContain(RETIRED)
    }
  })

  test('structured data names the approved address', async ({ page }) => {
    for (const route of ['/', '/contact', '/o-nas', '/poptavka-pracovniku']) {
      await page.goto(route)
      const emails = await page.locator('script[type="application/ld+json"]').evaluateAll((els) =>
        els.flatMap((s) => Array.from((s.textContent ?? '').matchAll(/"email"\s*:\s*"([^"]*)"/g), (m) => m[1])),
      )
      expect(emails.length, `${route} JSON-LD email`).toBeGreaterThan(0)
      for (const e of emails) expect(e, route).toBe(APPROVED)
    }
  })

  test('the address survives the client-side language switch', async ({ page }) => {
    for (const lang of ['en', 'de']) {
      await page.addInitScript((l) => { try { localStorage.setItem('tnt-lang', l) } catch {} }, lang)
      await page.goto('/contact')
      await expect(page.locator('html')).toHaveAttribute('lang', lang)
      for (const { href, text } of await mailtoLinks(page)) {
        expect(parseMailto(href).to, `${lang} /contact`).toBe(APPROVED)
        if (text.includes('@')) expect(text).toBe(APPROVED)
      }
    }
  })
})

test.describe('employer request hand-off', () => {
  const PAGES = [
    { locale: 'cs', route: '/poptavka-pracovniku' },
    { locale: 'en', route: '/en/request-staff' },
    { locale: 'de', route: '/de/personal-anfragen' },
  ]
  for (const { locale, route } of PAGES) {
    test(`${locale}: the prepared request is addressed to the approved mailbox`, async ({ page, context }) => {
      await context.grantPermissions(['clipboard-read', 'clipboard-write'])
      await captureMailHandoff(page)
      await page.goto(route)
      await page.fill('#companyName', 'Synthetic Works s.r.o.')
      await page.fill('#contactName', 'Test Person')
      await page.fill('#email', 'buyer.synthetic@example.invalid')
      await page.fill('#phone', '+420 600 000 000')
      await page.fill('#workplaceCity', 'Pardubice')
      await page.selectOption('#workplaceRegion', 'pardubicky')
      await page.fill('#profession', 'Synthetic Operator')
      await page.fill('#headcount', '3')
      await page.selectOption('#employmentModel', 'agency')
      await page.check('#consent')
      await page.locator('form.erf__form button[type="submit"]').click()

      await expect.poll(() => handoffs(page)).toHaveLength(1)
      const [href] = await handoffs(page)
      const mail = parseMailto(href)
      expect(mail.to).toBe(APPROVED)
      expect(mail.subject).toMatch(/TPID-\d{4}-\d{4}-/)
      expect(mail.subject).toContain('Synthetic Operator')
      // The employer's own details are content, not the recipient.
      expect(mail.body).toContain('buyer.synthetic@example.invalid')
      expect(mail.body).toContain('+420 600 000 000')
      expect(mail.body).toContain('Synthetic Works s.r.o.')
      expect(href).not.toContain(RETIRED)

      // The manual fallback agrees with the hand-off.
      const panel = page.locator('.erf__prepared')
      await expect(panel.locator('.erf__prepared-meta dd code').nth(1)).toHaveText(APPROVED)
      expect(await panel.locator('.erf__copy-actions a[href^="mailto:"]').getAttribute('href')).toBe(href)
      expect(await page.locator('#prepared-body').inputValue()).toBe(mail.body)

      // "Copy email address" is the first copy action.
      await panel.locator('.erf__copy-actions button').first().click()
      expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(APPROVED)

      expect(page.url()).not.toContain('synthetic')
    })
  }
})

test.describe('candidate application hand-off', () => {
  const PAGES = [
    { locale: 'pt-BR', route: '/pt-br/candidatar-se', attach: 'Anexe seu currículo antes de enviar', attachWord: 'currículo' },
    { locale: 'es', route: '/es/postularme', attach: 'Adjunte su CV antes de enviar', attachWord: 'CV' },
  ]
  for (const { locale, route, attach, attachWord } of PAGES) {
    test(`${locale}: the application is addressed to the approved mailbox`, async ({ page }) => {
      await captureMailHandoff(page)
      await page.goto(route)
      await page.fill('#caf-fullName', 'Synthetic Candidate')
      await page.fill('#caf-country', 'Brasil')
      await page.selectOption('#caf-fieldOfWork', 'technical')
      await page.fill('#caf-currentRole', 'Soldador')
      await page.selectOption('#caf-experience', '3to5')
      await page.selectOption('#caf-availability', 'immediately')
      await page.fill('#caf-email', 'candidate.synthetic@example.invalid')
      await page.check('#caf-consent')
      await page.locator('form button[type="submit"]').click()

      await expect.poll(() => handoffs(page)).toHaveLength(1)
      const [href] = await handoffs(page)
      const mail = parseMailto(href)
      expect(mail.to).toBe(APPROVED)
      expect(mail.subject).toContain('Synthetic Candidate')
      expect(mail.body).toContain('candidate.synthetic@example.invalid')
      // The CV is attached by hand; the reminder travels inside the message.
      expect(mail.body).toContain(attach)
      expect(href).not.toContain(RETIRED)

      const fallback = page.locator('.caf__fallback')
      await expect(fallback.locator('a[href^="mailto:"]')).toHaveAttribute('href', `mailto:${APPROVED}`)
      await expect(fallback.locator('a[href^="mailto:"]')).toHaveText(APPROVED)
      expect(await page.locator('#caf-body').inputValue()).toBe(mail.body)
      expect(page.url()).not.toContain('Synthetic')
    })

    test(`${locale}: without JavaScript the address and CV instruction are still there, and nothing submits as GET`, async ({ browser }) => {
      const context = await browser.newContext({ javaScriptEnabled: false })
      const page = await context.newPage()
      await page.goto(route)
      const fallback = page.locator('.caf__fallback')
      await expect(fallback).toBeVisible()
      await expect(fallback.locator('a[href^="mailto:"]')).toHaveAttribute('href', `mailto:${APPROVED}`)
      await expect(fallback.locator('a[href^="mailto:"]')).toHaveText(APPROVED)
      await expect(page.locator('.caf__attach-warning').first()).toContainText(attachWord)
      const form = page.locator('form:has(#caf-email)')
      await expect(form).toHaveAttribute('method', 'post')
      expect(await form.getAttribute('action')).toBeNull()
      expect(await page.content()).not.toContain(RETIRED)
      await context.close()
    })
  }
})
