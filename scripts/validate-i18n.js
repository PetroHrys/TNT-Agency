// Build-time localization completeness validator (READ-ONLY).
//
// The site switches language client-side via the dictionary in public/script.js
// (a proven mechanism). This validator locks that dictionary's integrity so a
// mixed-language / missing-key regression cannot ship:
//
//   1. every language block (en/cs/de) exposes the SAME namespaces + keys
//      (no missing or orphaned translations);
//   2. every data-i18n="ns.key" used in components/pages resolves to a real
//      dictionary key AND is wired in the apply function of script.js;
//   3. preserved identifiers (legal entity, contact email) are never turned
//      into translated dictionary strings.
//
// It parses the flat two-level dictionary (namespace -> key -> string) textually
// so it needs no browser and no new dependency.

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SCRIPT = path.join(ROOT, 'public', 'script.js');
const SCAN_DIRS = [path.join(ROOT, 'components'), path.join(ROOT, 'pages')];
const LANGS = ['en', 'cs', 'de'];
const LEGAL_ENTITY = 'TNT agency s.r.o.';
const CONTACT_EMAIL = 'connect@talentpartnerid.com';
// Retired 2026-10-05. Any reappearance is a regression, not a variant.
const RETIRED_EMAILS = ['jobbohemiacz@gmail.com'];

/** Byte offset of each `  <lang>: {` marker, plus end-of-object. */
function languageRegions(text) {
  const regions = {};
  for (const lang of LANGS) {
    const m = text.match(new RegExp(`\\n  ${lang}:\\s*\\{`));
    if (!m) throw new Error(`Language block "${lang}" not found in script.js dictionary`);
    regions[lang] = m.index;
  }
  const order = LANGS.map((l) => [l, regions[l]]).sort((a, b) => a[1] - b[1]);
  const out = {};
  for (let i = 0; i < order.length; i++) {
    const [lang, start] = order[i];
    const end = i + 1 < order.length ? order[i + 1][1] : text.length;
    out[lang] = text.slice(start, end);
  }
  return out;
}

/**
 * Parse a language region into { namespace: Set(keys) } from indentation.
 * Handles one level of nesting: `candidates: { card: { label, link } }` yields
 * the dotted key `card.label` under `candidates`. Arrays are ignored.
 */
