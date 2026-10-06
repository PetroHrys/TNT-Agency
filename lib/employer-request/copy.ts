// cs/en/de copy for the employer staffing request (Phase C3).
//
// Czech is the authoritative operational language; en/de are full working
// translations of the interface (the site has no localized routes, so this is
// interface copy only). Parity across the three locales is enforced by tests.
//
// Wording rules carried over from Phase B and enforced by tests:
//   - no guaranteed savings, no "always cheaper", no promised availability;
//   - no unconditional legal advice;
//   - the operator name and contact email are never translated.

import type { Locale } from '../content/types'
import type { AttributionField } from '../attribution'
import type { ErrorCode } from './validate'
import { OPERATOR_EMAIL } from '../content/trust-data'

export const OPERATOR = 'TNT agency s.r.o.'
// Re-exported, never redeclared: a second literal here would let the employer
// recipient drift from the candidate recipient and the footer.
export { OPERATOR_EMAIL }

export interface RequestCopy {
  // Page / SEO
  pageTitle: string
  pageDescription: string
  eyebrow: string
  h1: string
  lead: string
  // Section headings (mirror schema groups)
  groups: Record<string, string>
  // Field labels + hints
  labels: Record<string, string>
  hints: Record<string, string>
  // Option labels, keyed "<fieldName>.<optionValue>"
  options: Record<string, string>
  // Validation
  errors: Record<ErrorCode, string>
  errorSummaryTitle: string
  requiredMark: string
  optionalMark: string
  // Consent
  consentLabel: string
  consentDetail: string
  // Actions + status
  submit: string
  submitting: string
  // Phase E Lite — the request is PREPARED, never "sent". A mailto hand-off
  // cannot confirm delivery, so no string here may claim one.
  preparedTitle: string
  preparedInstruction: string
  preparedFallbackHint: string
  notSentNote: string
  referenceLabel: string
  recipientLabel: string
  subjectLabel: string
  requestTextLabel: string
  copyEmail: string
  copySubject: string
  copyRequest: string
  copiedConfirm: string
  openEmailApp: string
  webmailTitle: string
  webmailSteps: string[]
  clearForm: string
  clearFormConfirm: string
  // Email
  emailSubject: string
  emailIntro: string
  emailAttributionTitle: string
  attributionLabels: Record<AttributionField, string>
  // Trust / process
  whatHappensTitle: string
  whatHappens: string[]
  whatWeNeedTitle: string
  whatWeNeed: string[]
  privacyNote: string
  noValuesNote: string
  // Decision aids surfaced before the request (calculator / cost overviews).
  // Plain internal anchors, no query params; framed as estimate tools, never
  // as quantified/guaranteed savings.
  decisionAidsTitle: string
  decisionAidsLead: string
  decisionAids: Array<{ href: string; label: string }>
  faqTitle: string
  faq: Array<{ q: string; a: string }>
}

const attributionLabelsCs: Record<AttributionField, string> = {
  landingRoute: 'Vstupní stránka',
  currentRoute: 'Připraveno na stránce',
  referrerDomain: 'Zdrojová doména',
  utmSource: 'UTM source',
  utmMedium: 'UTM medium',
  utmCampaign: 'UTM campaign',
  utmContent: 'UTM content',
  utmTerm: 'UTM term',
  ctaSource: 'Vstupní bod poptávky',
  language: 'Jazyk rozhraní',
  startedAt: 'Zahájeno',
}

const attributionLabelsEn: Record<AttributionField, string> = {
  landingRoute: 'Landing page',
  currentRoute: 'Prepared on page',
  referrerDomain: 'Referrer domain',
  utmSource: 'UTM source',
  utmMedium: 'UTM medium',
  utmCampaign: 'UTM campaign',
  utmContent: 'UTM content',
  utmTerm: 'UTM term',
  ctaSource: 'Request entry point',
  language: 'Interface language',
  startedAt: 'Started at',
}

const attributionLabelsDe: Record<AttributionField, string> = {
  landingRoute: 'Einstiegsseite',
  currentRoute: 'Vorbereitet auf Seite',
  referrerDomain: 'Referrer-Domain',
  utmSource: 'UTM source',
  utmMedium: 'UTM medium',
  utmCampaign: 'UTM campaign',
  utmContent: 'UTM content',
  utmTerm: 'UTM term',
  ctaSource: 'Einstiegspunkt der Anfrage',
  language: 'Oberflächensprache',
  startedAt: 'Begonnen am',
}

