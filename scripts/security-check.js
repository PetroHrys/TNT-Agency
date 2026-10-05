// Phase E Lite — Security & architecture regression check (READ-ONLY).
//
// This architecture is deliberately backend-free. The checks below fail the
// build if a backend, a secret, a network lead submission, a data-persistence
// path or a false "request sent" claim is (re)introduced.
//
// Run with: node scripts/security-check.js

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const errors = [];
const checked = [];

const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const exists = (p) => fs.existsSync(path.join(ROOT, p));

/** Source with comments stripped: assertions must target code, not prose. */
const code = (src) =>
  src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');

const walk = (dir, ext, out = []) => {
  const full0 = path.join(ROOT, dir);
  if (!fs.existsSync(full0)) return out;
  for (const e of fs.readdirSync(full0, { withFileTypes: true })) {
    const rel = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (['node_modules', '.next', '.git'].includes(e.name)) continue;
      walk(rel, ext, out);
    } else if (ext.some((x) => e.name.endsWith(x))) out.push(rel);
  }
  return out;
};

const check = (name, ok, detail) => {
  checked.push(name);
  if (!ok) errors.push(`${name}${detail ? ` — ${detail}` : ''}`);
};

// Application source (excludes tests, which legitimately name forbidden strings).
const appFiles = [
  ...walk('components', ['.tsx', '.ts']),
  ...walk('lib', ['.ts', '.tsx']),
  ...walk('pages', ['.tsx', '.ts']),
].filter((f) => !f.endsWith('.test.ts') && !f.endsWith('.test.tsx'));

// ── 1. No backend of any kind ────────────────────────────────────────────
const pkg = JSON.parse(read('package.json'));
const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
const backendPkgs = Object.keys(deps).filter((d) =>
  /supabase|prisma|drizzle|mongoose|pg$|mysql|firebase|resend|nodemailer|sendgrid|postmark|@aws-sdk/i.test(d),
);
check('no database or email-provider package in dependencies', backendPkgs.length === 0, backendPkgs.join(', '));

check('no supabase/ migrations directory in the deployable tree', !exists('supabase'),
  'migrations must not imply they are applied at deploy time');
check('no server API routes', !exists('pages/api'));
check('no server-only lib directory', !exists('lib/server'));

