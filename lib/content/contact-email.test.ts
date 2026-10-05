import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import { OPERATOR_EMAIL } from './trust-data'
import { OPERATOR_EMAIL as REQUEST_OPERATOR_EMAIL } from '../employer-request/copy'
import { buildMailto } from '../employer-request/mailto'
import { MailtoLeadTransport } from '../leads-lite/transport'
import { buildApplicationMailto } from '../candidate-application/mailto'
import { APPLICATION_COPY } from '../candidate-application/copy'
import { CANDIDATE_LOCALES } from '../locale/locales'
import type { CandidateLocale } from '../locale/chrome'
import { PTBR_APPLY } from '../locale/content/pt-BR/apply'
import { ES_APPLY } from '../locale/content/es/apply'

// Written out, never imported: a test that compares OPERATOR_EMAIL with itself
// passes whatever address it holds.
const APPROVED = 'connect@talentpartnerid.com'
const RETIRED = 'jobbohemiacz@gmail.com'

const recipientOf = (href: string) => decodeURIComponent(href.slice('mailto:'.length).split('?')[0])

describe('one public contact address', () => {
  it('the operator record and the employer copy both hold the approved address', () => {
    expect(OPERATOR_EMAIL).toBe(APPROVED)
    expect(REQUEST_OPERATOR_EMAIL).toBe(APPROVED)
  })
})

describe('employer request recipient', () => {
  const values = {
    companyName: 'Synthetic Works s.r.o.',
    contactName: 'Test Person',
    email: 'buyer.synthetic@example.invalid',
    phone: '+420 600 000 000',
    workplaceCity: 'Pardubice',
    workplaceRegion: 'pardubicky',
    profession: 'Operátor výroby',
    headcount: '3',
    employmentModel: 'agency',
    consent: true,
  }

  for (const locale of ['cs', 'en', 'de'] as const) {
    it(`${locale}: addresses the approved mailbox and keeps the employer's own email in the body`, () => {
      const direct = buildMailto(values, locale)
      expect(direct.to).toBe(APPROVED)
      expect(recipientOf(direct.href)).toBe(APPROVED)

      const prepared = new MailtoLeadTransport().prepare(values, { locale, now: new Date('2026-10-05T10:00:00Z') })
      expect(prepared.to).toBe(APPROVED)
      expect(recipientOf(prepared.mailtoUrl)).toBe(APPROVED)
      // The employer's address is content, not the recipient — it must survive untouched.
      expect(prepared.body).toContain('buyer.synthetic@example.invalid')
      expect(decodeURIComponent(prepared.mailtoUrl)).toContain('buyer.synthetic@example.invalid')
      expect(decodeURIComponent(prepared.mailtoUrl)).not.toContain(RETIRED)
    })
  }
})

describe('candidate application recipient', () => {
  const values = {
    fullName: 'Synthetic Candidate',
    country: 'Brasil',
    fieldOfWork: 'technical',
    currentRole: 'Soldador',
    experience: '3to5',
    availability: 'immediately',
    email: 'candidate.synthetic@example.invalid',
    consent: true,
  }

  it('covers every candidate locale in the registry, including pt-BR and es', () => {
    expect(CANDIDATE_LOCALES).toEqual(expect.arrayContaining(['pt-BR', 'es']))
  })

  for (const locale of CANDIDATE_LOCALES as readonly CandidateLocale[]) {
    it(`${locale}: addresses the approved mailbox, keeps the CV instruction and the candidate's email`, () => {
      const mail = buildApplicationMailto(values, locale)
      expect(mail.to).toBe(APPROVED)
      expect(recipientOf(mail.href)).toBe(APPROVED)
      expect(mail.body).toContain(APPLICATION_COPY[locale].attachWarning)
      expect(mail.body).toContain('candidate.synthetic@example.invalid')
      expect(decodeURIComponent(mail.href)).not.toContain(RETIRED)
    })
  }

  it('the apply pages tell the reader the same address the form sends to', () => {
    for (const [name, corpus] of [['pt-BR', PTBR_APPLY], ['es', ES_APPLY]] as const) {
      const text = JSON.stringify(corpus)
      expect(text, `${name} apply page`).toContain(APPROVED)
      expect(text, `${name} apply page`).not.toContain(RETIRED)
    }
  })
})

describe('no retired address in anything the site serves', () => {
  const ROOT = process.cwd()
  const walk = (dir: string, out: string[] = []): string[] => {
    for (const e of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
      const rel = path.join(dir, e.name)
      if (e.isDirectory()) walk(rel, out)
      else if (/\.(tsx?|js|html|json|txt|xml)$/.test(e.name) && !/\.test\.tsx?$/.test(e.name)) out.push(rel)
    }
    return out
  }

  it('pages, components, lib and public carry no retired address', () => {
    const files = ['pages', 'components', 'lib', 'public'].flatMap((d) => walk(d))
    expect(files.length).toBeGreaterThan(300)
    const hits = files.filter((f) => fs.readFileSync(path.join(ROOT, f), 'utf8').includes(RETIRED))
    expect(hits).toEqual([])
  })
})