const cs: RequestCopy = {
  pageTitle: 'Poptávka pracovníků – zadání požadavku pro agenturní zaměstnávání a nábor',
  pageDescription:
    'Zadejte požadavek na pracovníky: profese, počet, lokalita, směnný model a podmínky. Připravíme nabídku agenturního zaměstnávání nebo náboru podle zadaných údajů.',
  eyebrow: 'Pro zaměstnavatele',
  h1: 'Poptávka pracovníků',
  lead:
    'Popište, koho a kam potřebujete. Čím konkrétnější je zadání, tím přesněji lze připravit nabídku. Formulář odešlete ze svého e-mailového klienta – hodnoty z kalkulačky se nikam nepřenášejí.',
  groups: {
    company: 'Firma a kontakt',
    workplace: 'Místo výkonu práce',
    role: 'Pozice a počet',
    schedule: 'Termín a směny',
    conditions: 'Podmínky a zázemí',
    contact: 'Preference a souhlas',
  },
  labels: {
    companyName: 'Název firmy',
    contactName: 'Kontaktní osoba',
    email: 'Pracovní e-mail',
    phone: 'Telefon',
    workplaceCity: 'Město / obec pracoviště',
    workplaceRegion: 'Kraj',
    profession: 'Profese / pozice',
    roleType: 'Typ pozice',
    headcount: 'Počet pracovníků',
    employmentModel: 'Model spolupráce',
    experience: 'Požadovaná praxe a kvalifikace',
    languages: 'Jazykové požadavky',
    startDate: 'Požadovaný nástup',
    duration: 'Předpokládaná délka',
    shiftModel: 'Směnný model',
    weeklyHours: 'Týdenní úvazek (hodin)',
    accommodation: 'Ubytování',
    transport: 'Doprava na pracoviště',
    ppe: 'OOPP a vybavení',
    medicalExam: 'Požadavky na pracovnělékařskou prohlídku',
    foreignWorkerSupport: 'Podpora u dokumentů cizinců',
    budget: 'Předpokládaný rozpočet (hodinový nebo měsíční)',
    notes: 'Další provozní požadavky',
    preferredContact: 'Preferovaný kontakt',
    consent: 'Souhlas se zpracováním',
  },
  hints: {
    medicalExam: 'Kdo zajišťuje vstupní prohlídku, u jakého poskytovatele a jaká je požadovaná kategorie práce.',
    email: 'Na tuto adresu pošleme reakci.',
    headcount: 'Počet osob, které potřebujete obsadit.',
    profession: 'Např. operátor výroby, skladník, svářeč, řidič VZV.',
    roleType: 'Pomůže nám poznat, zda jde o provozní kapacitu, kvalifikovanou profesi, nebo vedení směny. Nepovinné.',
    languages: 'Např. čeština základní, angličtina domluvou, bez požadavku.',
    budget: 'Nepovinné. Uveďte, pokud máte schválený rozpočet – zpřesní to nabídku.',
    ppe: 'Kdo zajišťuje ochranné pomůcky a jaké jsou požadavky.',
    notes: 'Certifikace, zdravotní způsobilost, provozní specifika, očekávání na fluktuaci.',
    weeklyHours: 'Např. 40.',
  },
  options: {
    'roleType.operational': 'Provozní profese (výroba, sklad, logistika)',
    'roleType.specialist': 'Odborná nebo technická pozice (kvalifikace, oprávnění)',
    'roleType.leadership': 'Mistr, vedoucí směny nebo jiné provozní vedení',
    'roleType.unsure': 'Nejsem si jistý – rád to proberu',
    'employmentModel.agency': 'Agenturní zaměstnávání (dočasné přidělení)',
    'employmentModel.recruitment': 'Nábor / přímý nástup k nám',
    'employmentModel.unsure': 'Nejsem si jistý – potřebuji poradit',
    'shiftModel.single': 'Jednosměnný',
    'shiftModel.two-shift': 'Dvousměnný',
    'shiftModel.three-shift': 'Třísměnný',
    'shiftModel.continuous': 'Nepřetržitý provoz',
    'shiftModel.flexible': 'Flexibilní / dle potřeby',
    'shiftModel.unsure': 'Zatím neurčeno',
    'duration.short-term': 'Krátkodobě (do 3 měsíců)',
    'duration.seasonal': 'Sezónně',
    'duration.long-term': 'Dlouhodobě (6 měsíců a více)',
    'duration.permanent': 'Trvale',
    'duration.unsure': 'Zatím neurčeno',
    'accommodation.yes': 'Ano, je potřeba',
    'accommodation.no': 'Ne',
    'accommodation.unsure': 'Zatím nevím',
    'transport.yes': 'Ano, je potřeba',
    'transport.no': 'Ne',
    'transport.unsure': 'Zatím nevím',
    'foreignWorkerSupport.yes': 'Ano, potřebujeme podporu',
    'foreignWorkerSupport.no': 'Ne',
    'foreignWorkerSupport.unsure': 'Zatím nevím',
    'preferredContact.email': 'E-mail',
    'preferredContact.phone': 'Telefon',
    'preferredContact.either': 'E-mail i telefon',
    'workplaceRegion.praha': 'Hlavní město Praha',
    'workplaceRegion.stredocesky': 'Středočeský kraj',
    'workplaceRegion.jihocesky': 'Jihočeský kraj',
    'workplaceRegion.plzensky': 'Plzeňský kraj',
    'workplaceRegion.karlovarsky': 'Karlovarský kraj',
    'workplaceRegion.ustecky': 'Ústecký kraj',
    'workplaceRegion.liberecky': 'Liberecký kraj',
    'workplaceRegion.kralovehradecky': 'Královéhradecký kraj',
    'workplaceRegion.pardubicky': 'Pardubický kraj',
    'workplaceRegion.vysocina': 'Kraj Vysočina',
    'workplaceRegion.jihomoravsky': 'Jihomoravský kraj',
    'workplaceRegion.olomoucky': 'Olomoucký kraj',
    'workplaceRegion.zlinsky': 'Zlínský kraj',
    'workplaceRegion.moravskoslezsky': 'Moravskoslezský kraj',
  },
  errors: {
    required: 'Toto pole je povinné.',
    invalidEmail: 'Zadejte platnou e-mailovou adresu.',
    invalidNumber: 'Zadejte platné celé číslo v povoleném rozsahu.',
    tooLong: 'Text je příliš dlouhý.',
    invalidOption: 'Vyberte jednu z nabízených možností.',
    invalidDate: 'Zadejte platné datum.',
  },
  errorSummaryTitle: 'Formulář nelze odeslat – zkontrolujte tato pole:',
  requiredMark: 'povinné',
  optionalMark: 'nepovinné',
  consentLabel:
    'Souhlasím se zpracováním uvedených údajů za účelem zpracování této poptávky.',
  consentDetail:
    `Údaje zpracovává ${OPERATOR} výhradně pro vyřízení této poptávky. Odesláním se otevře váš e-mailový klient – zprávu odesíláte vy. Podrobnosti najdete v zásadách ochrany osobních údajů.`,
  submit: 'Vytvořit e-mail s poptávkou',
  submitting: 'Připravuji…',
  preparedTitle: 'E-mailová zpráva byla připravena',
  preparedInstruction: 'Odeslání dokončete ve své e-mailové aplikaci',
  preparedFallbackHint: 'Pokud se aplikace neotevřela, zkopírujte text níže',
  notSentNote:
    'Poptávku jsme zatím neobdrželi. Dorazí k nám až ve chvíli, kdy zprávu skutečně odešlete ze své e-mailové aplikace nebo webmailu.',
  referenceLabel: 'Referenční číslo',
  recipientLabel: 'Příjemce',
  subjectLabel: 'Předmět',
  requestTextLabel: 'Text poptávky',
  copyEmail: 'Kopírovat e-mailovou adresu',
  copySubject: 'Kopírovat předmět',
  copyRequest: 'Kopírovat celou poptávku',
  copiedConfirm: 'Zkopírováno do schránky',
  openEmailApp: 'Otevřít e-mailovou aplikaci',
  webmailTitle: 'Používáte Gmail, Outlook nebo jiný webmail?',
  webmailSteps: [
    'Zkopírujte e-mailovou adresu, předmět a text poptávky pomocí tlačítek výše.',
    'Otevřete si svůj webmail (například Gmail nebo Outlook) a vytvořte novou zprávu.',
    'Vložte adresu do pole Komu, předmět do pole Předmět a text do těla zprávy.',
    'Zprávu odešlete. Teprve tím se poptávka dostane k nám.',
  ],
  clearForm: 'Vymazat formulář',
  clearFormConfirm: 'Opravdu chcete vymazat všechny zadané údaje? Tuto akci nelze vrátit zpět.',
  emailSubject: 'Poptávka pracovníků',
  emailIntro: 'Poptávka připravená přes web talentpartnerid.com:',
  emailAttributionTitle: 'Kontext poptávky',
  attributionLabels: attributionLabelsCs,
  whatHappensTitle: 'Jak to probíhá',
  whatHappens: [
    'Ozveme se a doplníme chybějící provozní detaily zadání.',
    'Ověříme, zda a v jakém rozsahu lze požadavek pokrýt – dostupnost není nikdy zaručena předem.',
    'Připravíme nabídku podle profese, lokality, směnného modelu a rozsahu.',
    'Doladíme smluvní rozdělení odpovědnosti (kdo zajišťuje BOZP, OOPP, ubytování, dopravu).',
    'Po odsouhlasení nastavíme nábor, dokumentaci a nástup.',
  ],
  whatWeNeedTitle: 'Co potřebujeme pro přípravu nabídky',
  whatWeNeed: [
    'Profese a počet pracovníků.',
    'Místo výkonu práce a kraj.',
    'Termín nástupu a předpokládaná délka.',
    'Směnný model a týdenní úvazek.',
    'Požadavky na praxi, kvalifikaci a jazyk.',
    'Zda je potřeba ubytování, doprava nebo podpora u dokumentů cizinců.',
  ],
  privacyNote:
    `Správcem údajů z tohoto formuláře je ${OPERATOR}, kontakt ${OPERATOR_EMAIL}.`,
  noValuesNote:
    'Hodnoty zadané v mzdové kalkulačce se do poptávky nepřenášejí. Rozpočet uvádíte pouze vy, ručně, pokud chcete.',
  decisionAidsTitle: 'Než odešlete poptávku',
  decisionAidsLead:
    'Nezávazně si namodelujte a porovnejte náklady. Kalkulačka počítá jen ve vašem prohlížeči a nic z ní se do poptávky nepřenáší.',
  decisionAids: [
    { href: '/kalkulacka-mzdy-agenturniho-zamestnance#srovnani', label: 'Spočítejte a porovnejte náklady: agentura vs. přímý nábor' },
    { href: '/kolik-stoji-zamestnanec', label: 'Kolik stojí zaměstnanec' },
    { href: '/skutecne-naklady-na-zamestnance', label: 'Skutečné náklady na zaměstnance' },
  ],
  faqTitle: 'Časté dotazy k poptávce',
  faq: [
    {
      q: 'Je poptávka závazná?',
      a: 'Ne. Odesláním formuláře nevzniká objednávka ani smlouva. Jde o zadání požadavku, na jehož základě lze připravit nabídku.',
    },
    {
      q: 'Garantujete, že pracovníky seženete?',
      a: 'Ne. Dostupnost kandidátů závisí na profesi, lokalitě, termínu, směnném modelu a nabízených podmínkách. Po zadání požadavku sdělíme, co je reálné.',
    },
    {
      q: 'Je agenturní zaměstnávání levnější než přímý nábor?',
      a: 'Ne automaticky. Zákonné odvody se přes agenturu nesnižují. Rozdíl závisí na zadaných předpokladech a na tom, jaké provozní činnosti agentura přebírá. Porovnání si můžete spočítat v kalkulačce.',
    },
    {
      q: 'Přenášejí se do poptávky částky z kalkulačky?',
      a: 'Ne. Kalkulačka počítá pouze ve vašem prohlížeči a žádnou hodnotu do poptávky, adresy stránky ani analytiky nepředává.',
    },
    {
      q: 'Je nábor cizinců přes agenturu legální a co hrozí při kontrole?',
      a: 'Zaměstnávat lze až po nabytí platnosti potřebných oprávnění; dřívější nástup se posuzuje jako nelegální práce. Zprostředkování zaměstnání smí provádět jen subjekt s platným povolením a agentury jsou vedeny ve veřejné evidenci. Platí rovné zacházení – podmínky dočasně přiděleného pracovníka nesmí být horší než u srovnatelného kmenového zaměstnance a pracovník za zprostředkování nikdy nic nehradí; dodržování kontroluje inspekce práce. Agentura přebírá dokumenty cizinců, spoluodpovědnost ale nese i uživatel. Konkrétní lhůty ani bezproblémovou kontrolu neslibujeme; podrobnosti najdete na stránkách o zaměstnávání cizinců. Jde o obecnou informaci, nikoli o právní poradenství.',
    },
    {
      q: 'Z čeho se skládá cena agentury a nejsou v ní skryté poplatky?',
      a: 'Fakturovaná cena obvykle zahrnuje přeúčtované mzdové náklady (hrubá mzda a zákonné odvody zaměstnavatele), přeúčtované provozní náklady a odměnu agentury; DPH je na samostatném řádku. Jde o provozní, nikoli daňovou úsporu – mzda pracovníka se agenturou nesnižuje. Konkrétní čísla si namodelujte v kalkulačce v režimu porovnání; žádné paušální „ušetříte X %“ neuvádíme.',
    },
    {
      q: 'Kdo za co odpovídá – BOZP, OOPP, mzdy, dokumentace?',
      a: 'Orientačně: agentura zajišťuje pracovní smlouvu, mzdy, odvody a dokumenty cizinců; uživatel (vaše firma) řídí každodenní práci a pokyny; BOZP, docházka a ukončení bývají sdílené; OOPP, vstupní prohlídka, ubytování a doprava se sjednávají smluvně. Přesné rozdělení vždy určuje smlouva a nejde o právní poradenství. Více o fungování agentury najdete v průvodci.',
    },
    {
      q: 'Komu posílám firemní údaje a je agentura oprávněná?',
      a: `Správcem údajů z formuláře je ${OPERATOR}. Zprostředkování zaměstnání smí v ČR provádět jen subjekt s platným povolením podle zákona o zaměstnanosti a agentury jsou vedeny ve veřejné evidenci, kterou si můžete ověřit. Ověřené identifikační údaje a postup ověření agentury najdete na stránce O nás.`,
    },
  ],
}

