// Legal-page defect gate (READ-ONLY). Derives the legal-page inventory from the
// repository (the static public/*.html legal documents + the Next /privacy-policy
// route) and fails on the defects this branch fixes, so they cannot regress.
//
// Fails when a legal page: references /styles.css or a missing stylesheet; has no
// self-referential canonical; has a lang attribute that disagrees with the
// document; has no crawlable inbound internal link; links to the removed
// privacy.html / a redirect / an http/www / a query URL; is a duplicate
// canonical; contains placeholder text; changes the operator identity or contact
// email; or publishes an unverified permit claim as fact.
//
// Run: node scripts/validate-legal.js  (npm run validate:legal)

const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const exists = (p) => fs.existsSync(path.join(ROOT, p));
const errors = [];

const OPERATOR = 'TNT agency s.r.o.';
const EMAIL = 'connect@talentpartnerid.com';
// Retired 2026-10-05. Any reappearance is a regression, not a variant.
const RETIRED_EMAILS = ['jobbohemiacz@gmail.com'];
const HOST = 'https://talentpartnerid.com';

// ── Inventory: static legal HTML + the Next privacy route ────────────────────
const staticFiles = fs.readdirSync(path.join(ROOT, 'public'))
  .filter((n) => /^(privacy|cookies|terms)[a-z-]*\.html$/.test(n));
const inventory = staticFiles.map((n) => ({
  id: n,
  file: 'public/' + n,
  route: '/' + n,
  kind: 'static',
  html: read('public/' + n),
}));
inventory.push({ id: 'privacy-policy', file: 'pages/privacy-policy.tsx', route: '/privacy-policy', kind: 'next', html: read('pages/privacy-policy.tsx') });

// Helpers to pull attributes.
const attrVal = (html, re) => { const m = html.match(re); return m ? m[1] : null; };
const langOf = (html) => attrVal(html, /<html\s+lang="([a-z]{2})"/i);
const canonicalOf = (html) => attrVal(html, /rel="canonical"\s+href="([^"]+)"/i);
const stylesheetsOf = (html) => [...html.matchAll(/rel="stylesheet"\s+href="([^"]+)"/gi)].map((m) => m[1]);
const linksOf = (html) => [...html.matchAll(/href="([^"]+)"/gi)].map((m) => m[1]);

// Expected document language from the filename suffix (-cs/-de → cs/de, else en).
const expectedLang = (id) => (/-cs\./.test(id) ? 'cs' : /-de\./.test(id) ? 'de' : 'en');

// ── 1. Stylesheet integrity ──────────────────────────────────────────────────
for (const p of inventory) {
  if (p.kind !== 'static') continue;
  const sheets = stylesheetsOf(p.html).filter((h) => !/fonts\.googleapis\.com/.test(h));
  if (sheets.some((h) => /(^|\/)styles\.css$/.test(h))) errors.push(`${p.id}: still references styles.css`);
  for (const h of sheets) {
    if (h.startsWith('/')) {
      const rel = 'public' + h.split('?')[0];
      if (!exists(rel)) errors.push(`${p.id}: stylesheet "${h}" does not exist at ${rel}`);
    }
  }
  if (!sheets.some((h) => h === '/legal-pages.css')) errors.push(`${p.id}: does not reference /legal-pages.css`);
}
if (!exists('public/legal-pages.css')) errors.push('public/legal-pages.css is missing');
else if (read('public/legal-pages.css').trim().length < 200) errors.push('public/legal-pages.css looks empty');

// ── 2. Canonical + language ──────────────────────────────────────────────────
const canonicals = [];
for (const p of inventory) {
  const canon = canonicalOf(p.html);
  if (!canon) { errors.push(`${p.id}: no canonical`); continue; }
  canonicals.push(canon);
  if (!canon.startsWith(HOST)) errors.push(`${p.id}: canonical not apex-HTTPS: ${canon}`);
  const expectSelf = `${HOST}${p.route}`;
  if (canon !== expectSelf) errors.push(`${p.id}: canonical "${canon}" is not self-referential (${expectSelf})`);
  if (p.kind === 'static') {
    const lang = langOf(p.html);
    if (lang !== expectedLang(p.id)) errors.push(`${p.id}: <html lang="${lang}"> disagrees with document (${expectedLang(p.id)})`);
  }
}
const dupCanon = canonicals.filter((c, i) => canonicals.indexOf(c) !== i);
if (dupCanon.length) errors.push(`duplicate canonical(s): ${[...new Set(dupCanon)].join(', ')}`);

