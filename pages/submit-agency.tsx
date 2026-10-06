import Head from 'next/head'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { OPERATOR_EMAIL } from '../lib/content/trust-data'

const schema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Submit Your Agency',
  description: 'Submit your recruitment or staffing agency to the TalentPartnerID directory',
  url: 'https://talentpartnerid.com/submit-agency',
}

export default function SubmitAgency() {
  return (
    <>
      <Head>
        <title>Submit Your Agency | TalentPartnerID</title>
        <meta name="description" content="Submit your recruitment or staffing agency to the TalentPartnerID directory. Get discovered by companies looking for your services. Every submission is reviewed manually before publication." />
        <meta name="keywords" content="submit agency, list agency, agency directory, recruitment agency submission" />
        <meta name="robots" content="index, follow" />
        <meta name="last-modified" content="2026-05-03" />
        <meta property="article:modified_time" content="2026-05-03T00:00:00+02:00" />
        <link rel="canonical" href="https://talentpartnerid.com/submit-agency" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://talentpartnerid.com/submit-agency" />
        <meta property="og:site_name" content="TalentPartnerID" />
        <meta property="og:title" content="Submit Your Agency | TalentPartnerID" />
        <meta property="og:description" content="List your recruitment or staffing agency and get discovered by new clients. Free submission, manually reviewed." />
        <meta property="og:image" content="https://talentpartnerid.com/assets/og.svg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Submit Your Agency | TalentPartnerID" />
        <meta name="twitter:description" content="Get your agency listed and start receiving new client inquiries. Free and manually moderated." />
        <meta name="twitter:image" content="https://talentpartnerid.com/assets/og.svg" />
        <script key="schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      </Head>

      <Header activePage="submit-agency" />

      {/* PAGE HERO */}
      <section className="page-hero" id="home">
        <div className="container">
          <div className="eyebrow eyebrow--light fi" data-i18n="pages.submitAgEyebrow">Registrace agentury</div>
          <h1 className="fi d1" data-i18n="pages.submitAgH1">Registrujte svou agenturu</h1>
          <p className="page-hero__sub fi d2" data-i18n="pages.submitAgSub">Zviditelněte svou agenturu u firem, které hledají personální a náborové služby. Každou registraci kontrolujeme ručně – nic se nezveřejňuje automaticky.</p>
        </div>
        <div className="page-hero__wave" aria-hidden="true">
          <svg viewBox="0 0 1440 56" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,28 C240,56 480,0 720,28 C960,56 1200,0 1440,28 L1440,56 L0,56 Z" fill="#ffffff" />
          </svg>
        </div>
      </section>

      {/* FORM */}
      <section className="section" id="form">
        <div className="container">
          <div className="submit-wrap">

            <div className="contact-cta-card contact-cta-card--wide">
              <h3 data-i18n="pages.submitAgCardTitle">Registrace agentury</h3>
              <p data-i18n="pages.submitAgCardBody">Napište nám e-mail a uveďte název agentury, web, nabízené služby, lokalitu a krátký popis. Ozveme se vám.</p>
              <a
                className="btn btn-primary btn-lg contact-cta-card__btn"
                data-i18n="pages.cardBtn"
                href={`mailto:${OPERATOR_EMAIL}?subject=Registrace%20agentury%20%E2%80%93%20TalentPartnerID`}
              >Napsat e-mail</a>
              <p className="contact-cta-card__line">
                <span data-i18n="pages.cardEmailLabel">E-mail:</span> <a href={`mailto:${OPERATOR_EMAIL}`}>{OPERATOR_EMAIL}</a>
              </p>
              <p className="contact-cta-card__line">
                <span data-i18n="pages.cardPhoneLabel">Telefon:</span> <a href="tel:+420776858284">+420 776 858 284</a>
              </p>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
