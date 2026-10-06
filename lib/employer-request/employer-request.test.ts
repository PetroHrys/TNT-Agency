import { describe, it, expect } from 'vitest'
import { REQUEST_COPY, OPERATOR, OPERATOR_EMAIL } from './copy'
import { REQUEST_FIELDS, REQUEST_GROUPS, requiredFieldNames, fieldByName } from './schema'
import { validateRequest, isValid, orderedErrorNames, assertKnownFields } from './validate'
import { buildMailto, buildRequestBody, buildRequestSubject } from './mailto'
import {
  ATTRIBUTION_FIELDS,
  buildAttribution,
  sanitizeAttribution,
  assertNoSensitiveKeys,
  referrerDomain,
} from '../attribution'

const LANGS = ['cs', 'en', 'de'] as const

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
  duration: 'long-term',
  weeklyHours: '40',
  accommodation: 'yes',
  transport: 'no',
  foreignWorkerSupport: 'unsure',
  preferredContact: 'email',
  consent: true,
})

describe('Phase C — employer request schema & copy', () => {
  it('cs/en/de copy has full parity for every key set', () => {
    const cs = REQUEST_COPY.cs
    for (const l of LANGS) {
      const c = REQUEST_COPY[l]
      expect(Object.keys(c).sort()).toEqual(Object.keys(cs).sort())
      expect(Object.keys(c.labels).sort()).toEqual(Object.keys(cs.labels).sort())
      expect(Object.keys(c.options).sort()).toEqual(Object.keys(cs.options).sort())
      expect(Object.keys(c.errors).sort()).toEqual(Object.keys(cs.errors).sort())
      expect(Object.keys(c.groups).sort()).toEqual(Object.keys(cs.groups).sort())
      expect(c.whatHappens.length).toBe(cs.whatHappens.length)
      expect(c.whatWeNeed.length).toBe(cs.whatWeNeed.length)
      expect(c.faq.length).toBe(cs.faq.length)
    }
  })

  it('every schema field has a label in all three languages', () => {
    for (const f of REQUEST_FIELDS) {
      for (const l of LANGS) {
        expect(typeof REQUEST_COPY[l].labels[f.name], `${l}.${f.name}`).toBe('string')
      }
    }
  })

  it('every select option has a localized label in all three languages', () => {
    for (const f of REQUEST_FIELDS) {
      if (!f.options) continue
      for (const opt of f.options) {
        for (const l of LANGS) {
          expect(typeof REQUEST_COPY[l].options[`${f.name}.${opt}`], `${l}.${f.name}.${opt}`).toBe('string')
        }
      }
    }
  })

  it('covers every field the specification requires', () => {
    const names = REQUEST_FIELDS.map((f) => f.name)
    for (const required of [
      'companyName', 'contactName', 'email', 'phone', 'profession', 'headcount',
      'workplaceCity', 'workplaceRegion', 'startDate', 'duration', 'shiftModel',
      'weeklyHours', 'employmentModel', 'experience', 'languages', 'accommodation',
      'transport', 'ppe', 'foreignWorkerSupport', 'budget', 'notes', 'consent',
      'preferredContact',
    ]) {
      expect(names, `missing field ${required}`).toContain(required)
    }
    expect(REQUEST_GROUPS.length).toBeGreaterThanOrEqual(5)
  })

  it('operator identity and contact email are preserved verbatim', () => {
    expect(OPERATOR).toBe('TNT agency s.r.o.')
    expect(OPERATOR_EMAIL).toBe('connect@talentpartnerid.com')
    for (const l of LANGS) {
      const blob = JSON.stringify(REQUEST_COPY[l])
      expect(blob).toContain('TNT agency s.r.o.')
      expect(blob).toContain('connect@talentpartnerid.com')
      expect(blob).not.toContain('jobbohemiacz@gmail.com')
      // No altered legal-entity form.
      expect(/TNT agency(?! s\.r\.o\.)/.test(blob)).toBe(false)
    }
  })

  it('makes no guaranteed savings / availability / legal-certainty promises', () => {
    const forbidden = [
      /zaručen[éá] úspor/i, /garantovan[éá] úspor/i, /vždy levnější/i, /nižší odvody/i,
      /guaranteed saving/i, /always cheaper/i, /lower (statutory )?contribution/i,
      /garantierte einsparung/i, /immer günstiger/i, /geringere beiträge/i,
      // Affirmative promises only. An honest "Do you guarantee…? No." is
      // required copy, so the patterns must not match a denial.
      /\bwe guarantee\b/i, /\bzaručujeme\b/i, /\bwir garantieren\b/i,
      /\bgarantujeme\b/i, /\bguaranteed (placement|availability|result)/i,
    ]
    for (const l of LANGS) {
      const blob = JSON.stringify(REQUEST_COPY[l])
      for (const re of forbidden) expect(re.test(blob), `${l}: ${re}`).toBe(false)
    }
    // The honest denial of a guarantee must actually be present.
    expect(REQUEST_COPY.en.faq.map((f) => f.a).join(' ')).toMatch(/^|No\./)
    expect(REQUEST_COPY.cs.faq.some((f) => /Ne\./.test(f.a))).toBe(true)
    // Availability is explicitly qualified, not promised.
    expect(REQUEST_COPY.cs.whatHappens.join(' ')).toMatch(/není nikdy zaručena|nikdy zaručena/)
    expect(REQUEST_COPY.en.whatHappens.join(' ')).toMatch(/never guaranteed/)
    expect(REQUEST_COPY.de.whatHappens.join(' ')).toMatch(/nie im Voraus garantiert/)
  })
})

