import { test, expect, type Page, type Request } from '@playwright/test'

// Browser QA for the WebmasterID analytics integration.
//
// Everything here is asserted against a production build. Values typed into the
// request form and the calculator are SYNTHETIC and deliberately distinctive, so
// that a leak into an analytics payload is unmissable — and no real personal
// data is ever used or recorded.

const SITE_ID = 'wm_wfywm8g9qkoonabl'
const ENDPOINT = 'https://webmasterid-ingest-api.vercel.app/api/events'
const TRACKER_SRC = 'https://webmasterid.com/tracker.iife.min.js'
const CONSENT_KEY = 'cookie_consent'

/** Distinctive synthetic values. None of these may ever appear in a payload. */
const SYNTH = {
  company: 'ZZQQ-SYNTHETIC-COMPANY-7781',
  contact: 'ZZQQ-SYNTHETIC-CONTACT-7782',
  email: 'zzqq-synthetic-7783@example.invalid',
  phone: '+420900000777',
  requirements: 'ZZQQ-SYNTHETIC-REQUIREMENTS-7784',
  salary: '48321',
}

const REPRESENTATIVE_ROUTES = [
  '/',
  '/pro-zamestnavatele',
  '/kalkulacka-mzdy-agenturniho-zamestnance',
  '/poptavka-pracovniku',
  '/pracovnici-praha',
  '/pracovnici-do-logistiky',
  '/zamestnavani-cizincu',
  '/privacy-policy',
  '/skutecne-naklady-na-zamestnance',
]

/**
 * Whether this browser will actually execute the third-party bundle.
 *
 * Chromium-family browsers currently refuse the request to webmasterid.com
 * from a page script context with net::ERR_BLOCKED_BY_ORB, while a direct API
 * fetch of the same URL from the same browser returns 200 application/javascript
 * and an unrelated cross-origin CDN script loads normally. That is a
 * client-side condition affecting the tracker's origin, not a defect in this
 * integration, and it is deliberately not worked around.
 *
 * It matters for test honesty: assertions of the form "no form value appears in
 * any analytics payload" pass trivially when no payload is ever sent. Tests
 * that depend on the bundle actually running therefore SKIP with a reason
 * rather than passing silently. Everything under this repository's control —
 * consent gating, the rendered script element, SSR output, site resilience —
 * is asserted unconditionally.
 */
let trackerExecutes: boolean | null = null
let officialBundle: string | null = null

/**
 * When the browser refuses the cross-origin fetch, serve the OFFICIAL bundle
 * bytes to the page instead of skipping the payload assertions.
 *
 * What this does and does not change:
 *   - the page still requests the exact same URL, so the script element, its
 *     attributes and the request assertions are untouched;
 *   - the bytes served are the official bundle, fetched unmodified at runtime
 *     from https://webmasterid.com/tracker.iife.min.js — nothing is vendored
 *     into this repository and nothing is patched;
 *   - analytics events still go to the REAL ingest endpoint over the network.
 *
 * Only the client-side network block is bypassed, and only inside the test
 * browser. The application ships no such workaround: a visitor whose browser or
 * extension blocks the bundle simply gets no analytics, which is asserted
 * separately by the "site works when analytics does not" tests.
 */
async function serveOfficialBundle(page: Page) {
  if (officialBundle === null) {
    const res = await page.request.get(TRACKER_SRC)
    expect(res.status(), 'official tracker bundle must be fetchable').toBe(200)
    officialBundle = await res.text()
  }
  await page.route(TRACKER_SRC, (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/javascript; charset=utf-8',
      body: officialBundle!,
    }),
  )
}

async function requireRunningTracker(page: Page) {
  await serveOfficialBundle(page)
  await page.goto('/')
  await page.evaluate((k) => localStorage.setItem(k, 'accepted'), CONSENT_KEY)
  await page.reload()
  const ok = await page
    .waitForFunction(() => Boolean((window as any).WebmasterID), null, { timeout: 20_000 })
    .then(() => true)
    .catch(() => false)
  trackerExecutes = ok
  test.skip(
    !ok,
    'The WebmasterID bundle could not be executed even when served directly. ' +
      'Payload assertions would pass vacuously, so they are skipped rather than reported as green.',
  )
}

