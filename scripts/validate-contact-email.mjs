// Built-output contact-email gate (READ-ONLY).
//
// lib/content/trust-data.ts holds the one public contact address and every
// component imports it, but a constant proves nothing about what a visitor
// receives: public/*.html cannot import it, the public/script.js dictionary is
// plain text, and a JSON-LD node or a mailto can always be written by hand. This
// gate reads what the build actually serves.
//
// Fails when the served output:
//   - contains a retired address, or any Gmail address, anywhere — HTML,
//     JSON-LD, client or server bundles, public/script.js;
//   - has a mailto: whose recipient is not the approved address (the listed
//     third-party authorities excepted);
//   - shows one address as link text while the link sends to another;
//   - declares a JSON-LD email other than the approved address;
//   - names any other @talentpartnerid.com address;
//   - lost the approved mailto on a surface that must carry it;
//   - is missing — an empty scan proves nothing, so it fails.
//
// Run after `npm run build`: node scripts/validate-contact-email.mjs
// Mutation tests: node scripts/mutate-contact-email.mjs

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const APPROVED = 'connect@talentpartnerid.com'
// Retired 2026-10-05. Any reappearance is a regression, not a variant.
export const RETIRED = ['jobbohemiacz@gmail.com']
// Addresses of public authorities the site legitimately names. Never the operator.
export const THIRD_PARTY = ['posta@uoou.cz', 'brasilia.consulate@mzv.gov.cz']

// Served surfaces that must carry a working mailto to the approved address.
// Prerendered pages live under .next/server/pages; static files under public/.
export const REQUIRED = [
  '.next/server/pages/index.html',
  '.next/server/pages/contact.html',
  '.next/server/pages/en/contact.html',
  '.next/server/pages/de/kontakt.html',
  '.next/server/pages/o-nas.html',
  '.next/server/pages/privacy-policy.html',
  '.next/server/pages/poptavka-pracovniku.html',
  '.next/server/pages/en/request-staff.html',
  '.next/server/pages/de/personal-anfragen.html',
  '.next/server/pages/pt-br.html',
  '.next/server/pages/es.html',
  '.next/server/pages/pt-br/candidatar-se.html',
  '.next/server/pages/es/postularme.html',
  'public/privacy-cs.html',
  'public/privacy-de.html',
  'public/cookies.html',
  'public/cookies-cs.html',
  'public/cookies-de.html',
  'public/terms.html',
  'public/terms-cs.html',
  'public/terms-de.html',
  'public/blog/agenturni-pracovnici-vs-interni-zamestnanci.html',
]

const EMAIL = /[\w.+-]+@[\w-]+(?:\.[\w-]+)*\.[a-z]{2,}/gi
const decodeEntities = (s) =>
  s.replace(/&amp;/g, '&').replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
const recipientOf = (href) => decodeURIComponent(decodeEntities(href).slice('mailto:'.length).split('?')[0]).trim()

/**
 * @param {{ files: [string, string][], required?: string[] }} input  [relPath, text] pairs
 * @returns {{ errors: string[], stats: { files: number, html: number, mailto: number, jsonLd: number } }}
 */
export function auditContactEmail({ files, required = REQUIRED }) {
  const errors = []
  const stats = { files: files.length, html: 0, mailto: 0, jsonLd: 0 }
  if (!files.some(([rel]) => rel.startsWith('.next/server/pages/') && rel.endsWith('.html'))) {
    errors.push('no build output under .next/server/pages — run `npm run build` first')
  }

  for (const [rel, text] of files) {
    for (const retired of RETIRED) {
      if (text.includes(retired) || text.includes(retired.replace('@', '%40'))) errors.push(`${rel}: retired address ${retired}`)
    }
    for (const m of text.matchAll(/[\w.+-]+(?:@|%40)gmail\.com/gi)) {
      if (!RETIRED.includes(m[0].replace('%40', '@'))) errors.push(`${rel}: Gmail address ${m[0]} — the operator mailbox is no longer Gmail`)
    }
    for (const m of text.matchAll(/[\w.+-]+(?:@|%40)talentpartnerid\.com/gi)) {
      if (m[0].replace('%40', '@') !== APPROVED) errors.push(`${rel}: ${m[0]} is not the approved address ${APPROVED}`)
    }
    if (!rel.endsWith('.html')) continue
    stats.html++

    // Every mailto recipient, in any attribute quoting.
    for (const m of text.matchAll(/href=(["'])(mailto:[^"']*)\1/gi)) {
      stats.mailto++
      const to = recipientOf(m[2])
      if (to !== APPROVED && !THIRD_PARTY.includes(to)) errors.push(`${rel}: mailto recipient "${to}" is not ${APPROVED}`)
    }
    // Visible address and destination must agree.
    for (const m of text.matchAll(/<a\b[^>]*\bhref=(["'])(mailto:[^"']*)\1[^>]*>([\s\S]*?)<\/a>/gi)) {
      const to = recipientOf(m[2])
      const shown = decodeEntities(m[3].replace(/<[^>]*>/g, '')).match(EMAIL) ?? []
      for (const s of shown) if (s !== to) errors.push(`${rel}: link text shows ${s} but sends to ${to}`)
    }
    // Structured data.
    for (const s of text.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)) {
      for (const e of s[1].matchAll(/"email"\s*:\s*"([^"]*)"/g)) {
        stats.jsonLd++
        const value = e[1].replace(/^mailto:/, '')
        if (value !== APPROVED) errors.push(`${rel}: JSON-LD email "${e[1]}" is not ${APPROVED}`)
      }
    }
  }

  const byPath = new Map(files)
  for (const rel of required) {
    const text = byPath.get(rel)
    if (text === undefined) errors.push(`${rel}: required surface missing from the served output`)
    else if (!new RegExp(`href=(["'])mailto:${APPROVED.replace(/\./g, '\\.')}[?"']`).test(text)) {
      errors.push(`${rel}: no mailto contact for ${APPROVED}`)
    }
  }
  return { errors, stats }
}

/** Everything the deployment can serve: prerendered pages, bundles, public/. */
export function collectServedFiles(root) {
  const out = []
  const walk = (rel) => {
    const abs = path.join(root, rel)
    if (!fs.existsSync(abs)) return
    for (const e of fs.readdirSync(abs, { withFileTypes: true })) {
      const child = path.posix.join(rel, e.name)
      if (e.isDirectory()) walk(child)
      else if (/\.(html|js|json|txt|xml|webmanifest)$/.test(e.name)) out.push([child, fs.readFileSync(path.join(root, child), 'utf8')])
    }
  }
  walk('.next/server')
  walk('.next/static')
  walk('public')
  return out
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (isMain) {
  const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
  const { errors, stats } = auditContactEmail({ files: collectServedFiles(ROOT) })
  if (errors.length) {
    console.error(`Contact-email gate: FAIL (${errors.length})`)
    for (const e of errors) console.error(`  ✗ ${e}`)
    process.exit(1)
  }
  console.log('Contact-email gate: PASS')
  console.log(`  ${stats.files} served files, ${stats.html} HTML; ${stats.mailto} mailto links and ${stats.jsonLd} JSON-LD emails, all ${APPROVED} (or a listed authority)`)
  console.log(`  ${REQUIRED.length} required surfaces carry the mailto; no retired, Gmail or variant @talentpartnerid.com address anywhere`)
}
