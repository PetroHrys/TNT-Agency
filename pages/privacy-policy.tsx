import Head from 'next/head'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { OPERATOR_EMAIL } from '../lib/content/trust-data'

export default function PrivacyPolicy() {
  return (
    <>
      <Head>
        <title>Privacy Policy | TalentPartnerID</title>
        <meta
          name="description"
          content="TalentPartnerID privacy policy — how we collect, use, and protect your personal data in compliance with GDPR and Czech data protection law."
        />
        <meta name="robots" content="index, follow" />
        <meta name="last-modified" content="2026-05-03" />
        <meta property="article:modified_time" content="2026-05-03T00:00:00+02:00" />
        <link rel="canonical" href="https://talentpartnerid.com/privacy-policy" />
        {/* A real three-language set: three separate canonical documents, each
            self-canonical, each listing all three. No x-default — none of the
            three is a neutral or language-selection page, and pointing it at an
            arbitrary language would state something untrue. */}
        <link rel="alternate" hrefLang="en" href="https://talentpartnerid.com/privacy-policy" />
        <link rel="alternate" hrefLang="cs-CZ" href="https://talentpartnerid.com/privacy-cs.html" />
        <link rel="alternate" hrefLang="de" href="https://talentpartnerid.com/privacy-de.html" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://talentpartnerid.com/privacy-policy" />
        <meta property="og:title" content="Privacy Policy | TalentPartnerID" />
        <meta property="og:description" content="How TalentPartnerID collects, uses and protects your personal data." />
        <meta property="og:image" content="https://talentpartnerid.com/assets/og.svg" />
      </Head>

      <Header />

      <section className="page-hero" id="top">
        <div className="container">
          <div className="eyebrow eyebrow--light fi">Legal</div>
          <h1 className="fi d1">Privacy Policy</h1>
          <p className="page-hero__sub fi d2">
            Last updated: 27 April 2026 &nbsp;·&nbsp; TNT agency s.r.o.
          </p>
        </div>
        <div className="page-hero__wave" aria-hidden="true">
          <svg viewBox="0 0 1440 56" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,28 C240,56 480,0 720,28 C960,56 1200,0 1440,28 L1440,56 L0,56 Z" fill="#ffffff" />
          </svg>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="legal-content">

            {/* Crawlable links to the translated privacy documents. This is the
                canonical English privacy page (footer-linked sitewide), so these
                anchors make the Czech and German versions discoverable to Google
                without hreflang (there is no localized route family — the CS/DE
                documents are independent static pages). */}
            <div className="legal-lang">
              <a href="/privacy-policy" className="active">EN</a>
              <a href="/privacy-cs.html">CS</a>
              <a href="/privacy-de.html">DE</a>
            </div>

            <p className="legal-intro">
              This Privacy Policy explains how TNT agency s.r.o. (&ldquo;we&rdquo;, &ldquo;us&rdquo;,
              &ldquo;our&rdquo;) collects, uses, stores, and protects your personal data when you use
              our website at <strong>talentpartnerid.com</strong> or submit any form. We comply with
              Regulation (EU) 2016/679 (GDPR) and Act No. 110/2019 Coll. on personal data
              processing.
            </p>

            {/* 1 */}
            <h2>1. Data Controller</h2>
            <table className="legal-table">
              <tbody>
                <tr><th>Company</th><td>TNT agency s.r.o.</td></tr>
                <tr><th>Address</th><td>Na Spravedlnosti 1533, Zelené Předměstí, 530 02 Pardubice, Czech Republic</td></tr>
                <tr><th>Email</th><td><a href={`mailto:${OPERATOR_EMAIL}`}>{OPERATOR_EMAIL}</a></td></tr>
                <tr><th>Phone</th><td><a href="tel:+420776858284">+420 776 858 284</a></td></tr>
              </tbody>
            </table>

            {/* 2 */}
            <h2>2. Personal Data We Collect</h2>
            <p>Depending on how you interact with our website, we may collect:</p>

            <h3>2.1 Contact form</h3>
            <ul>
              <li>Full name and company name</li>
              <li>Email address and phone number</li>
              <li>Service enquiry details (role, message)</li>
            </ul>

            <h3>2.2 Agency submission form</h3>
            <ul>
              <li>Agency name, website URL</li>
              <li>Services offered, description, location</li>
              <li>Contact email address</li>
            </ul>

            <h3>2.3 Client offer / request form</h3>
            <ul>
              <li>Company name, website URL</li>
              <li>Staffing requirement details, budget, timeline</li>
              <li>Contact email address</li>
            </ul>

            <h3>2.4 Worker request form (Poptávka pracovníků)</h3>
            <p>
              The worker request form works differently from a conventional web form, and it is
              important to understand exactly what happens:
            </p>
            <ul>
              <li>
                The form runs <strong>entirely in your browser</strong>. When you press the prepare
                button, your browser composes a structured email message.
              </li>
              <li>
                That message is handed to <strong>your own email application or webmail</strong>. You
                review it and you send it. Until you do, nothing reaches us.
              </li>
              <li>
                The message travels through <strong>your chosen email provider</strong> and arrives in
                the business inbox of TNT agency s.r.o. at{' '}
                <a href={`mailto:${OPERATOR_EMAIL}`}>{OPERATOR_EMAIL}</a>.
              </li>
              <li>
                <strong>This website does not store your request in a database.</strong> There is no
                account, no employer portal, and no server-side copy of what you typed. The only
                record is the resulting email correspondence.
              </li>
              <li>
                A short, non-personal reference (for example <code>TPID-2026-0719-A7K4</code>) is
                generated in your browser so the request can be identified in email. It contains no
                name, company, address or amount, and it is not stored on your device.
              </li>
              <li>
                A limited, non-personal set of attribution values — landing page, current page,
                referring domain, UTM parameters, the button you came from, interface language and
                the time you prepared the request — is included <em>in the prepared email only</em>.
                It is not sent to analytics, and it is not written to cookies, local storage or the
                page address.
              </li>
              <li>
                <strong>Values you enter into the payroll calculator are never transmitted.</strong>{' '}
                The calculator runs only in your browser. No salary, net pay, employer cost, agency
                fee, margin or estimated saving is placed in the request, the page address or
                analytics. If you want to state a budget, you type it into the form yourself.
              </li>
              <li>
                Resulting email correspondence may be retained for the purpose of handling your
                business request and to meet legal and accounting obligations.
              </li>
            </ul>
            <p>
              You may request access to, correction of, or deletion of the personal data contained in
              that correspondence at any time — see Section 7. Because the request is ordinary email,
              deletion requests are handled against our mailbox rather than a database record.
            </p>

            <h3>2.5 Technical data collected automatically</h3>
            <ul>
              <li>IP address (retained in server logs)</li>
              <li>Browser type and version</li>
              <li>Date and time of access</li>
              <li>Referring URL</li>
            </ul>

            <h3>2.6 Cookies and tracking</h3>
            <p>
              This site sets no cookies. Analytics runs only with your explicit consent: before you
              accept, the analytics script is not requested and no analytics identifier is created.
              See Section 8 for full details.
            </p>

            {/* 3 */}
            <h2>3. Purposes and Legal Basis for Processing</h2>
            <table className="legal-table">
              <thead>
                <tr><th>Purpose</th><th>Legal basis (GDPR Art. 6)</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td>Responding to contact enquiries</td>
                  <td>Art. 6(1)(b) — contract / pre-contractual steps</td>
                </tr>
                <tr>
                  <td>Processing agency submissions</td>
                  <td>Art. 6(1)(a) — consent given at submission</td>
                </tr>
                <tr>
                  <td>Processing client offers</td>
                  <td>Art. 6(1)(a) — consent given at submission</td>
                </tr>
                <tr>
                  <td>Sending recruitment-related emails</td>
                  <td>Art. 6(1)(b) — contract / Art. 6(1)(a) — consent</td>
                </tr>
                <tr>
                  <td>Website analytics (WebmasterID)</td>
                  <td>Art. 6(1)(a) — consent (opt-in via cookie banner)</td>
                </tr>
                <tr>
                  <td>Server security and fraud prevention</td>
                  <td>Art. 6(1)(f) — legitimate interests</td>
                </tr>
              </tbody>
            </table>

            {/* 4 */}
            <h2>4. Data Retention</h2>
            <table className="legal-table">
              <thead>
                <tr><th>Data category</th><th>Retention period</th></tr>
              </thead>
              <tbody>
                <tr><td>Contact / form submissions</td><td>2 years from last interaction, then deleted</td></tr>
                <tr><td>Candidate CV and placement data</td><td>3 years, or until you withdraw consent</td></tr>
                <tr><td>Server access logs</td><td>30 days (security purposes)</td></tr>
                <tr><td>Email records (sent / received)</td><td>2 years</td></tr>
                <tr><td>Cookie consent record</td><td>Stored in your browser until you clear it</td></tr>
                <tr>
                  <td>Analytics identifiers (if consented)</td>
                  <td>
                    Stored in your browser until you clear it. WebmasterID sets no cookies; it
                    stores an anonymous visitor identifier in localStorage and an anonymous
                    session identifier in sessionStorage, which your browser discards when the
                    tab closes. We do not publish a server-side retention period for analytics
                    events.
                  </td>
                </tr>
              </tbody>
            </table>

            {/* 5 */}
            <h2>5. Who We Share Your Data With</h2>
            <p>We do <strong>not</strong> sell your personal data. We may share data with:</p>
            <ul>
              <li>
                <strong>WebmasterID (website analytics)</strong> — loaded only if you have given
                explicit consent via the cookie banner. Before consent, the analytics script is
                not requested at all. It sets <strong>no cookies</strong>. When active it sends,
                for each page view, the page URL, path, page title, the referring URL, your
                browser&apos;s language and user-agent string, your browser window width, a
                timestamp, and two randomly generated anonymous identifiers (one per browser, one
                per session). Events are sent to{' '}
                <code>webmasterid-ingest-api.vercel.app</code>, which is hosted on Vercel. The
                tracker also honours browser <em>Do Not Track</em> and{' '}
                <em>Global Privacy Control</em> signals: when either is enabled it does not start
                at all, even with consent.
              </li>
              <li>
                <strong>What analytics never receives</strong> — no content from the employer
                request form (company, contact person, email, telephone, staffing requirements or
                budget), no payroll-calculator inputs or results, and no content of the email you
                prepare. These never leave your browser through analytics; the request form
                transmits nothing at all and opens your own email client instead.
              </li>
              <li>
                <strong>Netlify (hosting)</strong> — our website is hosted on Netlify. Netlify may
                process IP addresses in server logs. See{' '}
                <a href="https://www.netlify.com/privacy/" target="_blank" rel="noopener noreferrer">
                  netlify.com/privacy
                </a>.
              </li>
            </ul>
            <p>
              We may disclose personal data if required by law, court order, or competent authority.
            </p>

            {/* 6 */}
            <h2>6. International Transfers</h2>
            <p>
              Your data is processed primarily within the European Economic Area (EEA). Some
              service providers we use (our host, Netlify, and the analytics ingest endpoint,
              which runs on Vercel) operate global infrastructure, so processing outside the EEA
              cannot be excluded. Where data is transferred outside the EEA, it is protected by
              Standard Contractual Clauses (SCCs) approved by the European Commission under
              Art. 46(2)(c) GDPR.
            </p>

            {/* 7 */}
            <h2>7. Your Rights Under GDPR</h2>
            <p>You have the following rights regarding your personal data:</p>
            <ul>
              <li><strong>Right of access</strong> — request a copy of the data we hold about you (Art. 15).</li>
              <li><strong>Right to rectification</strong> — ask us to correct inaccurate data (Art. 16).</li>
              <li><strong>Right to erasure</strong> — ask us to delete your data (&ldquo;right to be forgotten&rdquo;) (Art. 17).</li>
              <li><strong>Right to restriction</strong> — ask us to restrict processing in certain circumstances (Art. 18).</li>
              <li><strong>Right to data portability</strong> — receive your data in a structured, machine-readable format (Art. 20).</li>
              <li><strong>Right to object</strong> — object to processing based on legitimate interests (Art. 21).</li>
              <li><strong>Right to withdraw consent</strong> — where processing is based on consent, you may withdraw it at any time without affecting prior processing.</li>
            </ul>
            <p>
              To exercise any of these rights, email us at{' '}
              <a href={`mailto:${OPERATOR_EMAIL}`}>{OPERATOR_EMAIL}</a> with the subject
              line <em>&ldquo;GDPR Request&rdquo;</em>. We will respond within 30 days.
            </p>

            {/* 8 */}
            <h2>8. Cookies and Browser Storage</h2>
            <p>
              This website sets <strong>no cookies at all</strong>. The preference and analytics
              storage described below uses your browser&apos;s localStorage and sessionStorage
              instead:
            </p>
            <table className="legal-table">
              <thead>
                <tr><th>Type</th><th>Name / Provider</th><th>Purpose</th><th>Basis</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td>Essential</td>
                  <td><code>cookie_consent</code> (localStorage)</td>
                  <td>Stores your cookie preference</td>
                  <td>Legitimate interest — always active</td>
                </tr>
                <tr>
                  <td>Essential</td>
                  <td><code>tnt-lang</code> (localStorage)</td>
                  <td>Remembers your language choice</td>
                  <td>Legitimate interest — always active</td>
                </tr>
                <tr>
                  <td>Analytics</td>
                  <td><code>wmid:av:v1</code> (localStorage) — WebmasterID</td>
                  <td>Anonymous visitor identifier — recognises a returning browser without identifying you</td>
                  <td>Consent — only after you click Accept</td>
                </tr>
                <tr>
                  <td>Analytics</td>
                  <td><code>wmid:as:v1</code> (sessionStorage) — WebmasterID</td>
                  <td>Anonymous session identifier — groups one visit; discarded when the tab closes</td>
                  <td>Consent — only after you click Accept</td>
                </tr>
              </tbody>
            </table>
            <p>
              <strong>How to manage your analytics preference:</strong> You can change it at any
              time by clearing your browser&apos;s localStorage (DevTools → Application → Local
              Storage → delete <code>cookie_consent</code>) and reloading the page. The banner will
              reappear. If you choose <em>Reject non-essential</em>, the analytics identifiers above
              are deleted immediately and the analytics script is never requested again.
            </p>
            <p>
              You can also control cookies through your browser settings. Note that blocking all
              cookies may affect website functionality.
            </p>

            {/* 9 */}
            <h2>9. Security</h2>
            <p>
              We implement appropriate technical and organisational measures to protect your data,
              including HTTPS encryption, access controls, and minimal data collection. Form
              submissions are transmitted over TLS and processed server-side without being stored in
              a public database.
            </p>

            {/* 10 */}
            <h2>10. Minors</h2>
            <p>
              Our services are not directed at persons under 16 years of age. We do not knowingly
              collect personal data from minors. If you believe a minor has submitted data to us,
              please contact us immediately for deletion.
            </p>

            {/* 11 */}
            <h2>11. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. The &ldquo;Last updated&rdquo;
              date at the top of this page will reflect any changes. Significant changes will be
              communicated via a notice on the website. Continued use of the site after changes
              constitutes acceptance of the updated policy.
            </p>

            {/* 12 */}
            <h2>12. Complaints</h2>
            <p>
              If you believe we have mishandled your personal data, you have the right to lodge a
              complaint with the Czech supervisory authority:
            </p>
            <address className="legal-address">
              <strong>Úřad pro ochranu osobních údajů (ÚOOÚ)</strong><br />
              Pplk. Sochora 27, 170 00 Praha 7<br />
              Web: <a href="https://www.uoou.cz" target="_blank" rel="noopener noreferrer">www.uoou.cz</a><br />
              Email: <a href="mailto:posta@uoou.cz">posta@uoou.cz</a>
            </address>
            <p>
              We encourage you to contact us first at{' '}
              <a href={`mailto:${OPERATOR_EMAIL}`}>{OPERATOR_EMAIL}</a> so we can resolve
              any issues directly.
            </p>

            {/* 13 */}
            <h2>13. Contact Us</h2>
            <p>
              For any questions about this Privacy Policy or your personal data, please contact us:
            </p>
            <address className="legal-address">
              <strong>TNT agency s.r.o.</strong><br />
              Na Spravedlnosti 1533, Zelené Předměstí, 530 02 Pardubice<br />
              Email: <a href={`mailto:${OPERATOR_EMAIL}`}>{OPERATOR_EMAIL}</a><br />
              Phone: <a href="tel:+420776858284">+420 776 858 284</a>
            </address>

          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
