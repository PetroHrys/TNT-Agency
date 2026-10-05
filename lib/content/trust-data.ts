// Verification-gated trust data for the operator (TNT agency s.r.o.).
//
// The trust page must never invent company or permit facts. Every field carries
// an explicit verification state; only `verified` fields may render as confirmed
// public facts, and a verified agency-permission claim additionally requires a
// source title, an official source URL and an access date. Unverified fields are
// NOT rendered as facts (the page still delivers value via "how to verify an
// employment agency" content). See scripts/validate-trust.js for the gate.

export type VerificationState = 'verified' | 'unverified' | 'not-applicable'

export interface VerifiedTrustField {
  /** The public value, or null when nothing verified is available yet. */
  value: string | null
  state: VerificationState
  /** Human label for the official source (required for verified permit facts). */
  sourceTitle?: string
  /** Official source URL (required, HTTPS, for verified permit facts). */
  sourceUrl?: string
  /** ISO date the source was last checked (required for verified permit facts). */
  sourceAccessedAt?: string
}

export interface AgencyTrustData {
  legalName: VerifiedTrustField
  companyId: VerifiedTrustField
  registeredSeat: VerifiedTrustField
  agencyPermission: VerifiedTrustField
  permissionScope: VerifiedTrustField
  permissionValidity: VerifiedTrustField
  responsibleRepresentative: VerifiedTrustField
  contactEmail: VerifiedTrustField
  telephone: VerifiedTrustField
}

// ── Approved constants (already verified in the repository / operator record) ─
export const OPERATOR_LEGAL_NAME = 'TNT agency s.r.o.'
// The ONE public contact address: general contact, employer requests, candidate
// applications and privacy requests all go here. Every component, recipient
// builder and JSON-LD node imports it; static public/*.html cannot, so
// scripts/validate-contact-email.mjs checks the built output instead.
export const OPERATOR_EMAIL = 'connect@talentpartnerid.com'
export const OPERATOR_PHONE = '+420 776 858 284'
export const OPERATOR_SEAT = 'Na Spravedlnosti 1533, Zelené Předměstí, 530 02 Pardubice'

// Official public verification resources (for the "how to verify" content).
export const OFFICIAL_SOURCES = {
  ares: { title: 'ARES — registr ekonomických subjektů (MF ČR)', url: 'https://ares.gov.cz/' },
  mpsvAgencies: { title: 'Evidence agentur práce (MPSV / Úřad práce ČR)', url: 'https://www.mpsv.cz/web/cz/agentury-prace' },
  justice: { title: 'Veřejný rejstřík (justice.cz)', url: 'https://or.justice.cz/' },
} as const

// The current, HONEST trust dataset.
//
// legalName / registeredSeat / contactEmail / telephone are verified from the
// operator record already used across the site. companyId and the agency-permit
// fields are intentionally 'unverified' with a null value: they are NOT rendered
// as facts until the operator supplies the official MPSV evidence (exact IČO,
// permitted mediation form/categories, validity + source access date). Filling a
// permit number here without verification is exactly what the gate forbids.
export const TRUST_DATA: AgencyTrustData = {
  legalName: { value: OPERATOR_LEGAL_NAME, state: 'verified', sourceTitle: OFFICIAL_SOURCES.ares.title, sourceUrl: OFFICIAL_SOURCES.ares.url, sourceAccessedAt: '2026-07-28' },
  companyId: { value: null, state: 'unverified' },
  registeredSeat: { value: OPERATOR_SEAT, state: 'verified', sourceTitle: OFFICIAL_SOURCES.ares.title, sourceUrl: OFFICIAL_SOURCES.ares.url, sourceAccessedAt: '2026-07-28' },
  agencyPermission: { value: null, state: 'unverified' },
  permissionScope: { value: null, state: 'unverified' },
  permissionValidity: { value: null, state: 'unverified' },
  responsibleRepresentative: { value: null, state: 'not-applicable' },
  contactEmail: { value: OPERATOR_EMAIL, state: 'verified' },
  telephone: { value: OPERATOR_PHONE, state: 'verified' },
}

/** Only verified fields with a non-null value may render as confirmed facts. */
export const isPublicFact = (f: VerifiedTrustField): boolean =>
  f.state === 'verified' && typeof f.value === 'string' && f.value.trim().length > 0
