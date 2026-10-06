import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'
import { generateLeadReference, isLeadReference, REFERENCE_PATTERN } from './reference'
import { MailtoLeadTransport, activeLeadTransport } from './transport'
import { REQUEST_COPY, OPERATOR, OPERATOR_EMAIL } from '../employer-request/copy'
import { REQUEST_FIELDS } from '../employer-request/schema'
import { ATTRIBUTION_FIELDS, buildAttribution } from '../attribution'

const ROOT = process.cwd()
const read = (p: string) => fs.readFileSync(path.join(ROOT, p), 'utf8')
const stripComments = (s: string) =>
  s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1')

const FORM = read('components/EmployerRequestForm.tsx')
const FORM_CODE = stripComments(FORM)
const TRANSPORT_CODE = stripComments(read('lib/leads-lite/transport.ts'))
const REFERENCE_CODE = stripComments(read('lib/leads-lite/reference.ts'))
const PKG = JSON.parse(read('package.json'))

const LANGS = ['cs', 'en', 'de'] as const
const transport = new MailtoLeadTransport()

const validValues = () => ({
  companyName: 'Výrobní závod s.r.o.',
  contactName: 'Jan Novák',
  email: 'jan.novak@example.cz',
  phone: '+420 601 000 000',
  workplaceCity: 'Pardubice',
  workplaceRegion: 'pardubicky',
  profession: 'Operátor výroby',
  headcount: '12',
  employmentModel: 'agency',
  shiftModel: 'three-shift',
  medicalExam: 'Vstupní prohlídku zajišťuje agentura, kategorie práce 2.',
  consent: true,
})

const AT = new Date('2026-07-19T10:30:00Z')

describe('Phase E Lite — lead reference', () => {
  it('matches the documented TPID-YYYY-MMDD-XXXX format', () => {
    const ref = generateLeadReference(AT)
    expect(ref).toMatch(REFERENCE_PATTERN)
    expect(ref.startsWith('TPID-2026-0719-')).toBe(true)
    expect(isLeadReference(ref)).toBe(true)
  })

  it('embeds no personal data of any kind', () => {
    const ref = generateLeadReference(AT)
    const suffix = ref.split('-')[3]
    for (const secret of ['Novák', 'novak', 'jan', 'example', 'Výrobní', '12', 'Pardubice']) {
      expect(ref.toLowerCase()).not.toContain(secret.toLowerCase())
    }
    // Only the date is meaningful; the suffix is random, not derived.
    expect(suffix).toHaveLength(4)
  })

  it('omits ambiguous characters so it survives being retyped from an email', () => {
    const refs = Array.from({ length: 400 }, () => generateLeadReference(AT).split('-')[3]).join('')
    for (const ambiguous of ['I', 'L', 'O', 'U', '0', '1']) {
      expect(refs).not.toContain(ambiguous)
    }
  })

  it('is not sequential and varies between calls', () => {
    const set = new Set(Array.from({ length: 200 }, () => generateLeadReference(AT)))
    expect(set.size).toBeGreaterThan(150)
  })

  it('is never written to persistent browser storage', () => {
    expect(/localStorage|sessionStorage|document\.cookie|indexedDB/.test(REFERENCE_CODE)).toBe(false)
  })
})