describe('Phase C — validation', () => {
  it('accepts a fully valid request', () => {
    expect(validateRequest(validValues())).toEqual({})
    expect(isValid(validateRequest(validValues()))).toBe(true)
  })

  it('requires every required field, including consent', () => {
    const errors = validateRequest({})
    for (const name of requiredFieldNames()) expect(errors[name]).toBe('required')
    expect(errors.consent).toBe('required')
  })

  it('does not accept the request without consent', () => {
    const v = { ...validValues(), consent: false }
    expect(validateRequest(v).consent).toBe('required')
  })

  it('rejects an invalid email, number, option and date', () => {
    expect(validateRequest({ ...validValues(), email: 'not-an-email' }).email).toBe('invalidEmail')
    expect(validateRequest({ ...validValues(), headcount: '0' }).headcount).toBe('invalidNumber')
    expect(validateRequest({ ...validValues(), headcount: 'abc' }).headcount).toBe('invalidNumber')
    expect(validateRequest({ ...validValues(), workplaceRegion: 'atlantis' }).workplaceRegion).toBe('invalidOption')
    expect(validateRequest({ ...validValues(), startDate: 'not-a-date' }).startDate).toBe('invalidDate')
  })

  it('rejects over-long free text', () => {
    const long = 'x'.repeat(3000)
    expect(validateRequest({ ...validValues(), notes: long }).notes).toBe('tooLong')
  })

  it('orders the error summary in visual field order', () => {
    const errors = validateRequest({})
    const ordered = orderedErrorNames(errors)
    expect(ordered[0]).toBe('companyName')
    expect(ordered).toContain('consent')
    expect(ordered.indexOf('companyName')).toBeLessThan(ordered.indexOf('consent'))
  })

  it('every error code has localized text in all three languages', () => {
    const codes = new Set(Object.values(validateRequest({ ...validValues(), email: 'x', headcount: 'y', startDate: 'z', workplaceRegion: 'q', notes: 'x'.repeat(3000) })))
    for (const code of Array.from(codes)) {
      for (const l of LANGS) expect(typeof REQUEST_COPY[l].errors[code]).toBe('string')
    }
  })

  it('rejects unknown fields at the boundary', () => {
    expect(() => assertKnownFields({ ...validValues(), grossSalary: '50000' })).toThrow(/Unknown request field/)
  })
})

describe('Phase C — structured mailto', () => {
  it('sends to the approved operator address with a triage-friendly subject', () => {
    const r = buildMailto(validValues(), 'cs')
    expect(r.to).toBe('connect@talentpartnerid.com')
    expect(r.href.startsWith('mailto:connect@talentpartnerid.com?')).toBe(true)
    expect(r.subject).toContain('Operátor výroby')
    expect(r.subject).toContain('12×')
    expect(r.subject).toContain('Pardubice')
  })

  it('produces a grouped, readable body with resolved option labels', () => {
    const body = buildRequestBody(validValues(), 'cs')
    expect(body).toContain('Firma a kontakt')
    expect(body).toContain('Místo výkonu práce')
    expect(body).toContain('Pozice a počet')
    // Select values render as human labels, not raw slugs.
    expect(body).toContain('Agenturní zaměstnávání (dočasné přidělení)')
    expect(body).toContain('Pardubický kraj')
    expect(body).toContain('Třísměnný')
    expect(body).not.toContain('pardubicky')
  })

  it('localizes the subject and body in en/de', () => {
    expect(buildRequestSubject(validValues(), 'en')).toContain('Staffing request')
    expect(buildRequestSubject(validValues(), 'de')).toContain('Personalanfrage')
    expect(buildRequestBody(validValues(), 'de')).toContain('Unternehmen und Kontakt')
    expect(buildRequestBody(validValues(), 'en')).toContain('Agency staffing (temporary assignment)')
  })

  it('omits empty fields and empty groups instead of emitting blank labels', () => {
    const body = buildRequestBody(
      { companyName: 'A', contactName: 'B', email: 'a@b.cz', consent: true },
      'cs',
    )
    expect(body).not.toContain('Ubytování:')
    expect(body).not.toContain('Podmínky a zázemí')
    // No field line may be a bare "Label:" with no value. Group headers ("— X —")
    // and the intro line are not field lines.
    const fieldLines = body.split('\n').slice(1).filter((l) => l && !l.startsWith('—'))
    expect(fieldLines.filter((l) => /:\s*$/.test(l))).toEqual([])
  })

  it('records the consent statement in the email, not a bare boolean', () => {
    const body = buildRequestBody(validValues(), 'cs')
    expect(body).toContain(REQUEST_COPY.cs.consentLabel)
    expect(body).not.toContain('consent: true')
  })

  it('URI-encodes the subject and body so the client receives them intact', () => {
    const r = buildMailto({ ...validValues(), notes: 'Ampersand & plus + hash # quote "' }, 'cs')
    expect(r.href).not.toContain(' ')
    expect(r.href).toContain('%20')
    // Raw delimiters must not leak into the query string.
    expect(r.href.split('?')[1]).not.toContain('#')
    expect(decodeURIComponent(r.href.split('&body=')[1])).toContain('Ampersand & plus + hash # quote "')
  })

  it('NEVER carries a calculator value into the email unless the employer typed a budget', () => {
    const body = buildRequestBody(validValues(), 'cs')
    for (const leak of ['26058', '32000', '42816', 'employerCost', 'netSalary', 'agencyFee']) {
      expect(body).not.toContain(leak)
    }
    // A manually entered budget is the employer's own input and is allowed.
    const withBudget = buildRequestBody({ ...validValues(), budget: '210 Kč/h' }, 'cs')
    expect(withBudget).toContain('210 Kč/h')
  })
})