const en: RequestCopy = {
  pageTitle: 'Request workers – submit a staffing requirement for agency employment or recruitment',
  pageDescription:
    'Submit a staffing requirement: profession, headcount, location, shift model and conditions. We prepare an agency staffing or recruitment proposal based on the details you provide.',
  eyebrow: 'For employers',
  h1: 'Request workers',
  lead:
    'Describe who you need and where. The more specific the requirement, the more precisely a proposal can be prepared. The form opens your own email client — no calculator values are transferred.',
  groups: {
    company: 'Company and contact',
    workplace: 'Place of work',
    role: 'Role and headcount',
    schedule: 'Timing and shifts',
    conditions: 'Conditions and support',
    contact: 'Preferences and consent',
  },
  labels: {
    companyName: 'Company name',
    contactName: 'Contact person',
    email: 'Work email',
    phone: 'Phone',
    workplaceCity: 'Workplace city / municipality',
    workplaceRegion: 'Region',
    profession: 'Profession / role',
    roleType: 'Type of role',
    headcount: 'Number of workers',
    employmentModel: 'Cooperation model',
    experience: 'Required experience and qualifications',
    languages: 'Language requirements',
    startDate: 'Requested start date',
    duration: 'Expected duration',
    shiftModel: 'Shift model',
    weeklyHours: 'Weekly hours',
    accommodation: 'Accommodation',
    transport: 'Transport to the workplace',
    ppe: 'PPE and equipment',
    medicalExam: 'Occupational medical examination requirements',
    foreignWorkerSupport: 'Support with foreign-worker documents',
    budget: 'Expected budget (hourly or monthly)',
    notes: 'Additional operational requirements',
    preferredContact: 'Preferred contact method',
    consent: 'Data processing consent',
  },
  hints: {
    medicalExam: 'Who arranges the entry examination, with which provider, and the required work category.',
    email: 'We will reply to this address.',
    headcount: 'How many people you need to staff.',
    profession: 'E.g. production operator, warehouse worker, welder, forklift driver.',
    roleType: 'Tells us whether this is operational headcount, a qualified occupation, or shift leadership. Optional.',
    languages: 'E.g. basic Czech, English negotiable, no requirement.',
    budget: 'Optional. Provide it if you have an approved budget — it makes the proposal more precise.',
    ppe: 'Who provides protective equipment and what the requirements are.',
    notes: 'Certifications, medical fitness, operational specifics, turnover expectations.',
    weeklyHours: 'E.g. 40.',
  },
  options: {
    'roleType.operational': 'Operational role (production, warehouse, logistics)',
    'roleType.specialist': 'Specialist or technical role (qualifications, authorisations)',
    'roleType.leadership': 'Supervisor, shift leader or other first-line management',
    'roleType.unsure': 'Not sure — happy to discuss',
    'employmentModel.agency': 'Agency staffing (temporary assignment)',
    'employmentModel.recruitment': 'Recruitment / direct hire by us',
    'employmentModel.unsure': 'Not sure — I need advice',
    'shiftModel.single': 'Single shift',
    'shiftModel.two-shift': 'Two shifts',
    'shiftModel.three-shift': 'Three shifts',
    'shiftModel.continuous': 'Continuous operation',
    'shiftModel.flexible': 'Flexible / as needed',
    'shiftModel.unsure': 'Not yet determined',
    'duration.short-term': 'Short-term (up to 3 months)',
    'duration.seasonal': 'Seasonal',
    'duration.long-term': 'Long-term (6 months or more)',
    'duration.permanent': 'Permanent',
    'duration.unsure': 'Not yet determined',
    'accommodation.yes': 'Yes, needed',
    'accommodation.no': 'No',
    'accommodation.unsure': 'Not sure yet',
    'transport.yes': 'Yes, needed',
    'transport.no': 'No',
    'transport.unsure': 'Not sure yet',
    'foreignWorkerSupport.yes': 'Yes, we need support',
    'foreignWorkerSupport.no': 'No',
    'foreignWorkerSupport.unsure': 'Not sure yet',
    'preferredContact.email': 'Email',
    'preferredContact.phone': 'Phone',
    'preferredContact.either': 'Email or phone',
    'workplaceRegion.praha': 'Prague (capital city)',
    'workplaceRegion.stredocesky': 'Central Bohemian Region',
    'workplaceRegion.jihocesky': 'South Bohemian Region',
    'workplaceRegion.plzensky': 'Plzeň Region',
    'workplaceRegion.karlovarsky': 'Karlovy Vary Region',
    'workplaceRegion.ustecky': 'Ústí nad Labem Region',
    'workplaceRegion.liberecky': 'Liberec Region',
    'workplaceRegion.kralovehradecky': 'Hradec Králové Region',
    'workplaceRegion.pardubicky': 'Pardubice Region',
    'workplaceRegion.vysocina': 'Vysočina Region',
    'workplaceRegion.jihomoravsky': 'South Moravian Region',
    'workplaceRegion.olomoucky': 'Olomouc Region',
    'workplaceRegion.zlinsky': 'Zlín Region',
    'workplaceRegion.moravskoslezsky': 'Moravian-Silesian Region',
  },
  errors: {
    required: 'This field is required.',
    invalidEmail: 'Enter a valid email address.',
    invalidNumber: 'Enter a valid whole number within the allowed range.',
    tooLong: 'This text is too long.',
    invalidOption: 'Select one of the offered options.',
    invalidDate: 'Enter a valid date.',
  },
  errorSummaryTitle: 'The form cannot be submitted — please check these fields:',
  requiredMark: 'required',
  optionalMark: 'optional',
  consentLabel:
    'I consent to the processing of the data provided for the purpose of handling this request.',
  consentDetail:
    `The data is processed by ${OPERATOR} solely to handle this request. Submitting opens your email client — you send the message yourself. See the privacy policy for details.`,
  submit: 'Create request email',
  submitting: 'Preparing…',
  preparedTitle: 'Your email request has been prepared',
  preparedInstruction: 'Complete sending it in your email application',
  preparedFallbackHint: 'If no application opened, copy the request below',
  notSentNote:
    'We have not received your request yet. It reaches us only once you actually send the message from your email application or webmail.',
  referenceLabel: 'Reference number',
  recipientLabel: 'Recipient',
  subjectLabel: 'Subject',
  requestTextLabel: 'Request text',
  copyEmail: 'Copy email address',
  copySubject: 'Copy subject',
  copyRequest: 'Copy full request',
  copiedConfirm: 'Copied to clipboard',
  openEmailApp: 'Open email application',
  webmailTitle: 'Using Gmail, Outlook or another webmail service?',
  webmailSteps: [
    'Copy the email address, the subject and the request text using the buttons above.',
    'Open your webmail (for example Gmail or Outlook) and start a new message.',
    'Paste the address into the To field, the subject into the Subject field and the text into the message body.',
    'Send the message. Only then does the request reach us.',
  ],
  clearForm: 'Clear form',
  clearFormConfirm: 'Are you sure you want to clear everything you have entered? This cannot be undone.',
  emailSubject: 'Staffing request',
  emailIntro: 'Request prepared via talentpartnerid.com:',
  emailAttributionTitle: 'Request context',
  attributionLabels: attributionLabelsEn,
  whatHappensTitle: 'How it works',
  whatHappens: [
    'We get in touch and fill in the missing operational details.',
    'We check whether and to what extent the requirement can be covered — availability is never guaranteed in advance.',
    'We prepare a proposal based on profession, location, shift model and scope.',
    'We agree the contractual split of responsibility (who provides OSH, PPE, accommodation, transport).',
    'Once approved, we set up recruitment, documentation and onboarding.',
  ],
  whatWeNeedTitle: 'What we need to prepare a proposal',
  whatWeNeed: [
    'Profession and number of workers.',
    'Place of work and region.',
    'Start date and expected duration.',
    'Shift model and weekly hours.',
    'Experience, qualification and language requirements.',
    'Whether accommodation, transport or foreign-worker document support is needed.',
  ],
  privacyNote:
    `The controller of the data from this form is ${OPERATOR}, contact ${OPERATOR_EMAIL}.`,
  noValuesNote:
    'Values entered in the payroll calculator are not transferred into the request. A budget is provided only by you, manually, if you choose to.',
  decisionAidsTitle: 'Before you send your request',
  decisionAidsLead:
    'Model and compare the costs with no obligation. The calculator runs only in your browser and nothing from it is carried into the request.',
  decisionAids: [
    { href: '/kalkulacka-mzdy-agenturniho-zamestnance#srovnani', label: 'Calculate and compare costs: agency vs. direct hiring' },
    { href: '/kolik-stoji-zamestnanec', label: 'How much an employee costs' },
    { href: '/skutecne-naklady-na-zamestnance', label: 'The real cost of an employee' },
  ],
  faqTitle: 'Request FAQ',
  faq: [
    {
      q: 'Is the request binding?',
      a: 'No. Submitting the form does not create an order or a contract. It is a statement of requirements from which a proposal can be prepared.',
    },
    {
      q: 'Do you guarantee that you will find the workers?',
      a: 'No. Candidate availability depends on the profession, location, timing, shift model and the conditions offered. Once we have the requirement we will tell you what is realistic.',
    },
    {
      q: 'Is agency employment cheaper than direct hiring?',
      a: 'Not automatically. Statutory contributions are not reduced through an agency. The difference depends on the assumptions entered and on which operational activities the agency takes over. You can model the comparison in the calculator.',
    },
    {
      q: 'Are calculator amounts transferred into the request?',
      a: 'No. The calculator runs only in your browser and passes no value into the request, the page address or analytics.',
    },
    {
      q: 'Is recruiting foreign workers through an agency legal, and what is the inspection risk?',
      a: 'Work may begin only once the required permits are valid; an earlier start is treated as illegal work. Only a holder of a valid mediation permit may provide employment mediation, and agencies are listed in a public register. Equal treatment applies — a temporarily assigned worker’s conditions may be no worse than a comparable core employee’s, and the worker never pays a mediation fee; compliance is supervised by the labour inspectorate. The agency handles foreigners’ documents, but the user shares responsibility. We promise no specific processing times or a trouble-free inspection; details are on our pages about employing foreigners. This is general information, not legal advice.',
    },
    {
      q: 'What makes up the agency price, and are there hidden fees?',
      a: 'The invoiced price typically covers re-charged payroll costs (gross wage plus the employer’s statutory contributions), re-charged operating costs and the agency’s fee; VAT is a separate line. It is an operational, not a tax, saving — the worker’s wage is not reduced through the agency. Model the actual figures in the calculator’s comparison mode; we state no blanket “save X%”.',
    },
    {
      q: 'Who is responsible for what — OSH, PPE, wages, paperwork?',
      a: 'As a guide: the agency provides the employment contract, wages, contributions and foreigners’ documents; the user (your company) directs the day-to-day work; OSH, attendance and termination are usually shared; PPE, entry medicals, accommodation and transport are agreed contractually. The exact split is always set by the contract and this is not legal advice. See the guide on how an agency works.',
    },
    {
      q: 'Who am I sending company data to, and is the agency authorised?',
      a: `The controller of the form data is ${OPERATOR}. In the Czech Republic, employment mediation may be provided only by a holder of a valid permit under the Employment Act, and agencies are listed in a public register you can check. Verified identification details and how to verify an agency are on our About page.`,
    },
  ],
}