for (const f of appFiles) {
  const src = code(read(f));
  if (/createClient\s*\(|@supabase\/|supabase\./i.test(src)) errors.push(`Supabase client initialization in ${f}`);
  if (/SUPABASE_URL|SUPABASE_ANON_KEY|SUPABASE_SERVICE_ROLE_KEY|SERVICE_ROLE|service_role/.test(src)) {
    errors.push(`Supabase environment/service-role reference in ${f}`);
  }
  if (/DATABASE_URL|postgres(ql)?:\/\//.test(src)) errors.push(`Database URL requirement in ${f}`);
}
check('no Supabase client initialization in application code', errors.length === 0);
check('no Supabase or database environment variable required', true);

// ── 2. No hardcoded credentials ──────────────────────────────────────────
const before = errors.length;
for (const f of [...appFiles, ...walk('scripts', ['.js'])]) {
  const src = read(f);
  if (/['"`]eyJ[A-Za-z0-9_-]{20,}/.test(src)) errors.push(`Possible hardcoded JWT/API key in ${f}`);
  if (/postgres(ql)?:\/\/[^'"`\s]*:[^'"`\s]*@/.test(src)) errors.push(`Hardcoded DB URL with credentials in ${f}`);
}
check('no hardcoded credentials in source', errors.length === before);

// ── 3. The form must not transmit ────────────────────────────────────────
const FORM = code(read('components/EmployerRequestForm.tsx'));
check('form performs no fetch', !/\bfetch\s*\(/.test(FORM));
check('form performs no XMLHttpRequest', !/XMLHttpRequest/.test(FORM));
check('form performs no sendBeacon', !/sendBeacon/.test(FORM));
check('form sends nothing to analytics', !/gtag\(|dataLayer|analytics\./.test(FORM));

const TRANSPORT = code(read('lib/leads-lite/transport.ts'));
check('transport performs no network I/O', !/\bfetch\s*\(|XMLHttpRequest|sendBeacon/.test(TRANSPORT));
check('mailto is the only active transport', /class MailtoLeadTransport/.test(TRANSPORT)
  && !/class (NetlifyFunction|EmailApi|Database)LeadTransport/.test(TRANSPORT));

// ── 4. No persistence of lead or personal data ───────────────────────────
check('form does not use localStorage', !/localStorage/.test(FORM));
check('form does not use cookies', !/document\.cookie/.test(FORM));
check('form does not use IndexedDB', !/indexedDB/.test(FORM));
check('form does not mutate URL or history', !/history\.(push|replace)State|location\.search\s*=|location\.hash\s*=/.test(FORM));

const REFERENCE = code(read('lib/leads-lite/reference.ts'));
check('lead reference is not persisted', !/localStorage|sessionStorage|document\.cookie|indexedDB/.test(REFERENCE));

const ATTRIBUTION = code(read('lib/attribution/index.ts'));
check('attribution enforces a denylist', /ATTRIBUTION_DENYLIST/.test(ATTRIBUTION) && /throw new Error/.test(ATTRIBUTION));
check('attribution is session-scoped only (never localStorage/cookies)',
  /sessionStorage/.test(ATTRIBUTION) && !/localStorage|document\.cookie|indexedDB/.test(ATTRIBUTION));

// ── 5. No calculator economics may reach the request ─────────────────────
const MAILTO = code(read('lib/employer-request/mailto.ts'));
const SCHEMA = code(read('lib/employer-request/schema.ts'));
for (const banned of ['netSalary', 'employerCost', 'agencyFee', 'grossSalary', 'margin', 'markup', 'savings']) {
  check(`mailto builder never references ${banned}`, !MAILTO.includes(banned));
  check(`request schema has no ${banned} field`, !SCHEMA.includes(banned));
}
// A budget the employer types themselves is legitimate and must remain.
check('employer-entered budget field is present', /name: 'budget'/.test(SCHEMA));

// ── 6. Honesty: prepared, never "sent" ───────────────────────────────────
const COPY = read('lib/employer-request/copy.ts');
// The invariant is that no copy may claim the request HAS BEEN sent or
// received. Instructions to send ("Odeslání dokončete...") and honest negations
// ("we have not received it yet") are required wording, so match completed
// delivery specifically rather than the verb in general. An earlier, blunter
// version of this check flagged the prescribed instruction text as a violation.
const deliveryClaims = [
  /\bbyla odesl[áa]na\b/i, /\bbylo odesl[áa]no\b/i, /\búspěšně odesl/i,
  /\bobdrželi jsme\b/i, /\bjsme obdrželi\b/i, /\bpoptávka byla přijata\b/i,
  /\bhas been sent\b/i, /\bwas sent\b/i, /\brequest sent\b/i,
  /\bsuccessfully submitted\b/i, /\bwe(?: have)? received\b/i,
  /\bwurde gesendet\b/i, /\bwurde versendet\b/i, /\bwurde übermittelt\b/i,
  /\berfolgreich gesendet\b/i, /\bhaben wir erhalten\b/i,
];
for (const re of deliveryClaims) {
  const hit = (COPY.match(re) || [])[0];
  check(`no completed-delivery claim in copy: ${re}`, !hit, hit);
}
// The email intro is rendered inside the prepared-panel preview before anything
// is sent, so it must describe preparation.
check('email intro describes preparation, not delivery',
  /emailIntro: '[^']*(připravená|prepared|vorbereitet)/.test(COPY),
  (COPY.match(/emailIntro: '[^']*'/g) || []).join(' | '));
check('copy states the request is prepared, in all three languages',
  /E-mailová zpráva byla připravena/.test(COPY)
  && /Your email request has been prepared/.test(COPY)
  && /Ihre E-Mail-Anfrage wurde vorbereitet/.test(COPY));
check('copy explicitly says we have not received it yet',
  /notSentNote/.test(COPY) && /neobdrželi/.test(COPY) && /not received/.test(COPY) && /noch nicht erhalten/.test(COPY));
check('form renders the not-yet-received note', /copy\.notSentNote/.test(FORM));
check('form has no success-state naming that implies delivery',
  !/'success'|status === 'sent'|setStatus\('sent'\)/.test(FORM));

// ── 7. No false backend UI ───────────────────────────────────────────────
// Target real authentication machinery, not vocabulary. Czech editorial content
// legitimately discusses "registrace u ČSSZ", and the pre-existing agency
// listing form is called "Registrace agentury" — neither is an account system.
const uiBlob = appFiles.map((f) => code(read(f))).join('\n');
for (const [label, re] of [
  ['password input (no credentials are ever collected)', /type=["']password["']/i],
  ['auth SDK usage', /\b(signInWith|signUp\(|signOut\(|createUserWith|getSession\(|onAuthStateChange)/],
  ['account/session cookie handling', /\b(setCookie|cookies\(\)|jwt|accessToken|refreshToken)\b/i],
  ['workspace/dashboard route', /['"`]\/(workspace|dashboard|account|admin)(\/|['"`])/],
]) {
  check(`no ${label}`, !re.test(uiBlob));
}
// No route file may exist for an account area.
for (const p of ['pages/workspace', 'pages/dashboard', 'pages/login', 'pages/account', 'pages/admin']) {
  check(`no ${p} route`, !exists(p));
}

// ── 8. Operator identity preserved ───────────────────────────────────────
check('mailto recipient is connect@talentpartnerid.com',
  /OPERATOR_EMAIL = 'connect@talentpartnerid\.com'/.test(read('lib/content/trust-data.ts')));
check('employer copy re-exports the operator record, with no recipient literal of its own',
  /import \{ OPERATOR_EMAIL \} from '\.\.\/content\/trust-data'/.test(COPY) && !/OPERATOR_EMAIL = /.test(COPY));
check('operator remains TNT agency s.r.o.',
  /OPERATOR = 'TNT agency s\.r\.o\.'/.test(COPY));
check('no altered legal-entity form', !/TNT agency(?! s\.r\.o\.)/.test(COPY));

// ── 9. WebmasterID analytics: exactly one integration, consent-gated ─────
// Inspects the whole application tree, not a single filename: the point is to
// catch a SECOND tracker, a changed site id or a rogue endpoint appearing
// anywhere, including in a page added long after this check was written.
const WMID_SITE_ID = 'wm_wfywm8g9qkoonabl';
const WMID_ENDPOINT = 'https://webmasterid-ingest-api.vercel.app/api/events';
const WMID_SRC = 'https://webmasterid.com/tracker.iife.min.js';
// The ecosystem product directory links to the WebmasterID product page. That
// is a marketing link that predates this integration, not an ingest endpoint.
const WMID_PRODUCT_URL = 'https://webmasterid.com/';

const CONSTANTS = 'lib/analytics/webmasterid.ts';
const ISLAND = 'components/analytics/WebmasterIDTracker.tsx';

check('WebmasterID constants module exists', exists(CONSTANTS));
check('WebmasterID analytics island exists', exists(ISLAND));

if (exists(CONSTANTS) && exists(ISLAND)) {
  const wmConst = read(CONSTANTS);
  const wmConstCode = code(wmConst);
  const wmIsland = code(read(ISLAND));

  // Exact approved configuration.
  check('exact WebmasterID site id', wmConst.includes(`'${WMID_SITE_ID}'`));
  check('exact WebmasterID ingest endpoint', wmConst.includes(`'${WMID_ENDPOINT}'`));
  check('exact approved tracker origin', wmConst.includes(`'${WMID_SRC}'`));
  check('tracker and ingest are HTTPS only',
    [WMID_SRC, WMID_ENDPOINT].every((u) => u.startsWith('https://')));
  check('no private key in analytics configuration',
    !/api[_-]?key|secret|token|Bearer|password/i.test(wmConstCode));

  // Exactly one integration, mounted from the shared layer.
  const renderers = appFiles.filter((f) => {
    const src = code(read(f));
    return src.includes('<Script') && src.includes('WEBMASTERID_SRC');
  });
  check('exactly one component renders the tracker', renderers.length === 1, renderers.join(', '));

  const mounts = appFiles.filter((f) => /<WebmasterIDTracker\s*\/>/.test(code(read(f))));
  check('tracker mounted exactly once', mounts.length === 1, mounts.join(', '));
  check('tracker mounted from the shared app layer', mounts[0] === 'pages/_app.tsx', mounts[0]);

  check('no WebmasterID Next.js SDK installed alongside the script tag',
    !Object.keys(deps).includes('@webmasterid/sdk-next'));
  check('tracker bundle is not vendored or self-hosted',
    !exists('public/tracker.iife.min.js') && !exists('public/webmasterid.js'));
  check('tracker is not proxied through this site', !/webmasterid/i.test(read('netlify.toml')));

  // No alternative site id or endpoint anywhere in the app tree.
  const beforeWmid = errors.length;
  for (const f of appFiles) {
    const src = code(read(f));
    for (const m of src.match(/wm_[0-9a-z]{16}/g) || []) {
      if (m !== WMID_SITE_ID) errors.push(`unexpected WebmasterID site id "${m}" in ${f}`);
    }
    for (const m of src.match(/https:\/\/[a-z0-9.-]*webmasterid[a-z0-9.-]*[^\s'"`)]*/gi) || []) {
      if (![WMID_SRC, WMID_ENDPOINT, WMID_PRODUCT_URL].includes(m)) {
        errors.push(`unexpected WebmasterID URL "${m}" in ${f}`);
      }
    }
    if (/data-wmid-form/.test(src)) errors.push(`form opted into analytics tracking in ${f}`);
    if (/data-wmid-(cta|event|value|currency|product|plan|source)|data-cta-id/.test(src)) {
      errors.push(`declarative analytics event attribute in ${f}`);
    }
  }
  check('no alternative WebmasterID site id or ingest endpoint in the app tree',
    errors.length === beforeWmid);

  // Consent gating.
  check('tracker is gated on granted analytics consent',
    /readConsent\(\) === 'accepted'/.test(wmIsland) && /if \(!granted\) return null/.test(wmIsland));
  check('gate precedes the script element',
    wmIsland.indexOf('if (!granted) return null') < wmIsland.indexOf('<Script'));
  check('tracker reuses the canonical consent store (no second consent state)',
    /lib\/consent/.test(wmIsland) && !/localStorage\.setItem/.test(wmIsland));
  check('rejecting consent clears the tracker identifiers',
    /clearWebmasterIdStorage\(\)/.test(code(read('components/CookieBanner.tsx'))));

  // Privacy: the integration must not reach form, calculator or lead data.
  for (const banned of [
    'companyName', 'contactName', 'email', 'phone', 'requirements', 'budget',
    'netSalary', 'grossSalary', 'employerCost', 'agencyFee', 'margin', 'savings',
    'mailto', 'clipboard', 'leadReference',
  ]) {
    check(`analytics code never references ${banned}`,
      !new RegExp(banned, 'i').test(wmIsland) && !new RegExp(banned, 'i').test(wmConstCode));
  }
  check('analytics code reads no field or form value',
    !/\.value\b|FormData|querySelector|getElementsBy/.test(wmIsland));
  check('no sendBeacon or fetch outside the official tracker bundle',
    !/sendBeacon|\bfetch\s*\(|XMLHttpRequest/.test(wmIsland) &&
    !/sendBeacon|\bfetch\s*\(|XMLHttpRequest/.test(wmConstCode));
  check('analytics creates no cookie',
    !/document\.cookie/.test(wmIsland) && !/document\.cookie/.test(wmConstCode));
  check('analytics writes no new browser storage (it may only clear the tracker keys)',
    !/setItem/.test(wmIsland) && !/setItem/.test(wmConstCode) && /removeItem/.test(wmConstCode));

  // Duplicate-event protection: the official bundle owns route tracking.
  check('no manual router tracking layered on the official bundle',
    !/useRouter|routeChangeComplete|router\.events/.test(wmIsland));
  check('single injection relies on the next/script id cache',
    /id=\{WEBMASTERID_SCRIPT_ID\}/.test(wmIsland));

  // Loading + failure behaviour.
  check('tracker uses a non-blocking post-hydration strategy',
    /strategy="afterInteractive"/.test(wmIsland) && !/beforeInteractive/.test(wmIsland));
  check('tracker preserves the documented defer attribute', /\n\s+defer\n/.test(wmIsland));
  check('tracker uses no inline executable script', !/dangerouslySetInnerHTML/.test(wmIsland));
  check('analytics failure is silent and unretried',
    !/alert\(|role="alert"|setInterval|retry/i.test(wmIsland));

  // SEO safety.
  check('analytics does not touch the sitemap', !/webmasterid/i.test(read('public/sitemap.xml')));
  check('analytics does not touch robots directives', !/webmasterid/i.test(read('public/robots.txt')));
  check('analytics is not server-rendered into page markup',
    !/webmasterid/i.test(read('pages/_document.tsx')));

  // No backend crept in with it.
  check('analytics added no API route', !exists('pages/api'));
  check('analytics added no serverless function', !exists('netlify/functions'));
  check('analytics requires no environment variable',
    !/process\.env/.test(wmIsland) && !/process\.env/.test(wmConstCode));
}

// ── Report ───────────────────────────────────────────────────────────────
if (errors.length) {
  console.error(`security check: FAIL (${errors.length})`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log('security check: PASS');
console.log(`  checks run: ${checked.length}`);
console.log('  no database, Supabase, API route or email-provider dependency');
console.log('  form transmits nothing: no fetch / XHR / beacon / analytics');
console.log('  no lead or personal data persisted to storage, cookies or the URL');
console.log('  no calculator economics can reach the request');
console.log('  status wording is "prepared", never "sent"');
console.log('  exactly one WebmasterID tracker, consent-gated, no form or calculator data');