/** Collects every request the page makes to WebmasterID. */
function watchAnalytics(page: Page) {
  const trackerLoads: string[] = []
  const ingest: { url: string; body: string }[] = []
  const record = (req: Request) => {
    const url = req.url()
    if (url.startsWith(TRACKER_SRC)) trackerLoads.push(url)
    if (url.includes('webmasterid-ingest-api')) {
      ingest.push({ url, body: req.postData() ?? '' })
    }
  }
  page.on('request', record)
  return { trackerLoads, ingest }
}

/** Fails the test on any console error or page exception. */
function watchErrors(page: Page) {
  const errors: string[] = []
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text())
  })
  page.on('pageerror', (e) => errors.push(String(e)))
  return errors
}

const setConsent = (page: Page, value: 'accepted' | 'rejected') =>
  page.addInitScript(
    ([k, v]) => window.localStorage.setItem(k as string, v as string),
    [CONSENT_KEY, value],
  )

test.describe('tracker is not loaded without consent', () => {
  test('no tracker request on a first visit (no choice made yet)', async ({ page }) => {
    const net = watchAnalytics(page)
    const errors = watchErrors(page)

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    expect(net.trackerLoads, 'tracker must not be requested before consent').toHaveLength(0)
    expect(net.ingest, 'no event may be sent before consent').toHaveLength(0)
    expect(await page.locator('script#webmasterid-tracker').count()).toBe(0)
    expect(await page.evaluate(() => (window as any).WebmasterID ?? null)).toBeNull()
    expect(errors).toEqual([])
  })

  test('rejecting prevents the tracker from ever loading', async ({ page }) => {
    const net = watchAnalytics(page)
    await page.goto('/')
    await page.getByRole('button', { name: /Odmítnout|Reject|ablehnen/i }).click()
    await page.waitForTimeout(1500)

    expect(net.trackerLoads).toHaveLength(0)
    expect(net.ingest).toHaveLength(0)

    // And the choice survives a reload.
    await page.reload()
    await page.waitForLoadState('networkidle')
    expect(net.trackerLoads).toHaveLength(0)
    expect(await page.evaluate((k) => localStorage.getItem(k), CONSENT_KEY)).toBe('rejected')
  })

  test('a stored rejection is still respected on a later visit', async ({ page }) => {
    await setConsent(page, 'rejected')
    const net = watchAnalytics(page)

    await page.goto('/pro-zamestnavatele')
    await page.waitForLoadState('networkidle')

    expect(net.trackerLoads).toHaveLength(0)
    // The banner must not nag a visitor who already answered.
    expect(await page.locator('.cookie-banner').count()).toBe(0)
  })

  test('rejecting clears any analytics identifier from an earlier accepted session', async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('wmid:av:v1', 'deadbeefdeadbeefdeadbeefdeadbeef')
      window.sessionStorage.setItem('wmid:as:v1', 'sess_aaaaaaaaaaaaaaaaaaaaaaaa')
    })
    await page.goto('/')
    await page.getByRole('button', { name: /Odmítnout|Reject|ablehnen/i }).click()
    await page.waitForTimeout(500)

    expect(await page.evaluate(() => localStorage.getItem('wmid:av:v1'))).toBeNull()
    expect(await page.evaluate(() => sessionStorage.getItem('wmid:as:v1'))).toBeNull()
  })
})