describe('Phase C — privacy-safe attribution', () => {
  it('captures only allowlisted fields', () => {
    const a = buildAttribution({
      landingRoute: '/pracovnici-do-vyroby',
      currentRoute: '/poptavka-pracovniku',
      referrer: 'https://www.google.com/search?q=secret+query',
      query: { utm_source: 'google', utm_medium: 'cpc', irrelevant: 'dropped' },
      ctaSource: 'dedicated-calculator',
      language: 'cs',
      startedAt: '2026-07-19T10:00:00Z',
    })
    expect(Object.keys(a).every((k) => (ATTRIBUTION_FIELDS as readonly string[]).includes(k))).toBe(true)
    expect(a.utmSource).toBe('google')
    expect(a.ctaSource).toBe('dedicated-calculator')
    // Referrer is reduced to a domain — the search query never survives.
    expect(a.referrerDomain).toBe('www.google.com')
    expect(JSON.stringify(a)).not.toContain('secret')
    expect(JSON.stringify(a)).not.toContain('irrelevant')
  })

  it('reduces a referrer URL to its hostname only', () => {
    expect(referrerDomain('https://example.com/path?utm=1')).toBe('example.com')
    expect(referrerDomain('garbage')).toBe('')
    expect(referrerDomain('')).toBe('')
  })

  it('drops an unknown CTA source rather than trusting it', () => {
    const a = buildAttribution({
      landingRoute: '/', currentRoute: '/', ctaSource: '<script>alert(1)</script>',
    })
    expect(a.ctaSource).toBe('direct')
  })

  it('throws if a denylisted (sensitive) key is ever passed in', () => {
    for (const banned of ['gross', 'netSalary', 'employerCost', 'agencyFee', 'email', 'phone', 'companyName']) {
      expect(() => assertNoSensitiveKeys({ [banned]: 'x' }), banned).toThrow(/denylist/i)
    }
  })

  it('sanitize strips anything not on the allowlist and caps length', () => {
    const a = sanitizeAttribution({
      landingRoute: '/x',
      somethingElse: 'nope',
      currentRoute: 'y'.repeat(500),
    })
    expect(a).not.toHaveProperty('somethingElse')
    expect(a.currentRoute?.length).toBe(200)
  })

  it('every attribution field has a label in all three languages', () => {
    for (const f of ATTRIBUTION_FIELDS) {
      for (const l of LANGS) expect(typeof REQUEST_COPY[l].attributionLabels[f]).toBe('string')
    }
  })

  it('attribution appears in the email body only, and carries no personal data', () => {
    const attribution = buildAttribution({
      landingRoute: '/kalkulacka-mzdy-agenturniho-zamestnance',
      currentRoute: '/poptavka-pracovniku',
      ctaSource: 'agency-comparison',
      language: 'cs',
    })
    const body = buildRequestBody(validValues(), 'cs', attribution)
    expect(body).toContain('Kontext poptávky')
    expect(body).toContain('agency-comparison')
    // Personal data lives in the request section, never duplicated into context.
    const contextBlock = body.split('Kontext poptávky')[1]
    expect(contextBlock).not.toContain('jan.novak@example.cz')
    expect(contextBlock).not.toContain('Výrobní závod')
  })
})
