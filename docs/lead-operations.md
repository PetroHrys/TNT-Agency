# Lead operations — internal handling process

**Status:** active operating procedure
**Applies to:** employer staffing requests arriving from talentpartnerid.com
**Operator:** TNT agency s.r.o. · connect@talentpartnerid.com

This is **documentation only**. Nothing here is automated. There is no CRM, no
database, no Gmail API integration and no scheduled job. Labels and steps below
are created and followed manually by a person.

---

## 1. How a request arrives

The website has no backend. The employer fills in the request form, the browser
composes a structured email, and the employer sends it from their own mail
client or webmail. It lands in the business inbox like any other email.

Consequences worth internalising:

- **A prepared request is not a received request.** If an employer abandons the
  step in their mail client, we never see it and there is no record anywhere.
- The inbox **is** the system of record. Losing an email loses the lead.
- Response time is measured from when the mail arrives, not from form submission.

## 2. Subject convention

Requests arrive with a subject built by the site:

```
Poptávka pracovníků — TPID-2026-0719-A7K4 · Operátor výroby · 12× · Pardubice
Worker request — TPID-2026-0719-A7K4 · Warehouse operative · 5× · Hradec Králové
Personalanfrage — TPID-2026-0719-A7K4 · Staplerfahrer · 8× · Pardubice
```

The base wording follows the employer's interface language. Do not rewrite the
subject when replying — keep the reference so the thread stays findable.

## 3. Lead reference

Format: `TPID-YYYY-MMDD-XXXX` (e.g. `TPID-2026-0719-A7K4`).

- Generated in the employer's browser at the moment they prepare the request.
- Contains **no** personal data: no name, company, email, phone or amount.
- Not sequential and not database-backed — there is no counter to keep in sync.
- Collision-resistant enough for this volume (30⁴ = 810,000 suffixes per day),
  and any collision would have to fall on the same date to matter.

Quote the reference in every reply, proposal and internal note.

## 4. Gmail label structure

Create these labels once, by hand, in the business inbox:

```
TalentPartnerID/New
TalentPartnerID/Review
TalentPartnerID/Qualified
TalentPartnerID/Waiting for employer
TalentPartnerID/Proposal
TalentPartnerID/Won
TalentPartnerID/Lost
TalentPartnerID/Archived
```

A thread carries exactly one lifecycle label at a time. Moving a lead means
removing the previous label and applying the next one.

Optional secondary labels (a thread may carry several): `region/pardubicky`,
`industry/vyroba`, `source/agency-comparison`.

## 5. Lifecycle

| Stage | Meaning | Typical exit |
|---|---|---|
| new | Arrived, not yet read | needs review |
| needs review | Read, not yet assessed | qualified / lost |
| qualified | Real requirement we can realistically discuss | awaiting info / proposal |
| awaiting employer information | We asked for missing detail | qualified / proposal / lost |
| proposal in preparation | Pricing and terms being worked out | proposal sent |
| proposal sent | Sent to the employer | negotiation / won / lost |
| negotiation | Terms being adjusted | won / lost |
| won | Agreed and proceeding | archived |
| lost | Not proceeding | archived |
| archived | Closed, retained for records | — |

Only move forward through stages that make sense; a lead may return from
"proposal sent" to "proposal in preparation" when a revision is needed.

## 6. Response-time process

- Acknowledge within **one business day**, even if the answer is "we are
  checking availability".
- Never promise availability in an acknowledgement. Availability depends on
  profession, location, timing and conditions, and is confirmed only after we
  have checked.
- If the request is outside what we can cover, say so plainly and early.

## 7. Qualification checklist

Before moving a lead to *qualified*, confirm:

- [ ] Profession and headcount are specific enough to act on
- [ ] Workplace city and region are known
- [ ] Start date and expected duration are stated (or explicitly open)
- [ ] Shift model and weekly hours are known
- [ ] Experience, qualification and language requirements are understood
- [ ] Accommodation / transport / PPE responsibilities are clarified
- [ ] Medical examination expectations are clarified
- [ ] Foreign-worker documentation support need is known
- [ ] Employment model (agency / recruitment / unsure) is agreed
- [ ] A realistic budget range has been discussed
- [ ] The contact person can actually authorise the engagement

Anything missing → *awaiting employer information*, with a specific list of what
is needed. Do not guess on the employer's behalf.

## 8. Proposal checklist

- [ ] Reference quoted in the subject and body
- [ ] Scope: profession, headcount, location, shift model, duration
- [ ] Split of responsibility stated (OSH, PPE, accommodation, transport,
      medical examinations) — matching the responsibility matrix on the site
- [ ] Pricing model and currency stated
- [ ] Assumptions listed explicitly, including what would change the price
- [ ] Valid-until date stated
- [ ] No guaranteed savings, no guaranteed availability, no claim that statutory
      contributions are reduced by using an agency
- [ ] Version number if this supersedes an earlier proposal

Keep every version. Reply in the same thread rather than starting a new one, so
the history stays intact — the thread is the version history.

## 9. Lost-lead reasons

Record one primary reason when applying `TalentPartnerID/Lost`:

- price / budget mismatch
- availability could not be covered in the required timeframe
- employer chose direct hiring
- employer chose another agency
- requirement withdrawn or postponed
- location or profession outside coverage
- no response after follow-up schedule exhausted
- not a genuine enquiry

## 10. Follow-up schedule

| Stage | Follow-up |
|---|---|
| awaiting employer information | +2 business days, then +5, then close as lost |
| proposal sent | +3 business days, then +7, then close as lost |
| negotiation | agreed with the employer case by case |

Stop after two unanswered follow-ups. Persistent chasing is not a sales process.

## 11. Data retention

- The inbox is the record. There is no other copy on the website.
- Retain correspondence for as long as needed to handle the business request and
  to satisfy legal and accounting obligations.
- Archive rather than delete while a business or legal reason to keep it exists.
- Do not copy request contents into ad-hoc spreadsheets or personal notes — that
  creates uncontrolled copies of personal data outside the retention process.

## 12. Deletion and access requests

Because there is no database, a data-subject request is handled against the
mailbox:

1. Locate every thread for the requester (search by address and by reference).
2. Confirm identity through the address already in correspondence.
3. For access: export the relevant correspondence and provide it.
4. For correction: reply in-thread with the corrected detail recorded.
5. For deletion: delete the threads, including Sent and Bin, unless a legal or
   accounting obligation requires retention — in which case say so and state the
   basis.
6. Record that the request was handled, and when.

## 13. When to revisit this process

This email-based process is deliberate — see
[`architecture-lead-flow.md`](./architecture-lead-flow.md) for the reasoning and
for the conditions that would justify moving to a real backend.