// ── 3. Internal-link hygiene + inbound graph ─────────────────────────────────
const canonicalRoutes = new Set(inventory.map((p) => p.route));
const inbound = Object.fromEntries(inventory.map((p) => [p.route, 0]));
// Sources of inbound links: every legal page + the site footer.
const footer = read('components/Footer.tsx');
const sources = [...inventory.map((p) => ({ id: p.id, route: p.route, html: p.html })), { id: 'site-footer', route: null, html: footer }];
for (const src of sources) {
  for (const href of linksOf(src.html)) {
    if (/^(mailto:|tel:|#|https?:\/\/(?!talentpartnerid\.com))/.test(href)) continue;
    // Legal-link hygiene (only judge links that point at a legal doc).
    const legalHit = /(privacy|cookies|terms)/.test(href) || href === '/privacy-policy';
    if (legalHit) {
      if (/privacy\.html/.test(href)) errors.push(`${src.id}: links to removed privacy.html (${href})`);
      if (/^http:\/\//.test(href)) errors.push(`${src.id}: insecure http legal link ${href}`);
      if (/^https?:\/\/www\./.test(href)) errors.push(`${src.id}: www legal link ${href}`);
      if (href.includes('?')) errors.push(`${src.id}: parameterized legal link ${href}`);
    }
    const p = href.replace(HOST, '').split('#')[0].split('?')[0];
    if (canonicalRoutes.has(p) && src.route !== p) inbound[p]++;
  }
}
for (const p of inventory) {
  if (inbound[p.route] === 0) errors.push(`${p.id}: ORPHAN — no crawlable inbound internal link`);
}

// ── 4. Content integrity (operator/contact/permit/placeholder) ───────────────
for (const p of inventory) {
  if (!p.html.includes(OPERATOR)) errors.push(`${p.id}: operator "${OPERATOR}" not present`);
  if (/TNT agency(?! s\.r\.o\.)/.test(p.html)) errors.push(`${p.id}: altered operator legal form`);
  for (const m of p.html.matchAll(/[\w.+-]+@talentpartnerid\.com/g)) if (m[0] !== EMAIL) errors.push(`${p.id}: altered contact email ${m[0]}`);
  for (const retired of RETIRED_EMAILS) if (p.html.includes(retired)) errors.push(`${p.id}: retired contact email ${retired}`);
  // Every legal page must still give the reader a working contact. Static
  // pages carry the literal; the Next route binds the verified operator record.
  const contact = p.kind === 'static' ? p.html.includes(`href="mailto:${EMAIL}"`) : /\bOPERATOR_EMAIL\b/.test(p.html);
  if (!contact) errors.push(`${p.id}: no mailto contact for ${EMAIL}`);
  for (const ph of ['lorem ipsum', 'TODO', 'FIXME', 'placeholder', '[Company', '[IČO', 'XXXXX']) {
    if (p.html.toLowerCase().includes(ph.toLowerCase())) errors.push(`${p.id}: placeholder "${ph}"`);
  }
  // Unverified permit claim presented as fact.
  for (const claim of ['ověřeno MPSV', 'schváleno státem', 'licencováno pro všechny', 'government approved', 'verified by MPSV']) {
    if (new RegExp(claim, 'i').test(p.html)) errors.push(`${p.id}: unverified permit/endorsement claim "${claim}"`);
  }
  if (/IČO[:\s]*\d{6,}/.test(p.html)) errors.push(`${p.id}: publishes an IČO — must be owner-verified first`);
}

// ── Report ───────────────────────────────────────────────────────────────────
if (errors.length) {
  console.error(`Legal-page gate: FAIL (${errors.length})`);
  for (const e of errors) console.error(`  ✗ ${e}`);
  process.exit(1);
}
console.log('Legal-page gate: PASS');
console.log(`  ${inventory.length} legal pages: stylesheet OK, self-canonical, language matches, 0 orphans, links clean, operator/contact intact, no permit claim`);
