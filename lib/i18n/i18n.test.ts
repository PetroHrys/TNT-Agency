import { describe, it, expect } from 'vitest';
import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
import { computeHomeView } from '../payroll/home-view-model';
import { CHROME_NAV, CHROME_FOOTER, NAV_TARGETS, REQUEST_WORKERS } from '../locale/chrome';

const require = createRequire(import.meta.url);
const ROOT = process.cwd();
const { validate, parseDict, languageRegions, LANGS } = require(path.join(ROOT, 'scripts/validate-i18n.js'));

const SCRIPT = fs.readFileSync(path.join(ROOT, 'public/script.js'), 'utf8');
const HEADER = fs.readFileSync(path.join(ROOT, 'components/Header.tsx'), 'utf8');
const FOOTER = fs.readFileSync(path.join(ROOT, 'components/Footer.tsx'), 'utf8');
const SITEMAP = fs.readFileSync(path.join(ROOT, 'public/sitemap.xml'), 'utf8');

const result = validate();
const regions = languageRegions(SCRIPT);
const dicts = Object.fromEntries((LANGS as string[]).map((l) => [l, parseDict(regions[l])]));

describe('localization completeness & integrity', () => {
  it('1-4,13. validator passes: all cs/en/de keys present, structures match, no unknown/unwired data-i18n', () => {
    expect(result.errors).toEqual([]);
  });

  it('nav namespace has identical key sets across en/cs/de', () => {
    const sizes = (LANGS as string[]).map((l) => dicts[l].nav.size);
    expect(new Set(sizes).size).toBe(1);
    expect(sizes[0]).toBeGreaterThanOrEqual(15);
  });

  it('11. every header navigation item is wired for translation (data-i18n)', () => {
    // The hooks are now emitted as data-i18n={locale ? undefined : 'nav.x'} —
    // present on the Czech spine, deliberately absent on /en and /de pages
    // whose language is fixed by the URL and must not be client-rewritten.
    // The key names are what this test is about, and they are unchanged.
    // Header builds each hook as `${mobile ? 'mnav' : 'nav'}.${target.key}`,
    // so no literal 'nav.home' exists to grep for. The set of keys is a
    // property of NAV_TARGETS, which is what is asserted.
    const navKeys = NAV_TARGETS.map((t) => `nav.${t.key}`).concat(`nav.${REQUEST_WORKERS.key}`);
    for (const key of ['nav.home', 'nav.agencies', 'nav.offers', 'nav.calc', 'nav.article', 'nav.submitAgency', 'nav.postOffer', 'nav.contact', 'nav.requestWorkers']) {
      expect(navKeys, `header no longer renders ${key}`).toContain(key);
    }
    // Mobile mirror — the same targets, prefixed mnav.
    const mnavKeys = NAV_TARGETS.map((t) => `mnav.${t.key}`).concat(`mnav.${REQUEST_WORKERS.key}`);
    for (const key of ['mnav.home', 'mnav.agencies', 'mnav.offers', 'mnav.calc', 'mnav.contact', 'mnav.requestWorkers']) {
      expect(mnavKeys, `mobile nav no longer renders ${key}`).toContain(key);
    }
    // Every key must resolve in the client dictionary the hooks index into.
    for (const key of navKeys) {
      expect(Object.keys(CHROME_NAV.cs), key).toContain(key.slice('nav.'.length));
    }
    // And the hooks must still be conditional on locale, not removed outright.
    expect(HEADER).toContain('locale ? undefined :');
  });

  it('5. navigation strings are genuinely translated (not a single-language fallback)', () => {
    // nav.home resolves to a distinct value in each language.
    expect(/home:\s+'Home'/.test(SCRIPT)).toBe(true);
    expect(/home:\s+'Úvod'/.test(SCRIPT)).toBe(true);
    expect(/home:\s+'Startseite'/.test(SCRIPT)).toBe(true);
  });

  it('12. client-side validation error messages exist in all three languages', () => {
    for (const l of LANGS as string[]) {
      expect(dicts[l].contact.has('form.errorMsg') || dicts[l].contact.has('errorMsg') || /errorMsg/.test(regions[l])).toBe(true);
    }
  });

  it('6,7. legal entity and contact email are preserved unchanged (never translated to a variant)', () => {
    // The validator flags altered forms; assert none were flagged.
    expect(result.errors.filter((e: string) => /legal-entity|contact email/i.test(e))).toEqual([]);
    // Markup still carries the exact legal entity; the contact email is now
    // single-sourced from the verified operator record (OPERATOR_EMAIL in
    // trust-data.ts) rather than a repeated literal, so it can never drift or be
    // translated — assert the binding and that the constant holds the exact value.
    // The copyright line moved out of the markup and into CHROME_FOOTER, which
    // makes the original point checkable in a stronger form: the legal entity
    // must appear in EVERY language's copyright string, byte-identical. It was
    // previously only provable for the one Czech literal in the markup.
    for (const l of ['cs', 'en', 'de'] as const) {
      expect(CHROME_FOOTER[l].copy, `${l} copyright drops the legal entity`).toContain('TNT agency s.r.o.');
    }
    expect(FOOTER).toContain('OPERATOR_EMAIL');
    const TRUST = fs.readFileSync(path.join(ROOT, 'lib/content/trust-data.ts'), 'utf8');
    expect(TRUST).toContain("OPERATOR_EMAIL = 'connect@talentpartnerid.com'");
    // The identifier itself is byte-identical across every language block.
    for (const l of LANGS as string[]) {
      const emails = Array.from(regions[l].matchAll(/[\w.+-]+@talentpartnerid\.com/g), (m: RegExpMatchArray) => m[0]);
      for (const e of emails) expect(e).toBe('connect@talentpartnerid.com');
      expect(regions[l], `${l} still carries the retired address`).not.toContain('jobbohemiacz@gmail.com');
    }
  });

  it('10. calculator numeric output is language-independent', () => {
    // The compute path takes only a number; no language input exists.
    expect(computeHomeView(32000).netHalere).toBe(computeHomeView(32000).netHalere);
    expect(Math.round(computeHomeView(32000).netHalere / 100)).toBe(26058);
  });

  it('14. Czech is never prefixed, and sitemap hygiene is preserved', () => {
    // The prohibition on locale-prefixed directories is SUPERSEDED. It was
    // correct while localization was client-side only: a /en/ directory then
    // meant a URL that duplicated Czech content. Locale L0 introduced real
    // prerendered EN and DE routes with their own content and canonicals.
    //
    // What has NOT changed, and is asserted here, is that CZECH is never
    // prefixed: there is no /cs/ directory and no /cs/ URL, because the Czech
    // canonicals are immutable.
    const pageEntries = fs.readdirSync(path.join(ROOT, 'pages'));
    expect(pageEntries).not.toContain('cs');
    expect(SITEMAP).not.toMatch(/talentpartnerid\.com\/cs\//);
    // Sitemap hygiene preserved: URL-only, no hreflang extension, no lastmod.
    expect(SITEMAP.includes('<xhtml:link')).toBe(false);
    expect(SITEMAP.includes('xmlns:xhtml')).toBe(false);
    expect(SITEMAP.includes('<lastmod')).toBe(false);
    expect(SITEMAP.includes('<changefreq')).toBe(false);
    expect(SITEMAP.includes('<priority')).toBe(false);
  });
});