test.describe('tracker loads exactly once after consent', () => {
  test('accepting loads the tracker once, with the exact configuration', async ({ page }) => {
    const net = watchAnalytics(page)
    const errors = watchErrors(page)

    await page.goto('/')
    await page.getByRole('button', { name: /Přijmout|Accept|akzeptieren/i }).click()

    const el = page.locator('script#webmasterid-tracker')
    await expect(el).toHaveCount(1)
    await expect(el).toHaveAttribute('data-wmid', SITE_ID)
    await expect(el).toHaveAttribute('data-endpoint', ENDPOINT)
    await expect(el).toHaveAttribute('src', TRACKER_SRC)
    // next/script serialises the boolean prop as defer="true"; assert presence.
    expect(await el.getAttribute('defer'), 'defer attribute must be present').not.toBeNull()

    await page.waitForTimeout(1500)
    expect(net.trackerLoads, 'bundle must be requested exactly once').toHaveLength(1)
    expect(errors).toEqual([])
  })

  test('consent taken effect without a reload, and only one instance exists', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /Přijmout|Accept|akzeptieren/i }).click()
    await expect(page.locator('script#webmasterid-tracker')).toHaveCount(1)

    expect(await page.locator('script[data-wmid]').count()).toBe(1)
    expect(await page.locator('script[src*="webmasterid.com"]').count()).toBe(1)
  })

  test('client-side navigation does not re-inject the tracker', async ({ page }) => {
    await setConsent(page, 'accepted')
    const net = watchAnalytics(page)

    await page.goto('/')
    await expect(page.locator('script#webmasterid-tracker')).toHaveCount(1)

    // Navigate via the SPA router, not a full load.
    await page.evaluate(() => (window as any).next.router.push('/pro-zamestnavatele'))
    await page.waitForTimeout(800)
    await page.evaluate(() => (window as any).next.router.push('/poptavka-pracovniku'))
    await page.waitForTimeout(800)
    await page.goBack()
    await page.waitForTimeout(800)

    expect(await page.locator('script[data-wmid]').count()).toBe(1)
    expect(net.trackerLoads, 'bundle must never be re-fetched').toHaveLength(1)
  })

  test('one page_view per real route change, no duplicates', async ({ page }) => {
    await requireRunningTracker(page)
    await setConsent(page, 'accepted')
    const net = watchAnalytics(page)

    await page.goto('/')
    await page.waitForFunction(() => Boolean((window as any).WebmasterID), null, { timeout: 15_000 })
    await page.waitForTimeout(1200)

    const pageViews = () =>
      net.ingest.filter((r) => r.body.includes('"page_view"')).map((r) => {
        const m = r.body.match(/"pathname":"([^"]*)"/)
        return m ? m[1] : '?'
      })

    expect(pageViews(), 'exactly one initial page_view').toEqual(['/'])

    await page.evaluate(() => (window as any).next.router.push('/pro-zamestnavatele'))
    await page.waitForTimeout(1200)
    expect(pageViews()).toEqual(['/', '/pro-zamestnavatele'])

    await page.goBack()
    await page.waitForTimeout(1200)
    expect(pageViews()).toEqual(['/', '/pro-zamestnavatele', '/'])

    // A non-navigation state update must not emit anything.
    await page.evaluate(() => window.dispatchEvent(new Event('resize')))
    await page.waitForTimeout(600)
    expect(pageViews()).toHaveLength(3)
  })

  test('switching interface language emits no page_view (no route change)', async ({ page }) => {
    await requireRunningTracker(page)
    await setConsent(page, 'accepted')
    const net = watchAnalytics(page)

    await page.goto('/')
    await page.waitForFunction(() => Boolean((window as any).WebmasterID), null, { timeout: 15_000 })
    await page.waitForTimeout(1200)
    const before = net.ingest.length

    const routeBefore = page.url()
    const langBtn = page
      .locator('[data-lang], .lang-switch button, header button')
      .filter({ hasText: /^(EN|DE|CS)$/i })

    // Use the real control where it is reachable (desktop). On mobile it lives
    // inside the collapsed menu, so fall back to the same signal public/script.js
    // emits when the language actually changes. Either way the route is unchanged,
    // which is what this test is about.
    const visible = (await langBtn.count()) > 0 && (await langBtn.first().isVisible())
    if (visible) {
      await langBtn.first().click()
    } else {
      await page.evaluate(() => {
        document.documentElement.lang = 'en'
        localStorage.setItem('tnt-lang', 'en')
        window.dispatchEvent(new CustomEvent('tnt-lang', { detail: 'en' }))
      })
    }
    await page.waitForTimeout(1500)

    expect(page.url(), 'the language switch must not change the route').toBe(routeBefore)
    expect(net.ingest.length, 'language switch is not a navigation').toBe(before)
  })
})

