import Head from 'next/head'
import { localeAlternateTags } from '../components/locale/LocaleAlternates'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { OPERATOR_EMAIL } from '../lib/content/trust-data'
import HomePayrollCalculator from '../components/HomePayrollCalculator'
import HomeAgencyValue from '../components/HomeAgencyValue'
import RecruitmentProcess from '../components/RecruitmentProcess'

const employmentAgencySchema = {
  '@context': 'https://schema.org',
  '@type': 'EmploymentAgency',
  name: 'TalentPartnerID',
  legalName: 'TNT agency s.r.o.',
  url: 'https://talentpartnerid.com',
  logo: 'https://talentpartnerid.com/favicon.svg',
  description: 'TNT agency s.r.o. je personální agentura se sídlem v Pardubicích. Zprostředkujeme zaměstnání dle §14 zákona č. 435/2004 Sb., o zaměstnanosti.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Na Spravedlnosti 1533',
    addressLocality: 'Pardubice',
    addressRegion: 'Zelené Předměstí',
    postalCode: '530 02',
    addressCountry: 'CZ',
  },
  telephone: '+420776858284',
  email: OPERATOR_EMAIL,
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'recruitment',
    telephone: '+420776858284',
    email: OPERATOR_EMAIL,
    availableLanguage: ['Czech', 'English', 'German'],
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '08:00',
    closes: '17:00',
  },
  areaServed: ['CZ', 'DE', 'SK', 'AT'],
}

// WebSite identity only. No SearchAction/potentialAction: the site has no
// on-site search results feature, so the search template previously advertised
// here (…/?s={search_term_string}) made Google discover an invalid parameter
// URL. Removing it at the source stops that URL from ever being emitted.
const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'TalentPartnerID',
  url: 'https://talentpartnerid.com',
  description: 'Employment and staffing agency connecting talent with opportunity across all industries.',
}