const de: RequestCopy = {
  pageTitle: 'Personalbedarf anfragen – Anforderung für Zeitarbeit oder Personalvermittlung',
  pageDescription:
    'Übermitteln Sie Ihren Personalbedarf: Beruf, Anzahl, Standort, Schichtmodell und Bedingungen. Auf Grundlage Ihrer Angaben erstellen wir ein Angebot für Zeitarbeit oder Personalvermittlung.',
  eyebrow: 'Für Arbeitgeber',
  h1: 'Personalbedarf anfragen',
  lead:
    'Beschreiben Sie, wen Sie wo benötigen. Je konkreter die Anforderung, desto präziser lässt sich ein Angebot erstellen. Das Formular öffnet Ihr eigenes E-Mail-Programm – Werte aus dem Rechner werden nicht übertragen.',
  groups: {
    company: 'Unternehmen und Kontakt',
    workplace: 'Einsatzort',
    role: 'Position und Anzahl',
    schedule: 'Termin und Schichten',
    conditions: 'Bedingungen und Unterstützung',
    contact: 'Präferenzen und Einwilligung',
  },
  labels: {
    companyName: 'Firmenname',
    contactName: 'Ansprechpartner',
    email: 'Geschäftliche E-Mail',
    phone: 'Telefon',
    workplaceCity: 'Stadt / Gemeinde des Einsatzortes',
    workplaceRegion: 'Region (Kraj)',
    profession: 'Beruf / Position',
    roleType: 'Art der Position',
    headcount: 'Anzahl der Mitarbeiter',
    employmentModel: 'Modell der Zusammenarbeit',
    experience: 'Erforderliche Erfahrung und Qualifikation',
    languages: 'Sprachanforderungen',
    startDate: 'Gewünschter Eintrittstermin',
    duration: 'Voraussichtliche Dauer',
    shiftModel: 'Schichtmodell',
    weeklyHours: 'Wochenstunden',
    accommodation: 'Unterkunft',
    transport: 'Transport zum Einsatzort',
    ppe: 'PSA und Ausrüstung',
    medicalExam: 'Anforderungen an die arbeitsmedizinische Untersuchung',
    foreignWorkerSupport: 'Unterstützung bei Dokumenten ausländischer Mitarbeiter',
    budget: 'Erwartetes Budget (stündlich oder monatlich)',
    notes: 'Weitere betriebliche Anforderungen',
    preferredContact: 'Bevorzugter Kontaktweg',
    consent: 'Einwilligung zur Datenverarbeitung',
  },
  hints: {
    medicalExam: 'Wer die Einstellungsuntersuchung veranlasst, bei welchem Anbieter und welche Arbeitskategorie gefordert ist.',
    email: 'An diese Adresse antworten wir.',
    headcount: 'Wie viele Personen Sie besetzen müssen.',
    profession: 'Z. B. Produktionsmitarbeiter, Lagerarbeiter, Schweißer, Staplerfahrer.',
    roleType: 'Zeigt uns, ob es um gewerbliche Kapazität, einen qualifizierten Beruf oder Schichtführung geht. Optional.',
    languages: 'Z. B. Tschechisch Grundkenntnisse, Englisch nach Vereinbarung, keine Anforderung.',
    budget: 'Optional. Geben Sie es an, wenn ein Budget freigegeben ist – das präzisiert das Angebot.',
    ppe: 'Wer die Schutzausrüstung stellt und welche Anforderungen bestehen.',
    notes: 'Zertifikate, arbeitsmedizinische Eignung, betriebliche Besonderheiten, Fluktuationserwartung.',
    weeklyHours: 'Z. B. 40.',
  },
  options: {
    'roleType.operational': 'Gewerbliche Position (Produktion, Lager, Logistik)',
    'roleType.specialist': 'Fach- oder Technikposition (Qualifikation, Befähigungsnachweise)',
    'roleType.leadership': 'Meister, Schichtleiter oder andere operative Führung',
    'roleType.unsure': 'Nicht sicher — bespreche ich gern',
    'employmentModel.agency': 'Zeitarbeit (Arbeitnehmerüberlassung)',
    'employmentModel.recruitment': 'Personalvermittlung / Direkteinstellung bei uns',
    'employmentModel.unsure': 'Unsicher – ich benötige Beratung',
    'shiftModel.single': 'Einschichtig',
    'shiftModel.two-shift': 'Zweischichtig',
    'shiftModel.three-shift': 'Dreischichtig',
    'shiftModel.continuous': 'Durchlaufender Betrieb',
    'shiftModel.flexible': 'Flexibel / nach Bedarf',
    'shiftModel.unsure': 'Noch nicht festgelegt',
    'duration.short-term': 'Kurzfristig (bis 3 Monate)',
    'duration.seasonal': 'Saisonal',
    'duration.long-term': 'Langfristig (6 Monate oder länger)',
    'duration.permanent': 'Dauerhaft',
    'duration.unsure': 'Noch nicht festgelegt',
    'accommodation.yes': 'Ja, wird benötigt',
    'accommodation.no': 'Nein',
    'accommodation.unsure': 'Noch unklar',
    'transport.yes': 'Ja, wird benötigt',
    'transport.no': 'Nein',
    'transport.unsure': 'Noch unklar',
    'foreignWorkerSupport.yes': 'Ja, wir benötigen Unterstützung',
    'foreignWorkerSupport.no': 'Nein',
    'foreignWorkerSupport.unsure': 'Noch unklar',
    'preferredContact.email': 'E-Mail',
    'preferredContact.phone': 'Telefon',
    'preferredContact.either': 'E-Mail oder Telefon',
    'workplaceRegion.praha': 'Hauptstadt Prag',
    'workplaceRegion.stredocesky': 'Mittelböhmische Region',
    'workplaceRegion.jihocesky': 'Südböhmische Region',
    'workplaceRegion.plzensky': 'Region Pilsen',
    'workplaceRegion.karlovarsky': 'Region Karlsbad',
    'workplaceRegion.ustecky': 'Region Aussig',
    'workplaceRegion.liberecky': 'Region Reichenberg',
    'workplaceRegion.kralovehradecky': 'Region Königgrätz',
    'workplaceRegion.pardubicky': 'Region Pardubitz',
    'workplaceRegion.vysocina': 'Region Vysočina',
    'workplaceRegion.jihomoravsky': 'Südmährische Region',
    'workplaceRegion.olomoucky': 'Region Olmütz',
    'workplaceRegion.zlinsky': 'Region Zlín',
    'workplaceRegion.moravskoslezsky': 'Mährisch-Schlesische Region',
  },
  errors: {
    required: 'Dieses Feld ist erforderlich.',
    invalidEmail: 'Geben Sie eine gültige E-Mail-Adresse ein.',
    invalidNumber: 'Geben Sie eine gültige ganze Zahl im zulässigen Bereich ein.',
    tooLong: 'Der Text ist zu lang.',
    invalidOption: 'Wählen Sie eine der angebotenen Optionen.',
    invalidDate: 'Geben Sie ein gültiges Datum ein.',
  },
  errorSummaryTitle: 'Das Formular kann nicht gesendet werden – bitte prüfen Sie diese Felder:',
  requiredMark: 'erforderlich',
  optionalMark: 'optional',
  consentLabel:
    'Ich willige in die Verarbeitung der angegebenen Daten zum Zweck der Bearbeitung dieser Anfrage ein.',
  consentDetail:
    `Die Daten werden von ${OPERATOR} ausschließlich zur Bearbeitung dieser Anfrage verarbeitet. Beim Absenden öffnet sich Ihr E-Mail-Programm – Sie senden die Nachricht selbst. Einzelheiten finden Sie in der Datenschutzerklärung.`,
  submit: 'Anfrage-E-Mail erstellen',
  submitting: 'Wird vorbereitet…',
  preparedTitle: 'Ihre E-Mail-Anfrage wurde vorbereitet',
  preparedInstruction: 'Schließen Sie den Versand in Ihrer E-Mail-Anwendung ab',
  preparedFallbackHint: 'Falls keine Anwendung geöffnet wurde, kopieren Sie die Anfrage unten',
  notSentNote:
    'Wir haben Ihre Anfrage noch nicht erhalten. Sie erreicht uns erst, wenn Sie die Nachricht tatsächlich aus Ihrer E-Mail-Anwendung oder Ihrem Webmail versenden.',
  referenceLabel: 'Referenznummer',
  recipientLabel: 'Empfänger',
  subjectLabel: 'Betreff',
  requestTextLabel: 'Anfragetext',
  copyEmail: 'E-Mail-Adresse kopieren',
  copySubject: 'Betreff kopieren',
  copyRequest: 'Gesamte Anfrage kopieren',
  copiedConfirm: 'In die Zwischenablage kopiert',
  openEmailApp: 'E-Mail-Anwendung öffnen',
  webmailTitle: 'Nutzen Sie Gmail, Outlook oder einen anderen Webmail-Dienst?',
  webmailSteps: [
    'Kopieren Sie E-Mail-Adresse, Betreff und Anfragetext über die Schaltflächen oben.',
    'Öffnen Sie Ihr Webmail (zum Beispiel Gmail oder Outlook) und erstellen Sie eine neue Nachricht.',
    'Fügen Sie die Adresse in das Feld An, den Betreff in das Feld Betreff und den Text in den Nachrichtentext ein.',
    'Senden Sie die Nachricht. Erst dadurch erreicht uns die Anfrage.',
  ],
  clearForm: 'Formular leeren',
  clearFormConfirm: 'Möchten Sie wirklich alle eingegebenen Daten löschen? Dies kann nicht rückgängig gemacht werden.',
  emailSubject: 'Personalanfrage',
  emailIntro: 'Anfrage vorbereitet über talentpartnerid.com:',
  emailAttributionTitle: 'Kontext der Anfrage',
  attributionLabels: attributionLabelsDe,
  whatHappensTitle: 'So läuft es ab',
  whatHappens: [
    'Wir melden uns und ergänzen fehlende betriebliche Details.',
    'Wir prüfen, ob und in welchem Umfang der Bedarf gedeckt werden kann – Verfügbarkeit wird nie im Voraus garantiert.',
    'Wir erstellen ein Angebot nach Beruf, Standort, Schichtmodell und Umfang.',
    'Wir stimmen die vertragliche Aufteilung der Verantwortung ab (wer stellt Arbeitsschutz, PSA, Unterkunft, Transport).',
    'Nach Freigabe richten wir Rekrutierung, Dokumentation und Einsatzbeginn ein.',
  ],
  whatWeNeedTitle: 'Was wir für ein Angebot benötigen',
  whatWeNeed: [
    'Beruf und Anzahl der Mitarbeiter.',
    'Einsatzort und Region.',
    'Eintrittstermin und voraussichtliche Dauer.',
    'Schichtmodell und Wochenstunden.',
    'Anforderungen an Erfahrung, Qualifikation und Sprache.',
    'Ob Unterkunft, Transport oder Unterstützung bei Dokumenten benötigt wird.',
  ],
  privacyNote:
    `Verantwortlich für die Daten aus diesem Formular ist ${OPERATOR}, Kontakt ${OPERATOR_EMAIL}.`,
  noValuesNote:
    'Im Lohnrechner eingegebene Werte werden nicht in die Anfrage übernommen. Ein Budget geben ausschließlich Sie selbst manuell an, wenn Sie möchten.',
  decisionAidsTitle: 'Bevor Sie Ihre Anfrage senden',
  decisionAidsLead:
    'Modellieren und vergleichen Sie die Kosten unverbindlich. Der Rechner läuft nur in Ihrem Browser und nichts davon wird in die Anfrage übernommen.',
  decisionAids: [
    { href: '/kalkulacka-mzdy-agenturniho-zamestnance#srovnani', label: 'Kosten berechnen und vergleichen: Agentur vs. Direkteinstellung' },
    { href: '/kolik-stoji-zamestnanec', label: 'Was ein Mitarbeiter kostet' },
    { href: '/skutecne-naklady-na-zamestnance', label: 'Die tatsächlichen Kosten eines Mitarbeiters' },
  ],
  faqTitle: 'Häufige Fragen zur Anfrage',
  faq: [
    {
      q: 'Ist die Anfrage verbindlich?',
      a: 'Nein. Das Absenden des Formulars begründet weder eine Bestellung noch einen Vertrag. Es ist eine Bedarfsmeldung, auf deren Grundlage ein Angebot erstellt werden kann.',
    },
    {
      q: 'Garantieren Sie, dass Sie die Mitarbeiter finden?',
      a: 'Nein. Die Verfügbarkeit von Kandidaten hängt von Beruf, Standort, Termin, Schichtmodell und den gebotenen Bedingungen ab. Nach Eingang der Anforderung sagen wir Ihnen, was realistisch ist.',
    },
    {
      q: 'Ist Zeitarbeit günstiger als Direkteinstellung?',
      a: 'Nicht automatisch. Gesetzliche Beiträge werden über eine Agentur nicht gesenkt. Der Unterschied hängt von den eingegebenen Annahmen ab und davon, welche betrieblichen Aufgaben die Agentur übernimmt. Den Vergleich können Sie im Rechner modellieren.',
    },
    {
      q: 'Werden Beträge aus dem Rechner in die Anfrage übernommen?',
      a: 'Nein. Der Rechner läuft ausschließlich in Ihrem Browser und übergibt keinen Wert an die Anfrage, die Seitenadresse oder die Analyse.',
    },
    {
      q: 'Ist die Anwerbung ausländischer Arbeitskräfte über eine Agentur legal, und wie hoch ist das Kontrollrisiko?',
      a: 'Die Arbeit darf erst beginnen, wenn die erforderlichen Genehmigungen gültig sind; ein früherer Antritt gilt als illegale Arbeit. Nur ein Inhaber einer gültigen Vermittlungsgenehmigung darf Arbeitsvermittlung erbringen, und Agenturen sind in einem öffentlichen Register eingetragen. Es gilt Gleichbehandlung — die Bedingungen einer zeitweise überlassenen Arbeitskraft dürfen nicht schlechter sein als die eines vergleichbaren Stammbeschäftigten, und die Arbeitskraft zahlt nie eine Vermittlungsgebühr; die Einhaltung überwacht die Arbeitsinspektion. Die Agentur übernimmt die Dokumente der Ausländer, die Verantwortung trägt jedoch auch der Entleiher mit. Wir versprechen keine konkreten Bearbeitungszeiten und keine beanstandungsfreie Kontrolle; Einzelheiten finden Sie auf unseren Seiten zur Beschäftigung von Ausländern. Dies ist eine allgemeine Information, keine Rechtsberatung.',
    },
    {
      q: 'Woraus setzt sich der Agenturpreis zusammen, und gibt es versteckte Gebühren?',
      a: 'Der berechnete Preis umfasst in der Regel weiterberechnete Lohnkosten (Bruttolohn plus gesetzliche Arbeitgeberbeiträge), weiterberechnete Betriebskosten und das Honorar der Agentur; die Mehrwertsteuer ist eine separate Position. Es ist eine betriebliche, keine steuerliche Ersparnis — der Lohn der Arbeitskraft wird über die Agentur nicht gesenkt. Modellieren Sie die konkreten Zahlen im Vergleichsmodus des Rechners; ein pauschales „X % sparen“ nennen wir nicht.',
    },
    {
      q: 'Wer ist wofür verantwortlich — Arbeitsschutz, PSA, Löhne, Unterlagen?',
      a: 'Als Orientierung: Die Agentur stellt Arbeitsvertrag, Löhne, Beiträge und Ausländerunterlagen bereit; der Entleiher (Ihr Unternehmen) leitet die tägliche Arbeit an; Arbeitsschutz, Anwesenheit und Beendigung sind meist geteilt; PSA, Eingangsuntersuchungen, Unterkunft und Transport werden vertraglich vereinbart. Die genaue Aufteilung legt stets der Vertrag fest, und dies ist keine Rechtsberatung. Siehe den Leitfaden dazu, wie eine Agentur funktioniert.',
    },
    {
      q: 'An wen sende ich Unternehmensdaten, und ist die Agentur berechtigt?',
      a: `Verantwortlich für die Formulardaten ist ${OPERATOR}. In der Tschechischen Republik darf Arbeitsvermittlung nur ein Inhaber einer gültigen Genehmigung nach dem Beschäftigungsgesetz erbringen, und Agenturen sind in einem öffentlichen Register eingetragen, das Sie prüfen können. Geprüfte Identifikationsangaben und wie Sie eine Agentur prüfen, finden Sie auf unserer Über-uns-Seite.`,
    },
  ],
}

export const REQUEST_COPY: Record<Locale, RequestCopy> = { cs, en, de }
