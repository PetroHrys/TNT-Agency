import Head from 'next/head'
import { localeAlternateTags } from '../components/locale/LocaleAlternates'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { OPERATOR_EMAIL } from '../lib/content/trust-data'

const schema = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact TalentPartnerID',
  description: 'Contact page for TalentPartnerID recruitment and staffing services',
  url: 'https://talentpartnerid.com/contact',
  mainEntity: {
    '@type': 'EmploymentAgency',
    name: 'TalentPartnerID',
    legalName: 'TNT agency s.r.o.',
    telephone: '+420776858284',
    email: OPERATOR_EMAIL,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Na Spravedlnosti 1533',
      addressLocality: 'Pardubice',
      postalCode: '530 02',
      addressCountry: 'CZ',
    },
  },
}

export default function Contact() {
  return (
    <>
      <Head>
        <title>Contact TalentPartnerID | Get a Free Recruitment Consultation</title>
        <meta name="description" content="Contact TalentPartnerID for a free recruitment consultation. Tell us about your open role and we'll respond with a clear plan. Based in Pardubice, Czech Republic." />
        <meta name="keywords" content="contact TalentPartnerID, recruitment consultation, staffing inquiry, employment agency contact" />
        <meta name="robots" content="index, follow" />
        <meta name="last-modified" content="2026-05-03" />
        <meta property="article:modified_time" content="2026-05-03T00:00:00+02:00" />
        <link rel="canonical" href="https://talentpartnerid.com/contact" />
        {/* Reciprocal hreflang from the locale registry. */}
        {localeAlternateTags({ route: '/contact' })}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://talentpartnerid.com/contact" />
        <meta property="og:site_name" content="TalentPartnerID" />
        <meta property="og:title" content="Contact TalentPartnerID | Free Recruitment Consultation" />
        <meta property="og:description" content="Get in touch with TalentPartnerID. Send us your brief and we'll be in touch." />
        <meta property="og:image" content="https://talentpartnerid.com/assets/og.svg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contact TalentPartnerID | Free Recruitment Consultation" />
        <meta name="twitter:description" content="Napište nám o volné pozici — přímý nábor, odborné a technické pozice i agenturní zaměstnávání." />
        <meta name="twitter:image" content="https://talentpartnerid.com/assets/og.svg" />
        <script key="schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      </Head>

      <Header activePage="contact" />

      {/* PAGE HERO */}
      <section className="page-hero" id="home">
        <div className="container">
          <div className="eyebrow eyebrow--light fi" data-i18n="contact.eyebrow">Kontaktujte nás</div>
          <h1 className="fi d1" data-i18n="pages.contactH1">Chcete najít skvělého zaměstnance?</h1>
          <p className="page-hero__sub fi d2" data-i18n="pages.contactSub">Napište nám o vaší volné pozici. Na zprávy odpovídáme v pracovní dny.</p>
        </div>
        <div className="page-hero__wave" aria-hidden="true">
          <svg viewBox="0 0 1440 56" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,28 C240,56 480,0 720,28 C960,56 1200,0 1440,28 L1440,56 L0,56 Z" fill="#ffffff" />
          </svg>
        </div>
      </section>

      {/* CONTACT */}
      <section className="section contact" id="contact">
        <div className="container">
          <div className="contact__inner">

            <div className="contact__left fi">
              <div className="eyebrow" data-i18n="contact.eyebrow">Kontaktujte nás</div>
              <h2 data-i18n="contact.h2">Připraveni najít<br />vašeho ideálního kandidáta?</h2>
              <p data-i18n="contact.sub">Řekněte nám o volné pozici. Na zprávy odpovídáme v pracovní dny.</p>

              <div className="contact-info">

                <div className="contact-info__item">
                  <div className="contact-info__icon" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 17z" />
                    </svg>
                  </div>
                  <div>
                    <span className="contact-info__label" data-i18n="contact.labelPhone">Telefon</span>
                    <a href="tel:+420776858284">+420 776 858 284</a>
                  </div>
                </div>

                <div className="contact-info__item">
                  <div className="contact-info__icon" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                  <div>
                    <span className="contact-info__label" data-i18n="contact.labelEmail">E-mail</span>
                    <a href={`mailto:${OPERATOR_EMAIL}`}>{OPERATOR_EMAIL}</a>
                  </div>
                </div>

                <div className="contact-info__item">
                  <div className="contact-info__icon" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div>
                    <span className="contact-info__label" data-i18n="contact.labelOffice">Kancelář</span>
                    <span>Na Spravedlnosti 1533, Zelené Předměstí, 530 02 Pardubice</span>
                  </div>
                </div>

                <div className="contact-info__item">
                  <div className="contact-info__icon" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                  <div>
                    <span className="contact-info__label" data-i18n="contact.labelHours">Pracovní doba</span>
                    <span data-i18n="contact.hours">Po–Pá: 8:00 – 17:00</span>
                  </div>
                </div>

              </div>

              {/* Social links intentionally omitted: no confirmed TalentPartnerID
                  social profiles exist yet. Add confirmed URLs to SITE.social
                  (lib/content/rules.ts) to surface them; do not reuse old handles. */}
            </div>

            <div className="contact__form-wrap fi d2">
              <div className="contact-cta-card">
                <h3 data-i18n="pages.contactCardTitle">Napište nám</h3>
                <p data-i18n="pages.contactCardBody">Popište nám pozici nebo poptávku e-mailem a co nejdříve se vám ozveme.</p>
                <a
                  className="btn btn-primary btn-lg btn-full contact-cta-card__btn"
                  data-i18n="pages.cardBtn"
                  href={`mailto:${OPERATOR_EMAIL}?subject=Popt%C3%A1vka%20%E2%80%93%20TalentPartnerID`}
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
        </div>
      </section>

      <Footer />
    </>
  )
}