describe('Phase E Lite — mailto transport', () => {
  it('is the only active transport, and it is mailto', () => {
    expect(activeLeadTransport.id).toBe('mailto')
    expect(/class (NetlifyFunction|EmailApi|Database)LeadTransport/.test(TRANSPORT_CODE)).toBe(false)
  })

  it('addresses the approved operator mailbox', () => {
    const p = transport.prepare(validValues(), { locale: 'cs', now: AT })
    expect(p.to).toBe('connect@talentpartnerid.com')
    expect(p.mailtoUrl.startsWith('mailto:connect@talentpartnerid.com?')).toBe(true)
    expect(OPERATOR).toBe('TNT agency s.r.o.')
    expect(OPERATOR_EMAIL).toBe('connect@talentpartnerid.com')
  })

  it('puts the reference in the subject, localized per language', () => {
    for (const [lang, base] of [
      ['cs', 'Poptávka pracovníků'],
      ['en', 'Staffing request'],
      ['de', 'Personalanfrage'],
    ] as const) {
      const p = transport.prepare(validValues(), { locale: lang, now: AT })
      expect(p.subject.startsWith(`${base} — TPID-2026-0719-`)).toBe(true)
      expect(p.subject).toContain(p.reference)
    }
  })

  it('leads the body with the reference and localizes the body', () => {
    const cs = transport.prepare(validValues(), { locale: 'cs', now: AT })
    expect(cs.body.startsWith(`Referenční číslo: ${cs.reference}`)).toBe(true)
    expect(cs.body).toContain('Firma a kontakt')

    const de = transport.prepare(validValues(), { locale: 'de', now: AT })
    expect(de.body).toContain('Referenznummer')
    expect(de.body).toContain('Unternehmen und Kontakt')
  })

  it('resolves option ids to human-readable labels, not raw slugs', () => {
    const p = transport.prepare(validValues(), { locale: 'cs', now: AT })
    expect(p.body).toContain('Agenturní zaměstnávání (dočasné přidělení)')
    expect(p.body).toContain('Pardubický kraj')
    expect(p.body).toContain('Třísměnný')
    expect(p.body).not.toContain('pardubicky')
    expect(p.body).not.toContain('three-shift')
  })

  it('omits empty optional fields instead of emitting blank labels', () => {
    const p = transport.prepare(
      { companyName: 'A', contactName: 'B', email: 'a@b.cz', consent: true },
      { locale: 'cs', now: AT },
    )
    expect(p.body).not.toContain('Ubytování:')
    // Field lines only: exclude the reference header, the intro sentence (which
    // legitimately ends in a colon) and the group headings.
    const cs = REQUEST_COPY.cs
    const fieldLines = p.body
      .split('\n')
      .filter((l) => l && !l.startsWith('—') && l !== cs.emailIntro && !l.startsWith(cs.referenceLabel))
    expect(fieldLines.filter((l) => /:\s*$/.test(l))).toEqual([])
  })

  it('URI-encodes the subject and body so the mail client receives them intact', () => {
    const p = transport.prepare(
      { ...validValues(), notes: 'Ampersand & plus + hash # quote "' },
      { locale: 'cs', now: AT },
    )
    expect(p.mailtoUrl).not.toContain(' ')
    expect(p.mailtoUrl.split('?')[1]).not.toContain('#')
    const decoded = decodeURIComponent(p.mailtoUrl.split('&body=')[1])
    expect(decoded).toContain('Ampersand & plus + hash # quote "')
  })

  it('carries the medical-examination requirement the specification asks for', () => {
    const p = transport.prepare(validValues(), { locale: 'cs', now: AT })
    expect(p.body).toContain('pracovnělékařskou prohlídku')
    expect(p.body).toContain('kategorie práce 2')
  })

  it('includes every field the specification requires', () => {
    const names = REQUEST_FIELDS.map((f) => f.name)
    for (const required of [
      'companyName', 'contactName', 'email', 'phone', 'workplaceCity', 'workplaceRegion',
      'profession', 'headcount', 'startDate', 'duration', 'shiftModel', 'weeklyHours',
      'experience', 'languages', 'accommodation', 'transport', 'ppe', 'medicalExam',
      'foreignWorkerSupport', 'employmentModel', 'budget', 'notes', 'preferredContact', 'consent',
    ]) {
      expect(names, `missing ${required}`).toContain(required)
    }
  })

  it('NEVER includes calculator economics; only a budget the employer typed', () => {
    const p = transport.prepare(validValues(), { locale: 'cs', now: AT })
    for (const leak of ['26058', '32000', '42816', 'employerCost', 'netSalary', 'agencyFee', 'margin', 'markup']) {
      expect(p.body).not.toContain(leak)
    }
    const withBudget = transport.prepare({ ...validValues(), budget: '210 Kč/h' }, { locale: 'cs', now: AT })
    expect(withBudget.body).toContain('210 Kč/h')
  })

  it('deliver() reports an ATTEMPT, never a delivery confirmation', () => {
    // Server-side there is no window, so the attempt is impossible — and the
    // result type has no "sent" concept at all.
    const p = transport.prepare(validValues(), { locale: 'cs', now: AT })
    const outcome = transport.deliver(p)
    expect(outcome).toEqual({ attempted: false, unsupported: true })
    expect(Object.keys(outcome).sort()).toEqual(['attempted', 'unsupported'])
    expect(TRANSPORT_CODE).not.toMatch(/\bsent\s*:/)
  })

  it('performs no network I/O and needs no environment variables', () => {
    expect(/fetch\(|XMLHttpRequest|navigator\.sendBeacon/.test(TRANSPORT_CODE)).toBe(false)
    expect(/process\.env/.test(TRANSPORT_CODE)).toBe(false)
  })
})

describe('Phase E Lite — attribution', () => {
  it('appears in the prepared email only, limited to the allowlist', () => {
    const attribution = buildAttribution({
      landingRoute: '/kalkulacka-mzdy-agenturniho-zamestnance',
      currentRoute: '/poptavka-pracovniku',
      referrer: 'https://www.google.com/search?q=private+query',
      query: { utm_source: 'google', utm_medium: 'cpc', unrelated: 'dropped' },
      ctaSource: 'agency-comparison',
      language: 'cs',
    })
    const p = transport.prepare(validValues(), { locale: 'cs', attribution, now: AT })
    expect(p.body).toContain('Kontext poptávky')
    expect(p.body).toContain('agency-comparison')
    expect(p.body).toContain('www.google.com')
    // The search terms and any non-allowlisted key never survive.
    expect(p.body).not.toContain('private')
    expect(p.body).not.toContain('dropped')
  })

  it('never carries personal data or economics into the attribution block', () => {
    const attribution = buildAttribution({
      landingRoute: '/', currentRoute: '/poptavka-pracovniku', ctaSource: 'employer-hub', language: 'cs',
    })
    const p = transport.prepare(validValues(), { locale: 'cs', attribution, now: AT })
    const context = p.body.split('Kontext poptávky')[1] ?? ''
    for (const personal of ['jan.novak@example.cz', 'Výrobní závod', 'Jan Novák', '+420 601', '210 Kč']) {
      expect(context).not.toContain(personal)
    }
  })

  it('every attribution field is on the documented allowlist', () => {
    expect(ATTRIBUTION_FIELDS.length).toBe(11)
    for (const f of ATTRIBUTION_FIELDS) {
      for (const l of LANGS) expect(typeof REQUEST_COPY[l].attributionLabels[f]).toBe('string')
    }
  })
})

describe('Phase E Lite — "prepared", never "sent"', () => {
  it('uses the exact prescribed prepared wording in all three languages', () => {
    expect(REQUEST_COPY.cs.preparedTitle).toBe('E-mailová zpráva byla připravena')
    expect(REQUEST_COPY.cs.preparedInstruction).toBe('Odeslání dokončete ve své e-mailové aplikaci')
    expect(REQUEST_COPY.cs.preparedFallbackHint).toBe('Pokud se aplikace neotevřela, zkopírujte text níže')

    expect(REQUEST_COPY.en.preparedTitle).toBe('Your email request has been prepared')
    expect(REQUEST_COPY.en.preparedInstruction).toBe('Complete sending it in your email application')
    expect(REQUEST_COPY.en.preparedFallbackHint).toBe('If no application opened, copy the request below')

    expect(REQUEST_COPY.de.preparedTitle).toBe('Ihre E-Mail-Anfrage wurde vorbereitet')
    expect(REQUEST_COPY.de.preparedInstruction).toBe('Schließen Sie den Versand in Ihrer E-Mail-Anwendung ab')
    expect(REQUEST_COPY.de.preparedFallbackHint).toBe('Falls keine Anwendung geöffnet wurde, kopieren Sie die Anfrage unten')
  })

  it('never claims the request was sent, submitted or received', () => {
    const forbidden = [
      /request sent/i, /lead successfully submitted/i, /we received your request/i,
      /byla odeslána/i, /jsme obdrželi/i, /úspěšně odesláno/i,
      /wurde gesendet/i, /erfolgreich gesendet/i, /haben wir erhalten/i,
    ]
    for (const l of LANGS) {
      const blob = JSON.stringify(REQUEST_COPY[l])
      for (const re of forbidden) expect(re.test(blob), `${l}: ${re}`).toBe(false)
    }
  })

  it('the email intro describes preparation, not delivery', () => {
    // This line is rendered inside the prepared-panel preview BEFORE anything is
    // sent. It previously read "Anfrage gesendet über..." / "Request submitted
    // from..." — a delivery claim visible at preparation time.
    expect(REQUEST_COPY.cs.emailIntro).toContain('připravená')
    expect(REQUEST_COPY.en.emailIntro).toContain('prepared')
    expect(REQUEST_COPY.de.emailIntro).toContain('vorbereitet')
    for (const l of LANGS) {
      expect(/gesendet|submitted|odeslan/i.test(REQUEST_COPY[l].emailIntro), l).toBe(false)
    }
  })

  it('attribution labels do not imply the request was sent', () => {
    expect(REQUEST_COPY.cs.attributionLabels.currentRoute).toBe('Připraveno na stránce')
    expect(REQUEST_COPY.en.attributionLabels.currentRoute).toBe('Prepared on page')
    expect(REQUEST_COPY.de.attributionLabels.currentRoute).toBe('Vorbereitet auf Seite')
  })

  it('states explicitly that we have not received it yet, in all languages', () => {
    expect(REQUEST_COPY.cs.notSentNote).toMatch(/neobdrželi/)
    expect(REQUEST_COPY.en.notSentNote).toMatch(/not received/)
    expect(REQUEST_COPY.de.notSentNote).toMatch(/noch nicht erhalten/)
  })

  it('the component has no state name implying delivery', () => {
    expect(FORM_CODE).toContain("'prepared'")
    expect(/'success'|'sent'|'submitted'/.test(FORM_CODE)).toBe(false)
  })
})

describe('Phase E Lite — cs/en/de parity', () => {
  it('every copy key set matches across the three languages', () => {
    const cs = REQUEST_COPY.cs
    for (const l of LANGS) {
      const c = REQUEST_COPY[l]
      expect(Object.keys(c).sort()).toEqual(Object.keys(cs).sort())
      expect(Object.keys(c.labels).sort()).toEqual(Object.keys(cs.labels).sort())
      expect(Object.keys(c.options).sort()).toEqual(Object.keys(cs.options).sort())
      expect(Object.keys(c.hints).sort()).toEqual(Object.keys(cs.hints).sort())
      expect(c.webmailSteps.length).toBe(cs.webmailSteps.length)
    }
  })

  it('every schema field has a label in all three languages', () => {
    for (const f of REQUEST_FIELDS) {
      for (const l of LANGS) expect(typeof REQUEST_COPY[l].labels[f.name], `${l}.${f.name}`).toBe('string')
    }
  })

  it('the fallback panel is fully localized', () => {
    for (const l of LANGS) {
      const c = REQUEST_COPY[l]
      for (const k of ['copyEmail', 'copySubject', 'copyRequest', 'copiedConfirm', 'openEmailApp',
                       'webmailTitle', 'clearForm', 'clearFormConfirm', 'referenceLabel',
                       'recipientLabel', 'subjectLabel', 'requestTextLabel'] as const) {
        expect(c[k].length, `${l}.${k}`).toBeGreaterThan(2)
      }
      expect(c.webmailSteps.length).toBeGreaterThanOrEqual(3)
    }
  })
})

describe('Phase E Lite — no backend anywhere', () => {
  it('declares no database, Supabase or email-provider dependency', () => {
    const deps = Object.keys({ ...(PKG.dependencies ?? {}), ...(PKG.devDependencies ?? {}) })
    for (const d of deps) {
      expect(/supabase|prisma|drizzle|mongoose|firebase|resend|nodemailer|sendgrid|postmark/i.test(d), d).toBe(false)
    }
  })

  it('has no API route, server lib or migrations directory', () => {
    for (const p of ['pages/api', 'lib/server', 'supabase']) {
      expect(fs.existsSync(path.join(ROOT, p)), `${p} must not exist`).toBe(false)
    }
  })

  it('requires no Supabase or database environment variable', () => {
    const sources = [FORM_CODE, TRANSPORT_CODE, REFERENCE_CODE].join('\n')
    expect(/SUPABASE|SERVICE_ROLE|DATABASE_URL|process\.env/.test(sources)).toBe(false)
  })

  it('the form performs no network I/O', () => {
    expect(/fetch\(|XMLHttpRequest|navigator\.sendBeacon|gtag\(|dataLayer/.test(FORM_CODE)).toBe(false)
  })
})

describe('Phase E Lite — form behaviour and accessibility', () => {
  it('preserves entered values after preparing (no reset on submit)', () => {
    const prepareBlock = FORM_CODE.slice(FORM_CODE.indexOf('const handleSubmit'), FORM_CODE.indexOf('const copyText'))
    expect(prepareBlock).not.toContain('setValues({})')
  })

  it('clearing the form asks for confirmation first', () => {
    const clearBlock = FORM_CODE.slice(FORM_CODE.indexOf('const clearForm'), FORM_CODE.indexOf('const describedBy'))
    expect(clearBlock).toContain('window.confirm(copy.clearFormConfirm)')
    expect(clearBlock).toContain('setValues({})')
    // Confirmation must gate the reset, not follow it.
    expect(clearBlock.indexOf('window.confirm')).toBeLessThan(clearBlock.indexOf('setValues({})'))
  })

  it('offers all three copy actions plus an open-email action', () => {
    expect(FORM).toContain('copy.copyEmail')
    expect(FORM).toContain('copy.copySubject')
    expect(FORM).toContain('copy.copyRequest')
    expect(FORM).toContain('copy.openEmailApp')
  })

  it('has a clipboard fallback for browsers without the async clipboard API', () => {
    expect(FORM_CODE).toContain('navigator.clipboard?.writeText')
    expect(FORM_CODE).toContain("document.execCommand('copy')")
  })

  it('announces the prepared state and the copy confirmation to assistive tech', () => {
    expect(FORM).toContain('role="status"')
    expect(FORM).toContain('aria-live="polite"')
    expect(FORM).toContain('copy.copiedConfirm')
  })

  it('keeps the error summary focusable and announced', () => {
    expect(FORM).toContain('role="alert"')
    expect(FORM).toContain('summaryRef.current?.focus()')
    expect(FORM).toContain('tabIndex={-1}')
  })

  it('labels every control properly and uses no placeholder-only fields', () => {
    expect(FORM).toContain('htmlFor={f.name}')
    expect(/placeholder=/.test(FORM)).toBe(false)
  })

  it('prevents native submission so values can never reach the URL', () => {
    expect(FORM_CODE).toContain('e.preventDefault()')
    expect(FORM_CODE).toContain('noValidate')
    expect(/action=|method=/.test(FORM_CODE)).toBe(false)
  })
})
