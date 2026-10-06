import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'

const ROOT = process.cwd()
const read = (p: string) => fs.readFileSync(path.join(ROOT, p), 'utf8')
const exists = (p: string) => fs.existsSync(path.join(ROOT, p))

const staticLegal = fs
  .readdirSync(path.join(ROOT, 'public'))
  .filter((n) => /^(privacy|cookies|terms)[a-z-]*\.html$/.test(n))
  .sort()

const HOST = 'https://talentpartnerid.com'
const expectedLang = (n: string) => (/-cs\./.test(n) ? 'cs' : /-de\./.test(n) ? 'de' : 'en')

describe('static legal pages — asset & link integrity', () => {
  it('discovers the expected static legal documents', () => {
    // 3 docs (privacy/cookies/terms). EN privacy lives at the Next /privacy-policy,
    // so the static set is: privacy-cs/de + cookies(+cs/de) + terms(+cs/de) = 8.
    expect(staticLegal.length).toBe(8)
    for (const n of ['privacy-cs.html', 'privacy-de.html', 'cookies.html', 'cookies-cs.html', 'cookies-de.html', 'terms.html', 'terms-cs.html', 'terms-de.html']) {
      expect(staticLegal, `missing ${n}`).toContain(n)
    }
  })

  it('ships the dedicated legal stylesheet as a static asset', () => {
    expect(exists('public/legal-pages.css')).toBe(true)
    const css = read('public/legal-pages.css').replace(/\/\*[\s\S]*?\*\//g, ' ') // strip comments
    expect(css.length).toBeGreaterThan(1000)
    // Self-contained: no bundler-only or remote CSS dependencies (in real rules,
    // not a comment that merely names them).
    expect(/@import|@tailwind|@apply/.test(css)).toBe(false)
  })

  it('every legal page references /legal-pages.css and never /styles.css', () => {
    for (const n of staticLegal) {
      const html = read('public/' + n)
      expect(html, `${n} missing /legal-pages.css`).toContain('href="/legal-pages.css"')
      expect(/rel="stylesheet"\s+href="\/?styles\.css"/.test(html), `${n} still references styles.css`).toBe(false)
      expect(html.includes('<style>'), `${n} still has an inline <style> block`).toBe(false)
    }
  })

  it('each page has a self-referential canonical and matching language', () => {
    const canon: string[] = []
    for (const n of staticLegal) {
      const html = read('public/' + n)
      const c = (html.match(/rel="canonical"\s+href="([^"]+)"/) || [])[1]
      expect(c, `${n} canonical`).toBe(`${HOST}/${n}`)
      canon.push(c!)
      const lang = (html.match(/<html\s+lang="([a-z]{2})"/) || [])[1]
      expect(lang, `${n} lang`).toBe(expectedLang(n))
    }
    expect(new Set(canon).size).toBe(canon.length)
  })

  it('legal links are absolute canonical, never the removed privacy.html or a relative/redirect', () => {
    for (const n of staticLegal) {
      const html = read('public/' + n)
      // No link to the removed EN static privacy page (it is /privacy-policy now).
      expect(/href="\/?privacy\.html"/.test(html), `${n} links privacy.html`).toBe(false)
      // No relative legal .html links (all must be absolute or /privacy-policy).
      expect(/href="(privacy|cookies|terms)[a-z-]*\.html"/.test(html), `${n} has a relative legal link`).toBe(false)
      // No INTERNAL http/www links (external authority links like www.uoou.cz or
      // netlify.com are legitimate and stay).
      expect(/href="http:\/\/talentpartnerid|href="https?:\/\/www\.talentpartnerid/.test(html), `${n} internal http/www link`).toBe(false)
    }
  })

  it('every canonical legal page has an inbound internal link (no orphans)', () => {
    const routes = staticLegal.map((n) => '/' + n).concat('/privacy-policy')
    const sources = staticLegal.map((n) => read('public/' + n)).concat(read('pages/privacy-policy.tsx'), read('components/Footer.tsx'))
    const inbound: Record<string, number> = Object.fromEntries(routes.map((r) => [r, 0]))
    for (let i = 0; i < sources.length; i++) {
      const selfRoute = i < staticLegal.length ? '/' + staticLegal[i] : null
      for (const m of Array.from(sources[i].matchAll(/href="([^"]+)"/g))) {
        const p = m[1].replace(HOST, '').split('#')[0].split('?')[0]
        if (p in inbound && p !== selfRoute) inbound[p]++
      }
    }
    for (const r of routes) expect(inbound[r], `${r} is an orphan`).toBeGreaterThan(0)
  })

  it('preserves operator identity and approved contact email', () => {
    for (const n of staticLegal) {
      const html = read('public/' + n)
      expect(html).toContain('TNT agency s.r.o.')
      expect(/TNT agency(?! s\.r\.o\.)/.test(html)).toBe(false)
      for (const m of Array.from(html.matchAll(/[\w.+-]+@talentpartnerid\.com/g))) expect(m[0]).toBe('connect@talentpartnerid.com')
      expect(html, `${n} lost its contact link`).toContain('href="mailto:connect@talentpartnerid.com"')
      expect(html, `${n} still carries the retired address`).not.toContain('jobbohemiacz@gmail.com')
    }
  })

  it('publishes no unverified permit claim on any legal page', () => {
    for (const n of staticLegal) {
      const html = read('public/' + n)
      expect(/IČO[:\s]*\d{6,}|ověřeno MPSV|schváleno státem/i.test(html), `${n} permit claim`).toBe(false)
    }
  })

  it('the fix touches no backend surface', () => {
    expect(exists('pages/api')).toBe(false)
    expect(exists('supabase')).toBe(false)
    for (const n of staticLegal) expect(/marketingConsent/.test(read('public/' + n))).toBe(false)
  })
})
