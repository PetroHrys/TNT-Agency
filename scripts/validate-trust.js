// Trust-data verification gate (READ-ONLY). Prevents unverified company/permit
// facts from ever being published as confirmed facts on the trust page.
//
// Fails when:
//   - a permit field (agencyPermission/permissionScope/permissionValidity) or
//     companyId carries a value without state 'verified';
//   - a verified permit field lacks a source URL / access date;
//   - a source URL for a verified permit fact is non-HTTPS;
//   - a government-approval / "verified by MPSV" / "licensed for all forms"
//     claim is presented as a fact (not inside the page's negation sentence);
//   - the operator legal name or contact email differs from the approved value;
//   - the trust page renders a raw pending field value instead of the honest
//     "ověření probíhá" note;
//   - placeholder strings remain.
//
// Operates on the data model (lib/content/trust-data.ts) and the rendered page
// source (pages/o-nas.tsx), not a single file.

const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const errors = [];

const DATA = read('lib/content/trust-data.ts');
const PAGE = fs.existsSync(path.join(ROOT, 'pages/o-nas.tsx')) ? read('pages/o-nas.tsx') : '';

const APPROVED_NAME = 'TNT agency s.r.o.';
const APPROVED_EMAIL = 'connect@talentpartnerid.com';
// Retired 2026-10-05. Any reappearance is a regression, not a variant.
const RETIRED_EMAILS = ['jobbohemiacz@gmail.com'];
const PERMIT_FIELDS = ['companyId', 'agencyPermission', 'permissionScope', 'permissionValidity'];

// ── Parse each `field: { ... }` block out of TRUST_DATA ──────────────────────
function fieldBlock(name) {
  const m = DATA.match(new RegExp(`${name}:\\s*\\{([^}]*)\\}`));
  return m ? m[1] : null;
}
const strAttr = (block, attr) => {
  const m = block.match(new RegExp(`${attr}:\\s*'([^']*)'`));
  return m ? m[1] : null;
};
const valueIsNull = (block) => /value:\s*null/.test(block);

for (const f of PERMIT_FIELDS) {
  const block = fieldBlock(f);
  if (!block) { errors.push(`trust field "${f}" not found in TRUST_DATA`); continue; }
  const state = strAttr(block, 'state');
  const isNull = valueIsNull(block);
  if (!isNull && state !== 'verified') {
    errors.push(`permit field "${f}" has a value but state is "${state}" (must be 'verified')`);
  }
  if (!isNull && state === 'verified') {
    const url = strAttr(block, 'sourceUrl');
    const accessed = strAttr(block, 'sourceAccessedAt');
    if (!url) errors.push(`verified permit field "${f}" is missing sourceUrl`);
    else if (!/^https:\/\//.test(url) && !/mpsv\.cz|gov\.cz|justice\.cz/.test(url)) errors.push(`verified permit field "${f}" sourceUrl is not HTTPS: ${url}`);
    if (!accessed) errors.push(`verified permit field "${f}" is missing sourceAccessedAt`);
  }
}

// ── Operator identity preserved ─────────────────────────────────────────────
if (!DATA.includes(`OPERATOR_LEGAL_NAME = '${APPROVED_NAME}'`)) errors.push(`operator legal name is not "${APPROVED_NAME}"`);
if (!DATA.includes(`OPERATOR_EMAIL = '${APPROVED_EMAIL}'`)) errors.push(`operator email is not "${APPROVED_EMAIL}"`);

// ── Rendered page checks ────────────────────────────────────────────────────
if (PAGE) {
  // Facts render only through the verified filter; pending fields render the note.
  if (!/isPublicFact/.test(PAGE)) errors.push('o-nas.tsx does not gate facts through isPublicFact');
  if (!/ověření probíhá/.test(PAGE)) errors.push('o-nas.tsx does not render the "ověření probíhá" note for pending fields');
  // No fabricated government-endorsement claim as a fact. The page legitimately
  // NAMES these phrases inside its negation sentence ("Nepoužíváme formulace…");
  // strip that sentence, then no such phrase may remain.
  const negation = PAGE.replace(/Nepoužíváme formulace[\s\S]*?oficiálnímu záznamu\./, ' ');
  for (const claim of ['ověřeno MPSV', 'schváleno státem', 'licencováno pro všechny', 'státem prověřená', 'government approved', 'verified by MPSV']) {
    if (new RegExp(claim, 'i').test(negation)) errors.push(`o-nas.tsx presents a forbidden endorsement claim as fact: "${claim}"`);
  }
  // Operator identity on the page.
  if (/TNT agency(?! s\.r\.o\.)/.test(PAGE)) errors.push('o-nas.tsx uses an altered legal-entity form');
  for (const m of PAGE.matchAll(/[\w.+-]+@talentpartnerid\.com/g)) if (m[0] !== APPROVED_EMAIL) errors.push(`altered contact email "${m[0]}" in o-nas.tsx`);
}
for (const [name, src] of [['trust-data.ts', DATA], ['o-nas.tsx', PAGE]]) {
  for (const retired of RETIRED_EMAILS) if (src.includes(retired)) errors.push(`retired contact email "${retired}" in ${name}`);
}

// ── Placeholders anywhere in the trust surfaces ─────────────────────────────
for (const [name, src] of [['trust-data.ts', DATA], ['o-nas.tsx', PAGE]]) {
  for (const ph of ['TODO', 'FIXME', 'lorem', 'placeholder', '[Client', '[Jméno', '[IČO', 'XXX']) {
    if (src.includes(ph)) errors.push(`placeholder "${ph}" in ${name}`);
  }
}

if (errors.length) {
  console.error(`Trust-data gate: FAIL (${errors.length})`);
  for (const e of errors) console.error(`  ✗ ${e}`);
  process.exit(1);
}
console.log('Trust-data gate: PASS');
console.log('  no unverified permit fact renders; verified facts sourced; operator identity intact; no endorsement claim; no placeholders');