test.describe('no personal, form or calculator data reaches analytics', () => {
  test('request form values never appear in any analytics payload', async ({ page }) => {
    await requireRunningTracker(page)
    await setConsent(page, 'accepted')
    const net = watchAnalytics(page)

    await page.goto('/poptavka-pracovniku')
    await page.waitForFunction(() => Boolean((window as any).WebmasterID), null, { timeout: 15_000 })

    // Fill every text-like field with distinctive synthetic values.
    const inputs = page.locator('form input[type="text"], form input[type="email"], form input[type="tel"], form textarea')
    const n = await inputs.count()
    for (let i = 0; i < n; i++) {
      const el = inputs.nth(i)
      if (!(await el.isVisible())) continue
      const type = await el.getAttribute('type')
      await el.fill(type === 'email' ? SYNTH.email : type === 'tel' ? SYNTH.phone : `ZZQQ-SYNTH-${i}`)
    }
    await page.waitForTimeout(1500)

    const all = net.ingest.map((r) => r.body).join('\n')
    for (const v of [...Object.values(SYNTH), 'ZZQQ-SYNTH']) {
      expect(all, `synthetic value ${v} must not reach analytics`).not.toContain(v)
    }
    // No form_submit event may exist at all: no form opts in.
    expect(all).not.toContain('form_submit')
  })

  test('calculator inputs and results never appear in any analytics payload', async ({ page }) => {
    await requireRunningTracker(page)
    await setConsent(page, 'accepted')
    const net = watchAnalytics(page)

    await page.goto('/kalkulacka-mzdy-agenturniho-zamestnance')
    await page.waitForFunction(() => Boolean((window as any).WebmasterID), null, { timeout: 15_000 })

    const num = page.locator('input[type="number"], input[inputmode="numeric"]').first()
    if (await num.count()) {
      await num.fill(SYNTH.salary)
      await page.waitForTimeout(1500)
    }

    const all = net.ingest.map((r) => r.body).join('\n')
    expect(all, 'calculator input must not reach analytics').not.toContain(SYNTH.salary)
    // The URL must stay clean too — page_view transmits location.href.
    expect(page.url()).not.toContain(SYNTH.salary)
    expect(all).not.toMatch(/netSalary|grossSalary|employerCost|agencyFee|savings/i)
  })

  test('payloads carry only the expected technical fields', async ({ page }) => {
    await requireRunningTracker(page)
    await setConsent(page, 'accepted')
    const net = watchAnalytics(page)

    await page.goto('/')
    await page.waitForFunction(() => Boolean((window as any).WebmasterID), null, { timeout: 15_000 })
    await page.waitForTimeout(1500)

    expect(net.ingest.length).toBeGreaterThan(0)
    const parsed = JSON.parse(net.ingest[0].body)
    const event = parsed.events[0]

    // Assert the KEY SET, not the values: this catches a future field being
    // added without printing potentially sensitive payload content.
    const ALLOWED = new Set([
      'event_name', 'url', 'pathname', 'referrer', 'title', 'site_id',
      'timestamp', 'language', 'user_agent', 'screen_width',
      'anonymous_session_id', 'anonymous_visitor_id', 'external_user_id',
    ])
    const unexpected = Object.keys(event).filter((k) => !ALLOWED.has(k))
    expect(unexpected, `unexpected analytics field(s): ${unexpected.join(', ')}`).toEqual([])

    expect(event.site_id).toBe(SITE_ID)
    expect(event.event_name).toBe('page_view')
    expect(event.external_user_id, 'no user identity may be attached').toBeUndefined()
  })

  test('mailto lead links are never transmitted', async ({ page }) => {
    await requireRunningTracker(page)
    await setConsent(page, 'accepted')
    const net = watchAnalytics(page)

    await page.goto('/contact')
    await page.waitForFunction(() => Boolean((window as any).WebmasterID), null, { timeout: 15_000 })

    const mailto = page.locator('a[href^="mailto:"]').first()
    if (await mailto.count()) {
      const href = await mailto.getAttribute('href')
      await page.evaluate((h) => {
        const a = document.querySelector(`a[href="${h}"]`) as HTMLElement | null
        a?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
      }, href)
      await page.waitForTimeout(1200)
      const all = net.ingest.map((r) => r.body).join('\n')
      expect(all).not.toContain('mailto:')
      expect(all).not.toMatch(/connect(@|%40)talentpartnerid/)
      expect(all).not.toContain('jobbohemiacz')
      expect(all).not.toContain('outbound_click')
    }
  })
})