export default function Home() {
  return (
    <>
      <Head>
        <title>Personální agentura pro zaměstnavatele — provozní i odborné pozice | TalentPartnerID</title>
        <meta name="description" content="Pomáháme zaměstnavatelům obsadit provozní profese ve výrobě, skladech a logistice i odborné a technické pozice — přímý nábor i agenturní zaměstnávání, kalkulačka nákladů a podpora u zaměstnávání cizinců. Provozovatel: TNT agency s.r.o., Pardubice." />
        <meta name="keywords" content="personální agentura, agentura práce, zprostředkování zaměstnání, nábor odborných pozic, technické pozice, agenturní zaměstnávání, Pardubice" />
        <meta name="robots" content="index, follow" />
        <meta name="last-modified" content="2026-05-03" />
        <meta property="article:modified_time" content="2026-05-03T00:00:00+02:00" />
        <link rel="canonical" href="https://talentpartnerid.com/" />
        {/* Reciprocal hreflang from the locale registry. */}
        {localeAlternateTags({ route: '/' })}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://talentpartnerid.com/" />
        <meta property="og:site_name" content="TalentPartnerID" />
        <meta property="og:title" content="Personální agentura pro zaměstnavatele | TalentPartnerID" />
        <meta property="og:description" content="Provozní profese do výroby, skladů a logistiky i odborné a technické pozice. Přímý nábor i agenturní zaměstnávání, kalkulačka nákladů a podpora u zaměstnávání cizinců." />
        <meta property="og:image" content="https://talentpartnerid.com/assets/og.svg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="cs_CZ" />
        <meta property="og:locale:alternate" content="en_US" />
        <meta property="og:locale:alternate" content="de_DE" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="TalentPartnerID — personální agentura pro zaměstnavatele" />
        <meta name="twitter:description" content="Obsazování provozních profesí ve výrobě, skladech a logistice i odborných a technických pozic. Přímý nábor i agenturní zaměstnávání." />
        <meta name="twitter:image" content="https://talentpartnerid.com/assets/og.svg" />
        <script key="schema-agency" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(employmentAgencySchema) }} />
        <script key="schema-website" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      </Head>

      <Header activePage="home" />

      {/* HERO */}
      <section className="hero" id="home">
        <div className="container">
          <div className="hero__inner">
            <div className="hero__badge fi">
              <span className="badge-pulse" aria-hidden="true"></span>
              <span data-i18n="hero.badge">Personální agentura · Talent. Síť. Důvěra.</span>
            </div>
            <h1 className="fi d1">
              <span data-i18n="hero.h1a">Spojujeme</span><br />
              <span data-i18n="hero.h1b">správné lidi</span><br />
              <span data-i18n="hero.h1c">se správnými</span> <span className="text-accent" data-i18n="hero.h1accent">firmami.</span>
            </h1>
            {/* Kept in sync with hero.sub in public/script.js. The previous copy
                promised "manažerské pozice napříč všemi odvětvími", which no page
                on the site supported; this states the scope the site can back. */}
            <p className="hero__sub fi d2" data-i18n="hero.sub">TalentPartnerID pomáhá firmám najít ty správné lidi — do provozních profesí ve výrobě, skladech a logistice i na odborné a technické pozice, které na ně navazují.</p>
            <div className="hero__ctas fi d3">
              {/* Employer staffing request. This used to point at /agencies —
                  the agency DIRECTORY, whose first section still reads "Seznam
                  agentur již brzy" — so the site's largest employer button sent
                  buying employers to a coming-soon list instead of the request
                  form. The label is unambiguous in all three locales
                  ("Hledám pracovníky" / "I'm Looking for Talent"), so the
                  destination follows the label. */}
              <a href="/poptavka-pracovniku" className="btn btn-accent btn-lg" data-i18n="hero.cta1">Hledám pracovníky</a>
              <a href="/offers" className="btn btn-outline-white btn-lg" data-i18n="hero.cta2">Hledám práci</a>
            </div>
          </div>
        </div>
        <div className="hero__wave" aria-hidden="true">
          <svg viewBox="0 0 1440 72" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,36 C240,72 480,0 720,36 C960,72 1200,0 1440,36 L1440,72 L0,72 Z" fill="#ffffff" />
          </svg>
        </div>
      </section>

      {/* FOCUS STRIP — honest, non-quantified positioning (no unverified metrics).
          The previous strip advertised unverifiable figures (500+/100+/24 h);
          replaced with factual focus areas that need no numeric substantiation. */}
      <section className="stats-strip" aria-label="Naše zaměření">
        <div className="container">
          <div className="stats-grid fi">
            <div className="stat-item">
              <strong data-i18n="stats.s1">Výroba, sklady, logistika</strong>
              <span data-i18n="stats.s1sub">Obsazování provozních profesí</span>
            </div>
            <div className="stat-divider" aria-hidden="true"></div>
            <div className="stat-item">
              <strong data-i18n="stats.s2">Odborné a technické pozice</strong>
              <span data-i18n="stats.s2sub">Kvalifikované profese a provozní vedení</span>
            </div>
            <div className="stat-divider" aria-hidden="true"></div>
            <div className="stat-item">
              <strong data-i18n="stats.s3">Zaměstnávání cizinců</strong>
              <span data-i18n="stats.s3sub">Podpora u povolení a karet</span>
            </div>
            <div className="stat-divider" aria-hidden="true"></div>
            <div className="stat-item">
              <strong data-i18n="stats.s4">Odhad nákladů</strong>
              <span data-i18n="stats.s4sub">Kalkulačka ceny práce před poptávkou</span>
            </div>
          </div>
        </div>
      </section>

      {/* POSITIONING — what the company actually does.
          Placed directly under the focus strip, above the calculator: the
          calculator is a tool, and a visitor needs to know what is being
          offered before being handed one. The two pillars are the site's only
          server-rendered entry into the professional/specialist cluster, which
          is what puts /nabor-odbornych-pozic at contextual depth 1. */}
      <section className="section" id="pozice-a-lide" aria-labelledby="pozice-a-lide-title">
        <div className="container">
          <div className="positioning__lede fi">
            <div className="eyebrow" data-i18n="positioning.eyebrow">Co pro firmy děláme</div>
            <h2 id="pozice-a-lide-title" data-i18n="positioning.h2">
              Najít lidi je snadné.<br />Najít ty <span className="text-accent">správné</span> už ne.
            </h2>
            {/* Each translated text node stays on one line: validate:czech-default
                compares the server-rendered default byte-for-byte against the cs
                dictionary in public/script.js, and JSX line-wrapping would inject
                newlines the dictionary value does not have. */}
            <p data-i18n="positioning.p1">Uchazečů bývá na trhu dost. Rozpoznat mezi nimi ty, kdo skutečně odpovídají dané roli, požadavkům a provozu, ale znamená čas, ověřování a pečlivý výběr.</p>
            <p data-i18n="positioning.p2">Tuhle část práce bereme na sebe — pomáháme firmám kandidáty najít, ověřit jejich kvalifikaci a spojit se s lidmi, které na dané místo skutečně potřebují.</p>
            <div className="positioning__tagline" aria-label="Naše služby">
              <span data-i18n="positioning.tag1">Nábor</span>
              <span data-i18n="positioning.tag2">Agenturní zaměstnávání</span>
              <span data-i18n="positioning.tag3">Personální zajištění provozu</span>
            </div>
          </div>

          <div className="pillars">
            <div className="pillar fi d1">
              <div className="pillar__label" data-i18n="pillars.a.label">Provozní profese</div>
              <h3 data-i18n="pillars.a.h3">Dělníci a provozní pracovníci</h3>
              <p data-i18n="pillars.a.p">Obsazování výroby, skladů a logistiky včetně směnného provozu, sezónních špiček a navýšení kapacity. Přímý nábor i agenturní zaměstnávání podle toho, zda jde o stálou, nebo dočasnou potřebu.</p>
              <ul className="pillar__list">
                <li><a href="/pracovnici-pro-vyrobu">Pracovníci pro výrobu</a></li>
                <li><a href="/pracovnici-do-skladu">Pracovníci do skladu</a></li>
                <li><a href="/pracovnici-do-logistiky">Pracovníci do logistiky</a></li>
                <li><a href="/pracovnici-pro-stavebnictvi">Pracovníci pro stavebnictví</a></li>
                <li><a href="/nabor-zahranicnich-pracovniku">Nábor ze zahraničí</a></li>
              </ul>
              <div className="pillar__foot">
                <a href="/pro-zamestnavatele" className="btn btn-ghost btn-sm" data-i18n="pillars.a.cta">Pro zaměstnavatele: rozcestník →</a>
              </div>
            </div>

            <div className="pillar fi d2">
              <div className="pillar__label" data-i18n="pillars.b.label">Odborné a technické pozice</div>
              <h3 data-i18n="pillars.b.h3">Odborníci a kvalifikovaní specialisté</h3>
              <p data-i18n="pillars.b.p">U kvalifikovaných profesí nebývá problém v počtu uchazečů, ale v tom, že vhodných lidí je málo, často nehledají aktivně a jejich způsobilost je vázaná na doklady a oprávnění. Nábor proto vypadá jinak než u provozních rolí.</p>
              <ul className="pillar__list">
                <li><a href="/strojirenske-profese">Strojírenské profese</a></li>
                <li><a href="/udrzba-a-technicky-servis">Údržba a technický servis</a></li>
                <li><a href="/pozice-v-rizeni-kvality">Řízení kvality</a></li>
                <li><a href="/mistri-a-vedouci-smen">Mistři a vedoucí směn</a></li>
                <li><a href="/thp-pozice">THP pozice</a></li>
              </ul>
              <div className="pillar__foot">
                <a href="/nabor-odbornych-pozic" className="btn btn-primary btn-sm" data-i18n="pillars.b.cta">Nábor odborných pozic →</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PAYROLL CALCULATOR — flagship */}
      <section className="section" id="kalkulacka-mezd" aria-labelledby="kalkulacka-mezd-title">
        <div className="container">
          <div className="section-head fi">
            <div className="eyebrow" data-i18n="calc.eyebrow">Kalkulačka nákladů zaměstnance</div>
            <h2 id="kalkulacka-mezd-title" data-i18n="calc.heading">Spočítejte skutečné náklady na zaměstnance</h2>
            <p data-i18n="calc.sub">Zjistěte čistou mzdu zaměstnance, zákonné odvody a celkové měsíční náklady zaměstnavatele podle pravidel platných v České republice.</p>
          </div>
          <HomePayrollCalculator />
        </div>
      </section>

      {/* AGENCY VALUE — statutory payroll is not the whole staffing cost */}
      <section className="section section--alt" id="agenturni-hodnota">
        <div className="container">
          <HomeAgencyValue />
        </div>
      </section>

      {/* HOW IT WORKS — server-rendered.
          The three steps previously existed only in the client-side dictionary
          and only on /agencies, injected into an empty div after hydration, so
          a buyer arriving from an outreach message met no explanation of the
          process at all. */}
      <RecruitmentProcess />

      {/* FOR EMPLOYERS — PREVIEW */}
      <section className="section section--alt" id="services">
        <div className="container">
          <div className="section-head fi">
            <div className="eyebrow" data-i18n="employers.eyebrow">Pro zaměstnavatele</div>
            <h2 data-i18n="employers.h2">Personální služby<br />přizpůsobené vašemu byznysu</h2>
            <p data-i18n="employers.sub">Od jediné pozice po budování celých týmů — máme řešení, které odpovídá vašim potřebám a časovému harmonogramu.</p>
          </div>
          <div style={{ textAlign: 'center', marginTop: '36px' }} className="fi d1">
            {/* The section above is headed "Pro zaměstnavatele — Personální
                služby"; /agencies is the agency directory, which lists other
                agencies rather than our services. The employer hub is the page
                that actually carries them. Not a request CTA — browse intent
                keeps a browse destination. */}
            <a href="/pro-zamestnavatele" className="btn btn-primary btn-lg">Prozkoumat služby a odvětví →</a>
          </div>
        </div>
      </section>

      {/* FOR CANDIDATES — PREVIEW */}
      <section className="section candidates section--navy" id="candidates">
        <div className="container">
          <div className="candidates__inner">
            <div className="fi">
              <div className="eyebrow eyebrow--light" data-i18n="candidates.eyebrow">Pro uchazeče</div>
              <h2 data-i18n="candidates.h2">Hledáte<br />novou kariérní příležitost?</h2>
              <p data-i18n="candidates.sub">Pomáháme uchazečům najít vhodné pracovní uplatnění. Naše služba je pro uchazeče zcela <strong>zdarma</strong>.</p>
              <div className="cand-ctas" style={{ marginTop: '32px' }}>
                <a href={`mailto:${OPERATOR_EMAIL}?subject=Job%20Application`} className="btn btn-accent btn-lg" data-i18n="candidates.cta1">Poslat životopis</a>
                <a href="/offers" className="btn btn-outline-white btn-lg">Procházet nabídky →</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MARKETPLACE CTA */}
      <section className="section section--alt" id="marketplace">
        <div className="container">
          <div className="section-head fi">
            <div className="eyebrow">Tržiště</div>
            <h2>🚀 Získejte klienty nebo najděte agentury</h2>
            <p>Ať už provozujete personální agenturu, nebo ji hledáte — jste na správném místě. Zadejte svůj profil nebo poptávku během několika minut.</p>
          </div>
          <div className="cta-duo__grid">
            <div className="cta-duo__card fi d1">
              <div className="cta-duo__icon">🏢</div>
              <h3>Jste agentura?</h3>
              <p>Nechte se najít firmami, které aktivně hledají partnery pro nábor a personální zajištění. Zadejte svůj profil a oslovte nové klienty.</p>
              <a href="/submit-agency" className="btn btn-accent btn-lg">Zveřejnit agenturu</a>
            </div>
            <div className="cta-duo__card fi d2">
              <div className="cta-duo__icon">🔍</div>
              <h3>Hledáte agenturu?</h3>
              <p>Zadejte své požadavky a nechte kvalifikované agentury, ať se ozvou vám. Zdarma, rychle a před zveřejněním ručně ověřené.</p>
              <a href="/submit-offer" className="btn btn-primary btn-lg">Zadat poptávku</a>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT TEASER */}
      <section className="section contact-teaser" id="contact-cta">
        <div className="container">
          <div className="section-head fi">
            <div className="eyebrow" data-i18n="contact.eyebrow">Kontaktujte nás</div>
            <h2 data-i18n="contact.h2">Připraveni najít<br />vašeho ideálního kandidáta?</h2>
            <p>Napište nám o své volné pozici. Na zprávy odpovídáme v pracovní dny. Chcete si nás ověřit? <a href="/o-nas">O nás a ověření agentury</a>.</p>
          </div>
          <div style={{ textAlign: 'center', marginTop: '36px' }} className="fi d1">
            {/* Labelled "Poslat poptávku" (send a request) but pointed at the
                generic contact page. The label names the request form, so the
                destination now matches it. */}
            <a href="/poptavka-pracovniku" className="btn btn-primary btn-lg">Poslat poptávku →</a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
