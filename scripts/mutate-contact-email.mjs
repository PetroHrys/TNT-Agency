// Mutation tests for the contact-email gate.
//
// Each mutation re-introduces one way the migration to connect@talentpartnerid.com
// could silently regress, applied to the REAL served output of the last build,
// and expects the gate to name it. A mutation that fails to land is itself a
// failure — a rewrite that matched nothing would make the gate look effective.
//
// The last mutation is at source level: it restores the retired address in
// lib/content/trust-data.ts and expects the focused unit test and the trust gate
// to fail. The file's original bytes are written back in `finally`.
//
// Run after `npm run build`: node scripts/mutate-contact-email.mjs

import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { auditContactEmail, collectServedFiles, APPROVED, RETIRED } from './validate-contact-email.mjs'

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const OLD = RETIRED[0]
const SERVED = collectServedFiles(ROOT)

/** Replace in one served file; throws unless the replacement changed it. */
const mutate = (rel, from, to) => {
  let landed = false
  const files = SERVED.map(([r, text]) => {
    if (r !== rel) return [r, text]
    const next = typeof from === 'string' ? text.split(from).join(to) : text.replace(from, to)
    landed = next !== text
    return [r, next]
  })
  if (!landed) throw new Error(`mutation did not land in ${rel}`)
  return files
}
const firstChunkWith = (needle) => {
  const hit = SERVED.find(([r, t]) => r.startsWith('.next/static/') && r.endsWith('.js') && t.includes(needle))
  if (!hit) throw new Error(`no client chunk contains ${needle}`)
  return hit[0]
}

const MUTATIONS = [
  {
    name: '1. the retired address restored as the contact-page recipient',
    expect: /contact\.html: retired address jobbohemiacz@gmail\.com/,
    files: () => mutate('.next/server/pages/contact.html', APPROVED, OLD),
  },
  {
    name: '2. the new address shown, but the link still sends to the old one',
    expect: /privacy-cs\.html: link text shows connect@talentpartnerid\.com but sends to jobbohemiacz@gmail\.com/,
    files: () => mutate('public/privacy-cs.html', `href="mailto:${APPROVED}"`, `href="mailto:${OLD}"`),
  },
  {
    name: '3. the link sends to the new address, but the old one is shown',
    expect: /terms-de\.html: link text shows jobbohemiacz@gmail\.com but sends to connect@talentpartnerid\.com/,
    files: () => mutate('public/terms-de.html', `>${APPROVED}</a>`, `>${OLD}</a>`),
  },
  {
    name: '4. a JSON-LD email reverted on the homepage',
    expect: /index\.html: JSON-LD email "info@example\.org"/,
    files: () => mutate('.next/server/pages/index.html', /"email":"connect@talentpartnerid\.com"/, '"email":"info@example.org"'),
  },
  {
    name: '5. a near-miss variant of the new address',
    expect: /cookies\.html: contact@talentpartnerid\.com is not the approved address/,
    files: () => mutate('public/cookies.html', APPROVED, 'contact@talentpartnerid.com'),
  },
  {
    name: '6. the retired address back in a client bundle (the employer recipient)',
    expect: /\.next\/static\/.*\.js: retired address/,
    files: () => mutate(firstChunkWith(APPROVED), APPROVED, OLD),
  },
  {
    name: '7. the candidate fallback recipient swapped for an unrelated mailbox',
    expect: /candidatar-se\.html: mailto recipient "someone@example\.org"/,
    files: () => mutate('.next/server/pages/pt-br/candidatar-se.html', `href="mailto:${APPROVED}"`, 'href="mailto:someone@example.org"'),
  },
  {
    name: '8. a legal page loses its contact link entirely',
    expect: /privacy-de\.html: no mailto contact/,
    files: () => mutate('public/privacy-de.html', /href="mailto:connect@talentpartnerid\.com"/g, 'href="/contact"'),
  },
  {
    name: '9. a different Gmail mailbox introduced as a contact',
    expect: /script\.js: Gmail address jobs\.tpid@gmail\.com/,
    files: () => mutate('public/script.js', APPROVED, 'jobs.tpid@gmail.com'),
  },
  {
    name: '10. no build output — an empty scan must not pass',
    expect: /no build output/,
    files: () => SERVED.filter(([r]) => !r.startsWith('.next/')),
  },
]

let failed = 0
const baseline = auditContactEmail({ files: SERVED })
if (baseline.errors.length) {
  console.error('Baseline is not clean — mutations would prove nothing:')
  for (const e of baseline.errors) console.error(`  ${e}`)
  process.exit(1)
}
console.log(`baseline: PASS (${baseline.stats.html} HTML, ${baseline.stats.mailto} mailto, ${baseline.stats.jsonLd} JSON-LD)`)

for (const m of MUTATIONS) {
  let errors
  try {
    errors = auditContactEmail({ files: m.files() }).errors
  } catch (e) {
    failed++
    console.error(`✗ ${m.name}\n    ${e.message}`)
    continue
  }
  if (errors.some((e) => m.expect.test(e))) console.log(`✓ ${m.name}`)
  else {
    failed++
    console.error(`✗ ${m.name} — SURVIVED\n    expected ${m.expect}\n    got: ${errors.slice(0, 3).join(' | ') || '(no errors)'}`)
  }
}

// ── Source-level: the retired address restored in the operator record ───────
const TRUST = path.join(ROOT, 'lib/content/trust-data.ts')
const original = fs.readFileSync(TRUST)
try {
  const text = original.toString('utf8')
  const mutated = text.replace(`OPERATOR_EMAIL = '${APPROVED}'`, `OPERATOR_EMAIL = '${OLD}'`)
  if (mutated === text) throw new Error('source mutation did not land in trust-data.ts')
  fs.writeFileSync(TRUST, mutated)
  const run = (cmd, args) => spawnSync(cmd, args, { cwd: ROOT, encoding: 'utf8', env: { ...process.env, NO_COLOR: '1' } })
  const unit = run('npx', ['vitest', 'run', 'lib/content/contact-email.test.ts'])
  const trust = run('node', ['scripts/validate-trust.js'])
  const name = '11. source: trust-data.ts restored to the retired address'
  if (unit.status !== 0 && trust.status !== 0) console.log(`✓ ${name} (unit test exit ${unit.status}, trust gate exit ${trust.status})`)
  else {
    failed++
    console.error(`✗ ${name} — SURVIVED (unit test exit ${unit.status}, trust gate exit ${trust.status})`)
  }
} finally {
  fs.writeFileSync(TRUST, original)
}
if (!fs.readFileSync(TRUST).equals(original)) {
  console.error('trust-data.ts was not restored byte-for-byte')
  process.exit(1)
}

const total = MUTATIONS.length + 1
if (failed) {
  console.error(`\ncontact-email mutations: ${failed}/${total} survived or did not land`)
  process.exit(1)
}
console.log(`\ncontact-email mutations: ${total}/${total} killed`)
