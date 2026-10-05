import Head from 'next/head'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { OPERATOR_EMAIL } from '../lib/content/trust-data'

const schema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Job Offers & Client Requests',
  description: 'Open positions and client staffing requests on TalentPartnerID',
  url: 'https://talentpartnerid.com/offers',
  numberOfItems: 0,
}

export default function Offers() {
  return (
    <>
      <Head>
        <title>Job Offers &amp; Client Requests | TalentPartnerID</title>
        <meta name="description" content="Browse open job offers and client requests from companies looking for recruitment support. Find your next role or post your staffing requirement. TalentPartnerID — free for candidates, always." />
        <meta name="keywords" content="job offers, client requests, staffing requirements, find agency, recruitment needs, job opportunities Czech Republic" />
        <meta name="robots" content="index, follow" />
        <meta name="last-modified" content="2026-05-03" />
        <meta property="article:modified_time" content="2026-05-03T00:00:00+02:00" />
        <link rel="canonical" href="https://talentpartnerid.com/offers" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://talentpartnerid.com/offers" />
        <meta property="og:site_name" content="TalentPartnerID" />
        <meta property="og:title" content="Job Offers &amp; Client Requests | TalentPartnerID" />
        <meta property="og:description" content="Browse open positions and client offers or post your own staffing requirement to get matched with the right agency." />
        <meta property="og:image" content="https://talentpartnerid.com/assets/og.svg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Job Offers &amp; Client Requests | TalentPartnerID" />
        <meta name="twitter:description" content="Find your next role or post your hiring requirement. TalentPartnerID connects talent with companies." />
        <meta name="twitter:image" content="https://talentpartnerid.com/assets/og.svg" />
        <script key="schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      </Head>

      <Header activePage="offers" />

      {/* PAGE HERO */}
      <section className="page-hero" id="home">
        <div className="container">
          <div className="eyebrow eyebrow--light fi" data-i18n="pages.offersEyebrow">Nabídky a příležitosti</div>
          <h1 className="fi d1" data-i18n="pages.offersH1">Procházejte nabídky a najděte novou roli</h1>
          <p className="page-hero__sub fi d2" data-i18n="pages.offersSub">Poptávky firem hledajících personální podporu i otevřené pozice pro uchazeče. Vše ručně kontrolujeme před zveřejněním.</p>
        </div>
        <div className="page-hero__wave" aria-hidden="true">
          <svg viewBox="0 0 1440 56" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,28 C240,56 480,0 720,28 C960,56 1200,0 1440,28 L1440,56 L0,56 Z" fill="#ffffff" />
          </svg>
        </div>
      </section>

      {/* LISTINGS */}
      <section className="section" id="listings">
        <div className="container">
          <div className="listing-placeholder fi">
            <div className="listing-placeholder__icon">🔍</div>
            <h3 data-i18n="pages.offersListTitle">Nabídky již brzy</h3>
            <p data-i18n="pages.offersListBody">Firmy vkládají své poptávky a my je před zveřejněním kontrolujeme. Buďte první, koho spojíme – zadejte svou poptávku ještě dnes.</p>
            <a href="/submit-offer" className="btn btn-accent btn-lg" data-i18n="pages.offersListBtn">Zadat poptávku</a>
          </div>
          <p className="listing-cta-note fi d1" data-i18n="pages.offersCtaNote">
            Jste agentura? <a href="/agencies">Projděte katalog agentur</a> nebo <a href="/submit-agency">zadejte svůj profil</a>.
          </p>
        </div>
      </section>

      {/* FOR CANDIDATES */}
      <section className="section candidates section--navy" id="candidates">
        <div className="container">
          <div className="candidates__inner">
            <div className="fi">
              <div className="eyebrow eyebrow--light" data-i18n="candidates.eyebrow">Pro uchazeče</div>
              <h2 data-i18n="candidates.h2">Hledáte<br />novou kariérní příležitost?</h2>
              <p data-i18n="candidates.sub">Pomáháme uchazečům najít vhodné pracovní uplatnění. Naše služba je pro uchazeče zcela <strong>zdarma</strong>.</p>
              {/* Rendered by script.js */}
              <div className="cand-benefits" id="candBenefits"></div>
              <div className="cand-ctas">
                <a href={`mailto:${OPERATOR_EMAIL}?subject=Job%20Application`} className="btn btn-accent btn-lg" data-i18n="candidates.cta1">Poslat životopis</a>
                <a href="/contact" className="btn btn-outline-white btn-lg" data-i18n="candidates.cta2">Promluvit s náborářem</a>
              </div>
            </div>
            <div className="cand-visual fi d2" aria-hidden="true">
              <div className="cand-card">
                <div className="cand-card__label" data-i18n="candidates.card.label">Aktuálně hledáme</div>
                {/* Rendered by script.js */}
                <div className="cand-card__roles" id="candRoles"></div>
                <a href={`mailto:${OPERATOR_EMAIL}?subject=Job%20Application`} className="cand-card__cta" data-i18n="candidates.card.link">Zobrazit všechny pozice →</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* POST OFFER CTA */}
      <section className="section section--alt">
        <div className="container">
          <div className="section-head fi">
            <div className="eyebrow" data-i18n="pages.offersPostEyebrow">Zadejte poptávku</div>
            <h2 data-i18n="pages.offersPostH2">Hledáte personální nebo pracovní agenturu?</h2>
            <p data-i18n="pages.offersPostSub">Napište nám, co potřebujete, a kvalifikované agentury si vaši poptávku budou moci prohlédnout. Zdarma, rychle a plně moderované.</p>
          </div>
          <div style={{ textAlign: 'center', marginTop: '36px' }} className="fi d1">
            <a href="/submit-offer" className="btn btn-accent btn-lg" data-i18n="pages.offersPostBtn">Zadat poptávku →</a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