test.describe('the site works when analytics does not', () => {
  test('site renders and the form works when the tracker is blocked', async ({ page }) => {
    await setConsent(page, 'accepted')
    const errors = watchErrors(page)
    // Simulate an ad blocker / offline endpoint.
    await page.route('**://webmasterid.com/**', (r) => r.abort())
    await page.route('**://webmasterid-ingest-api.vercel.app/**', (r) => r.abort())

    await page.goto('/poptavka-pracovniku')
    await page.waitForLoadState('domcontentloaded')

    await expect(page.locator('form').first()).toBeVisible()
    const firstInput = page.locator('form input[type="text"]').first()
    if (await firstInput.count()) {
      await firstInput.fill('ZZQQ-BLOCKED-OK')
      await expect(firstInput).toHaveValue('ZZQQ-BLOCKED-OK')
    }
    // A blocked script produces a network error, but must not throw into the app.
    expect(errors.filter((e) => !/ERR_FAILED|net::|Failed to load resource/i.test(e))).toEqual([])
  })

  test('pages render with JavaScript disabled', async ({ browser }) => {
    const ctx = await browser.newContext({ javaScriptEnabled: false })
    const p = await ctx.newPage()
    await p.goto('/pro-zamestnavatele')
    await expect(p.locator('h1').first()).toBeVisible()
    expect(await p.locator('script#webmasterid-tracker').count()).toBe(0)
    await ctx.close()
  })
})

test.describe('representative routes and languages', () => {
  for (const route of REPRESENTATIVE_ROUTES) {
    test(`${route} renders cleanly with analytics active`, async ({ page }) => {
      await setConsent(page, 'accepted')
      const errors = watchErrors(page)
      const net = watchAnalytics(page)

      await page.goto(route)
      await page.waitForLoadState('domcontentloaded')

      await expect(page.locator('h1').first()).toBeVisible()
      expect(await page.locator('script[data-wmid]').count()).toBeLessThanOrEqual(1)

      // No horizontal overflow.
      const overflow = await page.evaluate(() =>
        document.documentElement.scrollWidth - document.documentElement.clientWidth)
      expect(overflow, `${route} overflows horizontally`).toBeLessThanOrEqual(1)

      // No hydration or CSP errors.
      const real = errors.filter((e) => !/ERR_FAILED|net::|Failed to load resource/i.test(e))
      expect(real, `console errors on ${route}`).toEqual([])
      expect(errors.join('\n')).not.toMatch(/hydrat|Content Security Policy|CORS/i)

      // SEO surface is untouched by the tracker.
      const canonical = await page.locator('link[rel="canonical"]').count()
      expect(canonical).toBeLessThanOrEqual(1)
      expect(net.ingest.map((r) => r.body).join('')).not.toContain('sitemap')
    })
  }

  for (const lang of ['cs', 'en', 'de'] as const) {
    test(`language ${lang}: consent gate and tracker behave identically`, async ({ page }) => {
      await page.addInitScript((l) => {
        window.localStorage.setItem('tnt-lang', l as string)
        window.localStorage.setItem('cookie_consent', 'accepted')
      }, lang)
      const net = watchAnalytics(page)

      await page.goto('/')
      await expect(page.locator('script#webmasterid-tracker')).toHaveCount(1)
      await page.waitForTimeout(1000)

      // Exactly one instance in the document. The fetch count is deliberately
      // not asserted here: switching the stored interface language causes
      // public/script.js to reload the page, and a genuine full page load may
      // legitimately re-request the bundle.
      expect(await page.locator('script[data-wmid]').count()).toBe(1)
      await expect(page.locator('script#webmasterid-tracker')).toHaveAttribute('data-wmid', SITE_ID)
      expect(net.trackerLoads.length).toBeGreaterThanOrEqual(1)
    })
  }
})