function parseDict(region) {
  const dict = {};
  let ns = null; // top-level namespace (4-space)
  let sub = null; // nested object key prefix (6-space)
  for (const line of region.split('\n')) {
    const nsM = line.match(/^ {4}(\w+):\s*\{/);
    if (nsM) {
      ns = nsM[1];
      sub = null;
      dict[ns] = dict[ns] || new Set();
      continue;
    }
    if (/^ {4}\}/.test(line)) {
      ns = null;
      sub = null;
      continue;
    }
    const subM = line.match(/^ {6}(\w+):\s*\{\s*$/); // nested object open
    if (subM && ns) {
      sub = subM[1];
      continue;
    }
    if (/^ {6}\}/.test(line)) {
      sub = null;
      continue;
    }
    const leaf6 = line.match(/^ {6}(\w+):\s*['"`]/);
    if (leaf6 && ns && !sub) {
      dict[ns].add(leaf6[1]);
      continue;
    }
    const leaf8 = line.match(/^ {8}(\w+):\s*['"`]/);
    if (leaf8 && ns && sub) {
      dict[ns].add(`${sub}.${leaf8[1]}`);
      continue;
    }
  }
  return dict;
}

/** Collect every data-i18n="..." key used in the scanned source. */
function collectUsedKeys(dirs = SCAN_DIRS) {
  const used = new Set();
  const walk = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) walk(full);
      else if (/\.(tsx?|jsx?)$/.test(e.name)) {
        const src = fs.readFileSync(full, 'utf8');
        for (const m of src.matchAll(/data-i18n="([^"]+)"/g)) used.add(m[1]);
      }
    }
  };
  dirs.forEach(walk);
  return used;
}

function validate() {
  const text = fs.readFileSync(SCRIPT, 'utf8');
  const regions = languageRegions(text);
  const dicts = Object.fromEntries(LANGS.map((l) => [l, parseDict(regions[l])]));
  const errors = [];

  // 1. Namespace + key parity across en/cs/de.
  const allNs = new Set(LANGS.flatMap((l) => Object.keys(dicts[l])));
  for (const ns of allNs) {
    const keySets = LANGS.map((l) => dicts[l][ns] || new Set());
    const union = new Set(keySets.flatMap((s) => [...s]));
    for (const key of union) {
      const missing = LANGS.filter((l, i) => !keySets[i].has(key));
      if (missing.length) errors.push(`Key "${ns}.${key}" missing in: ${missing.join(', ')}`);
    }
  }

  // 2. Every used data-i18n key resolves + is wired in the apply function.
  //    Header/footer mirror desktop keys under an "mnav"/"m*" prefix that maps to
  //    the same namespace object, so resolve the base namespace by stripping a
  //    leading "m" when the literal namespace is absent.
  const used = collectUsedKeys();
  const resolveNs = (ns) => (dicts.en[ns] ? ns : ns.startsWith('m') ? ns.slice(1) : ns);
  for (const full of used) {
    const idx = full.indexOf('.');
    const ns = full.slice(0, idx);
    const key = full.slice(idx + 1); // supports dotted nested keys (card.label)
    const baseNs = resolveNs(ns);
    const has = LANGS.every((l) => dicts[l][baseNs] && dicts[l][baseNs].has(key));
    if (!has) errors.push(`data-i18n="${full}" has no matching cs/en/de dictionary key (namespace ${baseNs})`);
    // Wired either by a literal qs('[data-i18n="ns.key"]', ...) call OR by a
    // dynamic per-namespace loop qsa('[data-i18n="ns.${k}"]', ...).
    const wiredLiteral = text.includes(`data-i18n="${full}"`);
    const wiredDynamic = text.includes('data-i18n="' + ns + '.${');
    if (!wiredLiteral && !wiredDynamic) {
      errors.push(`data-i18n="${full}" is used in source but not wired in script.js apply()`);
    }
  }

  // 3. Preserved identifiers may appear inside localized sentences (only the
  //    surrounding words change) — but the identifier itself must NEVER be
  //    altered/translated. Flag only altered forms.
  for (const l of LANGS) {
    if (/TNT agency(?! s\.r\.o\.)/.test(regions[l])) {
      errors.push(`Altered legal-entity form (not "${LEGAL_ENTITY}") in ${l}`);
    }
    for (const m of regions[l].matchAll(/[\w.+-]+@talentpartnerid\.com/g)) {
      if (m[0] !== CONTACT_EMAIL) errors.push(`Altered contact email "${m[0]}" in ${l}`);
    }
    for (const retired of RETIRED_EMAILS) {
      if (regions[l].includes(retired)) errors.push(`Retired contact email "${retired}" in ${l}`);
    }
  }

  // 4. Editorial Strategy-2: the shared SeoArticle template (all 133 editorial
  //    pages) must render the availability notice and mark the Czech body lang.
  const seo = fs.readFileSync(path.join(ROOT, 'components', 'SeoArticle.tsx'), 'utf8');
  if (!seo.includes('ArticleLanguageNotice')) {
    errors.push('SeoArticle is missing the Strategy-2 <ArticleLanguageNotice/>');
  }
  if (!/className="seo-body" lang="cs"/.test(seo)) {
    errors.push('SeoArticle Czech body is missing lang="cs"');
  }

  // 5. Dedicated calculator must be localized via the bridge + typed registry,
  //    with Strategy-2 on its long-form Czech legal editorial.
  const dcalc = fs.readFileSync(path.join(ROOT, 'pages', 'kalkulacka-mzdy-agenturniho-zamestnance.tsx'), 'utf8');
  if (!dcalc.includes('useLang') || !dcalc.includes('DCALC')) {
    errors.push('Dedicated calculator page is not wired to useLang + the DCALC registry');
  }
  if (!dcalc.includes('ArticleLanguageNotice')) {
    errors.push('Dedicated calculator editorial section is missing the Strategy-2 notice');
  }
  // Its typed registry must have cs/en/de parity (structural, not regex).
  try {
    const registry = fs.readFileSync(path.join(ROOT, 'lib', 'i18n', 'dedicated-calculator-copy.ts'), 'utf8');
    for (const lang of LANGS) {
      if (!new RegExp(`const ${lang}: DCalcCopy = \\{`).test(registry)) {
        errors.push(`DCALC registry missing the "${lang}" object`);
      }
    }
  } catch {
    errors.push('DCALC registry file (lib/i18n/dedicated-calculator-copy.ts) not found');
  }

  // 6. Phase B agency-value registry: cs/en/de objects present + no forbidden
  //    guaranteed-savings / lower-contribution claims.
  try {
    const av = fs.readFileSync(path.join(ROOT, 'lib', 'agency-value', 'copy.ts'), 'utf8');
    for (const lang of LANGS) {
      if (!new RegExp(`const ${lang}: AgencyValueCopy = \\{`).test(av)) {
        errors.push(`AGENCY_VALUE registry missing the "${lang}" object`);
      }
    }
    const forbidden = [
      /guaranteed saving/i, /always cheaper/i, /zaručen[éá] úspor/i, /vždy levnější/i,
      /garantierte einsparung/i, /immer günstiger/i, /nižší odvody/i, /lower (statutory )?contribution/i,
    ];
    for (const re of forbidden) {
      if (re.test(av)) errors.push(`Forbidden savings/claim phrase in agency-value copy: ${re}`);
    }
  } catch {
    // Agency-value copy is Phase B; only enforce if the branch includes it.
    if (fs.existsSync(path.join(ROOT, 'components', 'HomeAgencyValue.tsx'))) {
      errors.push('HomeAgencyValue present but lib/agency-value/copy.ts registry not found');
    }
  }

  return { dicts, used, errors, namespaces: [...allNs] };
}

module.exports = { languageRegions, parseDict, collectUsedKeys, validate, LANGS };

if (require.main === module) {
  try {
    const { dicts, used, errors, namespaces } = validate();
    const navKeys = LANGS.map((l) => (dicts[l].nav ? dicts[l].nav.size : 0));
    if (errors.length) {
      console.error(`i18n validation: FAIL (${errors.length})`);
      for (const e of errors) console.error(`  - ${e}`);
      process.exit(1);
    }
    console.log('i18n validation: PASS');
    console.log(`  languages:      ${LANGS.join(', ')}`);
    console.log(`  namespaces:     ${namespaces.length} (${namespaces.join(', ')})`);
    console.log(`  nav keys (en/cs/de): ${navKeys.join(' / ')}`);
    console.log(`  data-i18n keys used: ${used.size}, all resolved + wired`);
  } catch (err) {
    console.error(`i18n validation error: ${err.message}`);
    process.exit(1);
  }
}
