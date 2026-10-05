/* ================================================================
   TNT AGENCY — script.js  |  i18n + UI
   ================================================================ */

/* ----------------------------------------------------------------
   TRANSLATIONS
   ---------------------------------------------------------------- */
const T = {
  en: {
    nav: {
      employers:   'For Employers',
      candidates:  'For Candidates',
      industries:  'Industries',
      about:       'About',
      contact:     'Contact',
      calc:        'Payroll calculator',
      calcGroup:   'Calculators',
      calcCostDe:  'Employer costs — Germany',
      calcCostCz:  'Employer costs — Czechia',
      home:        'Home',
      agencies:    'Agencies',
      offers:      'Offers',
      article:     'Guide',
      media:       'Media',
      submitAgency:'List your agency',
      postOffer:   'Post a request',
      requestWorkers: 'Request workers',
      contactCta:  'Contact us',
      language:    'Language',
      cta:         'Start Hiring',
    },
    calc: {
      eyebrow: 'Employee cost calculator',
      heading: 'Calculate the true cost of an employee',
      sub:     'See the employee’s net salary, statutory contributions and the total monthly employer cost under the rules of the Czech Republic.',
    },
    pages: {
      contactH1: 'Ready to find your next great hire?',
      contactSub: 'Tell us about your open role. We reply on business days.',
      contactHours: 'Mon–Fri: 8:00 – 17:00',
      offersEyebrow: 'Offers & opportunities',
      offersH1: 'Browse offers and find your next role',
      offersSub: 'Client requests from companies seeking staffing support, plus open positions for candidates. All reviewed manually before going live.',
      offersListTitle: 'Offers coming soon',
      offersListBody: 'Companies are posting their requirements and we review them before they appear here. Be first to get matched — post your offer today.',
      offersListBtn: 'Post your offer',
      offersPostEyebrow: 'Post your requirement',
      offersPostH2: 'Looking for a recruitment or staffing agency?',
      offersPostSub: 'Tell us what you need and qualified agencies will be able to review your offer. Free, fast, and fully moderated.',
      offersPostBtn: 'Post your offer →',
      agenciesEyebrow: 'Agency directory & services',
      agenciesH1: 'Find the right agency partner',
      agenciesSub: 'Browse verified recruitment and staffing agencies, explore our services, and discover how TalentPartnerID can fill your next role — fast.',
      agenciesListTitle: 'Agency listings coming soon',
      agenciesListBody: 'We are building this directory. Agencies are submitted by their owners and reviewed manually before appearing here. Be among the first to get listed.',
      agenciesListBtn: 'Submit your agency',
      agGetEyebrow: 'Get listed',
      agGetH2: 'Are you a recruitment or staffing agency?',
      agGetSub: 'Submit your profile and start getting discovered by companies looking for your exact services. Free, fast, and no account needed.',
      agGetBtn: 'Submit your agency →',
      submitAgEyebrow: 'Agency submission',
      submitAgH1: 'Submit your agency',
      submitAgSub: 'Get your agency in front of companies looking for recruitment and staffing services. Every submission is reviewed manually — nothing is published automatically.',
      submitOffEyebrow: 'Client offer',
      submitOffH1: 'Post your offer',
      submitOffSub: 'Tell us what you need and we will forward your request to relevant agencies. All submissions go to the site owner for manual review — nothing is published automatically.',
      cardBtn: 'Write an e-mail',
      cardEmailLabel: 'E-mail:',
      cardPhoneLabel: 'Phone:',
      contactCardTitle: 'Write to us',
      contactCardBody: 'Describe the position or request by e-mail and we will get back to you as soon as possible.',
      submitAgCardTitle: 'Agency registration',
      submitAgCardBody: 'Send us an e-mail with your agency name, website, services offered, location and a short description. We will get back to you.',
      submitOffCardTitle: 'Worker request',
      submitOffCardBody: 'Send us an e-mail with your company, the workers you need, the number, location, shift model and required start date. We will get back to you.',
      offersCtaNote: 'Are you an agency? <a href="/agencies">Browse the agency directory</a> or <a href="/submit-agency">submit your profile</a>.',
      agenciesCtaNote: 'Are you a client looking for an agency? <a href="/submit-offer">Post your offer</a> and let agencies come to you.',
    },
    hero: {
      badge:  'Employment Agency · Talent. Network. Trust.',
      h1a:    'We Connect',
      h1b:    'the Right People',
      h1c:    'with the Right',
      h1accent: 'Companies.',
      sub:    'TalentPartnerID helps employers find the right people — for operational roles in manufacturing, warehousing and logistics, and for the specialist and technical positions alongside them.',
      cta1:   'I\'m Looking for Talent',
      cta2:   'I\'m Looking for a Job',
    },
    stats: {
      s1:    'Manufacturing, warehousing, logistics',
      s1sub: 'Staffing operational occupations',
      s2:    'Specialist and technical roles',
      s2sub: 'Qualified occupations and first-line management',
      s3:    'Employing foreign nationals',
      s3sub: 'Support with permits and cards',
      s4:    'Cost estimate',
      s4sub: 'Labour-cost calculator before you enquire',
    },
    positioning: {
      eyebrow: 'What we do for employers',
      h2:      'Finding people is easy.<br>Finding the <span class="text-accent">right</span> people is not.',
      p1:      'There are usually plenty of applicants on the market. Telling which of them genuinely match the role, the requirements and the operation takes time, verification and careful selection.',
      p2:      'That is the part we take on — helping companies find candidates, verify their qualifications and connect with the people the position actually needs.',
      tag1:    'Recruitment',
      tag2:    'Temporary agency employment',
      tag3:    'Workforce solutions',
    },
    pillars: {
      a: {
        label: 'Operational roles',
        h3:    'Operators and production staff',
        p:     'Staffing manufacturing, warehousing and logistics, including shift operations, seasonal peaks and capacity increases. Direct hire or temporary agency employment, depending on whether the need is permanent or temporary.',
        cta:   'For employers: start here →',
      },
      b: {
        label: 'Specialist and technical roles',
        h3:    'Specialists and qualified professionals',
        p:     'For qualified occupations the problem is rarely the number of applicants. Suitable people are scarce, they often are not actively looking, and their competence is tied to documents and authorisations. Recruitment therefore works differently than for operational roles.',
        cta:   'Specialist recruitment →',
      },
    },
    employers: {
      eyebrow: 'For Employers',
      h2:      'Recruitment Services<br>Built Around Your Business',
      sub:     'From a single hire to building entire departments — we have a solution that fits your hiring needs and timeline.',
      cta:     'Get started →',
    },
    services: [
      {
        title: 'Direct Hire',
        desc:  'Recruitment for roles you want to fill directly onto your own payroll. We cover the steps from clarifying the brief to handing over the selected candidates.',
        list:  [
          'Clarifying the role description and candidate profile',
          'Sourcing and approaching candidates',
          'Pre-selection against the agreed requirements',
          'Interview coordination with the client',
          'Terms of engagement and any replacement arrangements are set contractually',
        ],
      },
      {
        title: 'Specialist & Technical Recruitment',
        desc:  'Filling qualified roles — technical, specialist and first-line management — where suitability is decided by qualifications, authorisations and experience rather than by the number of applicants.',
        list:  [
          'Clarifying technical requirements and required authorisations',
          'Approaching candidates who do not respond to job adverts',
          'Verifying qualifications and documents the role requires',
          'Preparing input for the client\'s technical interview',
          'Discreet handling of the assignment where agreed',
        ],
      },
      {
        title: 'Temporary Agency Employment',
        desc:  'Flexible workforce for seasonal peaks, project work, parental-leave cover, or short-term capacity needs.',
        list:  [
          'Temporary assignment under Act No. 435/2004 Coll.',
          'Comparable pay and working conditions with the user\'s own employees',
          'Payroll and HR administration handled by the agency',
          'Option to extend or move to direct employment',
          'Start dates depend on the occupation, location and required authorisations',
        ],
      },
      {
        title: 'Recruitment Process Support',
        desc:  'Help with setting up hiring on the employer\'s side — from defining the role to the induction of new starters.',
        list:  [
          'Defining the brief and the role profile',
          'Setting up the recruitment and selection process',
          'Support with induction and initial training',
          'Support with employing foreign nationals and related permits',
          'Labour-cost estimates via the public calculator',
        ],
      },
    ],
    process: {
      cta:     'Book a Free Consultation',
    },
    industries: {
      eyebrow: 'Industries',
      h2:      'We Recruit Across<br>All Key Sectors',
      sub:     'Deep specialization in each sector means faster results, better candidates, and smarter market insights for your business.',
      note:    'Don\'t see your industry? <a href="#contact">Get in touch</a> — we place candidates across many more sectors.',
      list: [
        { icon: '🏭', label: 'Manufacturing' },
        { icon: '💻', label: 'IT & Technology' },
        { icon: '💰', label: 'Finance & Banking' },
        { icon: '🏥', label: 'Healthcare & Pharma' },
        { icon: '⚙️', label: 'Engineering' },
        { icon: '🚛', label: 'Logistics & Supply Chain' },
        { icon: '🛒', label: 'Retail & E-commerce' },
        { icon: '🏗️', label: 'Construction' },
        { icon: '⚖️', label: 'Legal & Compliance' },
        { icon: '⚡', label: 'Energy & Utilities' },
        { icon: '🎓', label: 'Education & Training' },
        { icon: '🏨', label: 'Hospitality & Tourism' },
      ],
    },
    candidates: {
      eyebrow: 'For Candidates',
      h2:      'Looking for Your<br>Next Career Move?',
      sub:     'We help candidates find suitable roles. Our service is completely <strong>free</strong> for candidates.',
      benefits: [
        { title: 'Free service — no fees, ever',       desc: 'We are paid by employers. You never pay a single cent.' },
        { title: 'Confidential & discreet',            desc: 'Your CV is never shared without your explicit permission.' },
        { title: 'One CV — multiple opportunities',    desc: 'We match your profile across all our active vacancies automatically.' },
        { title: 'Career support & coaching',          desc: 'CV review, interview preparation, and honest salary advice.' },
      ],
      cta1:  'Send Your CV',
      cta2:  'Talk to a Recruiter',
      card: {
        label: 'Currently recruiting for',
        roles: [
          { color: '#f05a28', text: 'Production Manager · Manufacturing' },
          { color: '#3b82f6', text: 'Senior Software Engineer · IT' },
          { color: '#22c55e', text: 'Financial Controller · Finance' },
          { color: '#a855f7', text: 'Logistics Coordinator · Supply Chain' },
          { color: '#f0b429', text: 'HR Business Partner · HR' },
          { color: '#14b8a6', text: 'Sales Director · Retail' },
        ],
        link: 'View all positions →',
      },
    },
    why: {
      eyebrow: 'Why TalentPartnerID',
      h2:      'We Don\'t Just Fill Positions.<br>We Build Lasting Teams.',
      cards: [
        { num: '01', title: 'Focus on What Blocks the Hire', desc: 'For specialist roles the obstacle is usually qualifications, authorisations and local availability — not the number of applicants. We work the brief around what is actually holding the vacancy up.' },
        { num: '02', title: 'Terms Agreed in Advance',       desc: 'Scope, fees and any replacement arrangements are agreed in writing before the search starts. We do not promise a start date or a hiring outcome.' },
        { num: '03', title: 'Operational and Technical Roles', desc: 'Our focus is manufacturing, warehousing and logistics, together with the adjacent specialist and technical roles including first-line management. Where we have nothing to offer, we say so.' },
        { num: '04', title: 'Verifiable Information',       desc: 'Site content is based on legislation and official sources (MPSV, the Czech Labour Office, ČSSZ, ČSÚ). We publish no statistics, placement counts or references that cannot be substantiated.' },
      ],
    },
    testi: {
      eyebrow: 'Client Reviews',
      h2:      'What Our Clients Say',
      items: [],
    },
    contact: {
      eyebrow:     'Get In Touch',
      h2:          'Ready to Find<br>Your Next Great Hire?',
      sub:         'Tell us about your open role. We\'ll get back to you on business days.',
      labelPhone:  'Phone',
      labelEmail:  'Email',
      labelOffice: 'Office',
      labelHours:  'Business Hours',
      hours:       'Mon–Fri: 8:00 – 17:00',
      form: {
        h3:         'Send Us a Brief',
        name:       'Your Name *',
        namePh:     'John Smith',
        company:    'Company *',
        companyPh:  'Company Ltd.',
        email:      'Email Address *',
        emailPh:    'john@company.com',
        phone:      'Phone Number',
        phonePh:    '+420 776 858 284',
        service:    'Service Needed',
        servicePh:  'Select a service…',
        opts: [
          { v: 'permanent',  t: 'Permanent Placement' },
          { v: 'specialist', t: 'Specialist & Technical Recruitment' },
          { v: 'temp',       t: 'Temporary Staffing' },
          { v: 'support',    t: 'Recruitment process support' },
          { v: 'candidate',  t: 'I\'m a Candidate' },
          { v: 'other',      t: 'Other / Not sure yet' },
        ],
        message:    'Tell Us About the Role *',
        messagePh:  'Job title, key requirements, timeline, and any other relevant details…',
        submit:     'Send Brief →',
        note:       '100% confidential.',
        sending:    'Sending…',
        sent:       'Sent ✓',
        successMsg: 'Message sent. We reply on working days.',
        errorMsg:   'Something went wrong. Please email us directly at connect@talentpartnerid.com',
        errorFields:'Please fill in all required fields.',
        errorEmail: 'Please enter a valid email address.',
      },
    },
    footer: {
      tagline:    'Your trusted employment and staffing partner. Connecting the right people with the right companies since day one.',
      colEmployers: 'For Employers',
      colCompany:   'Company',
      colFollow:    'Follow Us',
      colServices:  'Our services',
      colNavigate:  'Navigate',
      colGuides:    'Guides',
      colContact:   'Contact',
      navAgencies:  'Agencies',
      navOffers:    'Offers',
      navCalc:      'Payroll calculator',
      navCostDe:  'Employer costs — Germany',
      navCostCz:  'Employer costs — Czechia',
      navSubmitAgency: 'List your agency',
      navPostOffer: 'Post a request',
      navContact:   'Contact',
      navTaxes:     'Social & health contributions 2026',
      navBlog:      'Blog',
      colTrust:     'Trust & transparency',
      navAbout:     'About & agency verification',
      navEditorial: 'Editorial standards & sources',
      navMedia:     'TalentPartnerID Media',
      guide1: 'Employing foreigners',
      guide2: 'Work permit in the Czech Republic',
      guide3: 'Recruiting foreign workers',
      guide4: 'Minimum wage 2026',
      guide5: 'Frequently asked questions',
      links: {
        permanent:  'Direct hire',
        specialist: 'Specialist & technical recruitment',
        temp:       'Temporary agency employment',
        employers:  'For employers: start here',
        about:      'About Us',
        industries: 'Industries',
        candidates: 'For Candidates',
        contact:    'Contact',
      },
      copy:  '© 2026 TNT agency s.r.o. All rights reserved.',
      terms: 'Terms',
      priv:  'Privacy',
      cook:  'Cookies',
    },
  },

  /* ============================================================
     CZECH
     ============================================================ */
  cs: {
    nav: {
      employers:  'Pro zaměstnavatele',
      candidates: 'Pro uchazeče',
      industries: 'Odvětví',
      about:      'O nás',
      contact:    'Kontakt',
      calc:       'Kalkulačka mezd',
      calcGroup:   'Kalkulačky',
      calcCostDe:  'Náklady zaměstnavatele — Německo',
      calcCostCz:  'Náklady zaměstnavatele — Česko',
      home:        'Úvod',
      agencies:    'Agentury',
      offers:      'Nabídky',
      article:     'Průvodce',
      media:       'Média',
      submitAgency:'Registrovat agenturu',
      postOffer:   'Zadat poptávku',
      requestWorkers: 'Poptat pracovníky',
      contactCta:  'Kontaktujte nás',
      language:    'Jazyk',
      cta:        'Hledám pracovníky',
    },
    calc: {
      eyebrow: 'Kalkulačka nákladů zaměstnance',
      heading: 'Spočítejte skutečné náklady na zaměstnance',
      sub:     'Zjistěte čistou mzdu zaměstnance, zákonné odvody a celkové měsíční náklady zaměstnavatele podle pravidel platných v České republice.',
    },
    pages: {
      contactH1: 'Chcete najít skvělého zaměstnance?',
      contactSub: 'Napište nám o vaší volné pozici. Na zprávy odpovídáme v pracovní dny.',
      contactHours: 'Po–Pá: 8:00 – 17:00',
      offersEyebrow: 'Nabídky a příležitosti',
      offersH1: 'Procházejte nabídky a najděte novou roli',
      offersSub: 'Poptávky firem hledajících personální podporu i otevřené pozice pro uchazeče. Vše ručně kontrolujeme před zveřejněním.',
      offersListTitle: 'Nabídky již brzy',
      offersListBody: 'Firmy vkládají své poptávky a my je před zveřejněním kontrolujeme. Buďte první, koho spojíme – zadejte svou poptávku ještě dnes.',
      offersListBtn: 'Zadat poptávku',
      offersPostEyebrow: 'Zadejte poptávku',
      offersPostH2: 'Hledáte personální nebo pracovní agenturu?',
      offersPostSub: 'Napište nám, co potřebujete, a kvalifikované agentury si vaši poptávku budou moci prohlédnout. Zdarma, rychle a plně moderované.',
      offersPostBtn: 'Zadat poptávku →',
      agenciesEyebrow: 'Katalog agentur a služby',
      agenciesH1: 'Najděte správného agenturního partnera',
      agenciesSub: 'Procházejte ověřené personální a pracovní agentury, prozkoumejte naše služby a zjistěte, jak vám TalentPartnerID rychle obsadí další pozici.',
      agenciesListTitle: 'Seznam agentur již brzy',
      agenciesListBody: 'Katalog teprve budujeme. Agentury zadávají jejich majitelé a před zveřejněním je ručně kontrolujeme. Buďte mezi prvními v seznamu.',
      agenciesListBtn: 'Registrovat agenturu',
      agGetEyebrow: 'Zviditelněte se',
      agGetH2: 'Jste personální nebo pracovní agentura?',
      agGetSub: 'Zadejte svůj profil a začněte být vidět u firem, které hledají přesně vaše služby. Zdarma, rychle a bez registrace účtu.',
      agGetBtn: 'Registrovat agenturu →',
      submitAgEyebrow: 'Registrace agentury',
      submitAgH1: 'Registrujte svou agenturu',
      submitAgSub: 'Zviditelněte svou agenturu u firem, které hledají personální a náborové služby. Každou registraci kontrolujeme ručně – nic se nezveřejňuje automaticky.',
      submitOffEyebrow: 'Poptávka klienta',
      submitOffH1: 'Zadejte poptávku',
      submitOffSub: 'Napište nám, co potřebujete, a my vaši poptávku předáme relevantním agenturám. Vše prochází ruční kontrolou provozovatele – nic se nezveřejňuje automaticky.',
      cardBtn: 'Napsat e-mail',
      cardEmailLabel: 'E-mail:',
      cardPhoneLabel: 'Telefon:',
      contactCardTitle: 'Napište nám',
      contactCardBody: 'Popište nám pozici nebo poptávku e-mailem a co nejdříve se vám ozveme.',
      submitAgCardTitle: 'Registrace agentury',
      submitAgCardBody: 'Napište nám e-mail a uveďte název agentury, web, nabízené služby, lokalitu a krátký popis. Ozveme se vám.',
      submitOffCardTitle: 'Poptávka pracovníků',
      submitOffCardBody: 'Napište nám e-mail a uveďte firmu, o jaké pracovníky máte zájem, počet, lokalitu, směnový model a požadovaný termín nástupu. Ozveme se vám.',
      offersCtaNote: 'Jste agentura? <a href="/agencies">Projděte katalog agentur</a> nebo <a href="/submit-agency">zadejte svůj profil</a>.',
      agenciesCtaNote: 'Jste klient a hledáte agenturu? <a href="/submit-offer">Zadejte poptávku</a> a nechte agentury přijít za vámi.',
    },
    hero: {
      badge:    'Personální agentura · Talent. Síť. Důvěra.',
      h1a:      'Spojujeme',
      h1b:      'správné lidi',
      h1c:      'se správnými',
      h1accent: 'firmami.',
      sub:      'TalentPartnerID pomáhá firmám najít ty správné lidi — do provozních profesí ve výrobě, skladech a logistice i na odborné a technické pozice, které na ně navazují.',
      cta1:     'Hledám pracovníky',
      cta2:     'Hledám práci',
    },
    stats: {
      s1:    'Výroba, sklady, logistika',
      s1sub: 'Obsazování provozních profesí',
      s2:    'Odborné a technické pozice',
      s2sub: 'Kvalifikované profese a provozní vedení',
      s3:    'Zaměstnávání cizinců',
      s3sub: 'Podpora u povolení a karet',
      s4:    'Odhad nákladů',
      s4sub: 'Kalkulačka ceny práce před poptávkou',
    },
    positioning: {
      eyebrow: 'Co pro firmy děláme',
      h2:      'Najít lidi je snadné.<br>Najít ty <span class="text-accent">správné</span> už ne.',
      p1:      'Uchazečů bývá na trhu dost. Rozpoznat mezi nimi ty, kdo skutečně odpovídají dané roli, požadavkům a provozu, ale znamená čas, ověřování a pečlivý výběr.',
      p2:      'Tuhle část práce bereme na sebe — pomáháme firmám kandidáty najít, ověřit jejich kvalifikaci a spojit se s lidmi, které na dané místo skutečně potřebují.',
      tag1:    'Nábor',
      tag2:    'Agenturní zaměstnávání',
      tag3:    'Personální zajištění provozu',
    },
    pillars: {
      a: {
        label: 'Provozní profese',
        h3:    'Dělníci a provozní pracovníci',
        p:     'Obsazování výroby, skladů a logistiky včetně směnného provozu, sezónních špiček a navýšení kapacity. Přímý nábor i agenturní zaměstnávání podle toho, zda jde o stálou, nebo dočasnou potřebu.',
        cta:   'Pro zaměstnavatele: rozcestník →',
      },
      b: {
        label: 'Odborné a technické pozice',
        h3:    'Odborníci a kvalifikovaní specialisté',
        p:     'U kvalifikovaných profesí nebývá problém v počtu uchazečů, ale v tom, že vhodných lidí je málo, často nehledají aktivně a jejich způsobilost je vázaná na doklady a oprávnění. Nábor proto vypadá jinak než u provozních rolí.',
        cta:   'Nábor odborných pozic →',
      },
    },
    employers: {
      eyebrow: 'Pro zaměstnavatele',
      h2:      'Personální služby<br>přizpůsobené vašemu byznysu',
      sub:     'Od jediné pozice po budování celých týmů — máme řešení, které odpovídá vašim potřebám a časovému harmonogramu.',
      cta:     'Začít →',
    },
    services: [
      {
        title: 'Přímý nábor do kmenového stavu',
        desc:  'Nábor na pozice, které chcete obsadit napřímo do vlastního stavu. Postaráme se o kroky od upřesnění zadání až po předání vybraných kandidátů.',
        list:  [
          'Upřesnění popisu pozice a profilu kandidáta',
          'Vyhledávání a oslovování kandidátů',
          'Předvýběr podle dohodnutých požadavků',
          'Koordinace pohovorů se zadavatelem',
          'Podmínky spolupráce a náhrady se sjednávají smluvně',
        ],
      },
      {
        title: 'Nábor odborných a technických pozic',
        desc:  'Obsazování kvalifikovaných profesí — technických, odborných a provozního vedení — kde o obsaditelnosti rozhoduje kvalifikace, oprávnění a praxe, ne počet uchazečů.',
        list:  [
          'Upřesnění technických požadavků a oprávnění',
          'Aktivní oslovení kandidátů, kteří sami nereagují na inzeráty',
          'Ověření kvalifikace a dokladů podle požadavků pozice',
          'Podklady pro odborný pohovor na straně zadavatele',
          'Diskrétní vedení poptávky podle dohody',
        ],
      },
      {
        title: 'Agenturní zaměstnávání',
        desc:  'Flexibilní pracovní síla pro sezónní špičky, projektové práce, zástupy za rodičovskou dovolenou nebo krátkodobé kapacitní potřeby.',
        list:  [
          'Dočasné přidělení podle zákona č. 435/2004 Sb.',
          'Srovnatelné mzdové a pracovní podmínky s kmenovými zaměstnanci',
          'Mzdová agenda a personální administrativa na straně agentury',
          'Možnost prodloužení nebo přechodu do kmenového stavu',
          'Termíny nástupu závisí na profesi, lokalitě a oprávněních',
        ],
      },
      {
        title: 'Podpora náborových procesů',
        desc:  'Pomoc s nastavením náboru na straně zaměstnavatele — od zadání pozice po adaptaci nastupujících pracovníků.',
        list:  [
          'Nastavení zadání a profilu pozice',
          'Nastavení náborového a výběrového procesu',
          'Podpora u adaptace a zapracování',
          'Podpora u zaměstnávání cizinců a souvisejících oprávnění',
          'Odhad nákladů práce přes veřejnou kalkulačku',
        ],
      },
    ],
    process: {
      cta:     'Sjednat bezplatnou konzultaci',
    },
    industries: {
      eyebrow: 'Odvětví',
      h2:      'Obsazujeme pozice<br>ve všech klíčových sektorech',
      sub:     'Hluboká specializace v každém sektoru znamená rychlejší výsledky, lepší kandidáty a chytřejší tržní přehled pro váš byznys.',
      note:    'Vaše odvětví tu není? <a href="#contact">Kontaktujte nás</a> — obsazujeme pozice v mnoha dalších sektorech.',
      list: [
        { icon: '🏭', label: 'Výroba' },
        { icon: '💻', label: 'IT a technologie' },
        { icon: '💰', label: 'Finance a bankovnictví' },
        { icon: '🏥', label: 'Zdravotnictví a farmacie' },
        { icon: '⚙️', label: 'Strojírenství' },
        { icon: '🚛', label: 'Logistika a dodavatelský řetězec' },
        { icon: '🛒', label: 'Maloobchod a e-commerce' },
        { icon: '🏗️', label: 'Stavebnictví' },
        { icon: '⚖️', label: 'Právo a compliance' },
        { icon: '⚡', label: 'Energetika a utility' },
        { icon: '🎓', label: 'Vzdělávání a školení' },
        { icon: '🏨', label: 'Pohostinství a cestovní ruch' },
      ],
    },
    candidates: {
      eyebrow: 'Pro uchazeče',
      h2:      'Hledáte<br>novou kariérní příležitost?',
      sub:     'Pomáháme uchazečům najít vhodné pracovní uplatnění. Naše služba je pro uchazeče zcela <strong>zdarma</strong>.',
      benefits: [
        { title: 'Zdarma — žádné poplatky, nikdy',    desc: 'Platí nám zaměstnavatelé. Vy nikdy neplatíte ani korunu.' },
        { title: 'Důvěrný a diskrétní přístup',       desc: 'Váš životopis nikdy nesdílíme bez vašeho výslovného souhlasu.' },
        { title: 'Jedno CV — více příležitostí',       desc: 'Váš profil automaticky párujeme se všemi aktivními volnými místy.' },
        { title: 'Kariérní podpora a koučink',         desc: 'Revize CV, příprava na pohovor a upřímné rady ohledně mzdy.' },
      ],
      cta1:  'Poslat životopis',
      cta2:  'Promluvit s náborářem',
      card: {
        label: 'Aktuálně hledáme',
        roles: [
          { color: '#f05a28', text: 'Výrobní manažer · Výroba' },
          { color: '#3b82f6', text: 'Senior softwarový inženýr · IT' },
          { color: '#22c55e', text: 'Finanční kontrolor · Finance' },
          { color: '#a855f7', text: 'Koordinátor logistiky · Supply Chain' },
          { color: '#f0b429', text: 'HR Business Partner · HR' },
          { color: '#14b8a6', text: 'Obchodní ředitel · Maloobchod' },
        ],
        link: 'Zobrazit všechny pozice →',
      },
    },
    why: {
      eyebrow: 'Proč TalentPartnerID',
      h2:      'Neobsazujeme jen pozice.<br>Budujeme trvalé týmy.',
      cards: [
        { num: '01', title: 'Zaměření na obsaditelnost',     desc: 'U odborných pozic bývá překážkou kvalifikace, oprávnění a dostupnost v dané lokalitě, ne počet uchazečů. Zadání proto řešíme podle toho, co obsazení pozice reálně brzdí.' },
        { num: '02', title: 'Smluvní podmínky předem',       desc: 'Rozsah spolupráce, odměna a případné podmínky náhrady se sjednávají písemně před zahájením náboru. Neslibujeme termín nástupu ani výsledek náboru.' },
        { num: '03', title: 'Provozní a technické profese',  desc: 'Zaměřujeme se na výrobu, sklady a logistiku a na navazující odborné a technické role včetně provozního vedení. Kde nemáme co nabídnout, řekneme to.' },
        { num: '04', title: 'Doložitelné informace',         desc: 'Obsah webu vychází z právních předpisů a oficiálních zdrojů (MPSV, Úřad práce ČR, ČSSZ, ČSÚ). Neuvádíme statistiky, počty umístění ani reference, které nelze doložit.' },
      ],
    },
    testi: {
      eyebrow: 'Hodnocení klientů',
      h2:      'Co říkají naši klienti',
      items: [],
    },
    contact: {
      eyebrow:     'Kontaktujte nás',
      h2:          'Připraveni najít<br>vašeho ideálního kandidáta?',
      sub:         'Řekněte nám o volné pozici. Na zprávy odpovídáme v pracovní dny.',
      labelPhone:  'Telefon',
      labelEmail:  'E-mail',
      labelOffice: 'Kancelář',
      labelHours:  'Pracovní doba',
      hours:       'Po–Pá: 8:00 – 17:00',
      form: {
        h3:         'Pošlete nám zadání',
        name:       'Vaše jméno *',
        namePh:     'Jan Novák',
        company:    'Firma *',
        companyPh:  'Firma s.r.o.',
        email:      'E-mailová adresa *',
        emailPh:    'jan@firma.cz',
        phone:      'Telefonní číslo',
        phonePh:    '+420 776 858 284',
        service:    'Požadovaná služba',
        servicePh:  'Vyberte službu…',
        opts: [
          { v: 'permanent',  t: 'Přímé umístění' },
          { v: 'specialist', t: 'Nábor odborných a technických pozic' },
          { v: 'temp',       t: 'Agenturní zaměstnávání' },
          { v: 'support',    t: 'Podpora náborových procesů' },
          { v: 'candidate',  t: 'Jsem uchazeč o práci' },
          { v: 'other',      t: 'Jiné / Zatím nevím' },
        ],
        message:    'Popište pozici *',
        messagePh:  'Název pozice, klíčové požadavky, časový rámec a další relevantní informace…',
        submit:     'Odeslat zadání →',
        note:       '100% diskrétní.',
        sending:    'Odesílám…',
        sent:       'Odesláno ✓',
        successMsg: 'Zpráva odeslána. Na zprávy odpovídáme v pracovní dny.',
        errorMsg:   'Něco se pokazilo. Napište nám přímo na connect@talentpartnerid.com',
        errorFields:'Vyplňte prosím všechna povinná pole.',
        errorEmail: 'Zadejte prosím platnou e-mailovou adresu.',
      },
    },
    footer: {
      tagline:      'Váš spolehlivý partner v oblasti zaměstnávání. Spojujeme správné lidi se správnými firmami od prvního dne.',
      colEmployers: 'Pro zaměstnavatele',
      colCompany:   'Společnost',
      colFollow:    'Sledujte nás',
      colServices:  'Naše služby',
      colNavigate:  'Navigace',
      colGuides:    'Průvodci',
      colContact:   'Kontakt',
      navAgencies:  'Agentury',
      navOffers:    'Nabídky',
      navCalc:      'Kalkulačka mezd',
      navCostDe:  'Náklady zaměstnavatele — Německo',
      navCostCz:  'Náklady zaměstnavatele — Česko',
      navSubmitAgency: 'Registrovat agenturu',
      navPostOffer: 'Zadat poptávku',
      navContact:   'Kontakt',
      navTaxes:     'Sociální a zdravotní odvody 2026',
      navBlog:      'Blog',
      colTrust:     'Důvěra a transparentnost',
      navAbout:     'O nás a ověření agentury',
      navEditorial: 'Redakční zásady a zdroje',
      navMedia:     'TalentPartnerID Media',
      guide1: 'Zaměstnávání cizinců',
      guide2: 'Pracovní povolení v ČR',
      guide3: 'Nábor zahraničních pracovníků',
      guide4: 'Minimální mzda 2026',
      guide5: 'Časté dotazy',
      links: {
        permanent:  'Přímý nábor do kmenového stavu',
        specialist: 'Nábor odborných a technických pozic',
        temp:       'Agenturní zaměstnávání',
        employers:  'Pro zaměstnavatele: rozcestník',
        about:      'O nás',
        industries: 'Odvětví',
        candidates: 'Pro uchazeče',
        contact:    'Kontakt',
      },
      copy:  '© 2026 TNT agency s.r.o. Všechna práva vyhrazena.',
      terms: 'Podmínky',
      priv:  'Ochrana dat',
      cook:  'Cookies',
    },
  },

  /* ============================================================
     GERMAN
     ============================================================ */
  de: {
    nav: {
      employers:  'Für Arbeitgeber',
      candidates: 'Für Bewerber',
      industries: 'Branchen',
      about:      'Über uns',
      contact:    'Kontakt',
      calc:       'Lohnrechner',
      calcGroup:   'Rechner',
      calcCostDe:  'Arbeitgeberkosten — Deutschland',
      calcCostCz:  'Arbeitgeberkosten — Tschechien',
      home:        'Startseite',
      agencies:    'Agenturen',
      offers:      'Angebote',
      article:     'Ratgeber',
      media:       'Media',
      submitAgency:'Agentur eintragen',
      postOffer:   'Anfrage stellen',
      requestWorkers: 'Personal anfragen',
      contactCta:  'Kontakt aufnehmen',
      language:    'Sprache',
      cta:        'Mitarbeiter finden',
    },
    calc: {
      eyebrow: 'Rechner für Mitarbeiterkosten',
      heading: 'Berechnen Sie die tatsächlichen Kosten eines Mitarbeiters',
      sub:     'Sehen Sie den Nettolohn des Arbeitnehmers, die gesetzlichen Beiträge und die gesamten monatlichen Arbeitgeberkosten nach den Regeln der Tschechischen Republik.',
    },
    pages: {
      contactH1: 'Möchten Sie Ihre nächste Fachkraft finden?',
      contactSub: 'Erzählen Sie uns von Ihrer offenen Stelle. Wir antworten an Werktagen.',
      contactHours: 'Mo–Fr: 8:00 – 17:00',
      offersEyebrow: 'Angebote & Möglichkeiten',
      offersH1: 'Angebote durchsuchen und Ihre nächste Rolle finden',
      offersSub: 'Anfragen von Unternehmen, die Personalunterstützung suchen, sowie offene Stellen für Bewerber. Alles wird vor der Veröffentlichung manuell geprüft.',
      offersListTitle: 'Angebote bald verfügbar',
      offersListBody: 'Unternehmen stellen ihre Anfragen ein und wir prüfen sie, bevor sie hier erscheinen. Seien Sie der Erste – stellen Sie Ihre Anfrage noch heute ein.',
      offersListBtn: 'Anfrage stellen',
      offersPostEyebrow: 'Stellen Sie Ihre Anfrage',
      offersPostH2: 'Suchen Sie eine Personal- oder Zeitarbeitsagentur?',
      offersPostSub: 'Sagen Sie uns, was Sie brauchen, und qualifizierte Agenturen können Ihre Anfrage prüfen. Kostenlos, schnell und vollständig moderiert.',
      offersPostBtn: 'Anfrage stellen →',
      agenciesEyebrow: 'Agenturverzeichnis & Leistungen',
      agenciesH1: 'Finden Sie den richtigen Agenturpartner',
      agenciesSub: 'Durchsuchen Sie geprüfte Personal- und Zeitarbeitsagenturen, entdecken Sie unsere Leistungen und erfahren Sie, wie TalentPartnerID Ihre nächste Stelle schnell besetzt.',
      agenciesListTitle: 'Agenturliste bald verfügbar',
      agenciesListBody: 'Wir bauen dieses Verzeichnis auf. Agenturen werden von ihren Inhabern eingetragen und vor der Veröffentlichung manuell geprüft. Seien Sie unter den Ersten.',
      agenciesListBtn: 'Agentur eintragen',
      agGetEyebrow: 'Eintragen lassen',
      agGetH2: 'Sind Sie eine Personal- oder Zeitarbeitsagentur?',
      agGetSub: 'Reichen Sie Ihr Profil ein und werden Sie von Unternehmen gefunden, die genau Ihre Leistungen suchen. Kostenlos, schnell und ohne Konto.',
      agGetBtn: 'Agentur eintragen →',
      submitAgEyebrow: 'Agentureintrag',
      submitAgH1: 'Tragen Sie Ihre Agentur ein',
      submitAgSub: 'Präsentieren Sie Ihre Agentur Unternehmen, die Personal- und Vermittlungsleistungen suchen. Jeder Eintrag wird manuell geprüft – nichts wird automatisch veröffentlicht.',
      submitOffEyebrow: 'Kundenanfrage',
      submitOffH1: 'Stellen Sie Ihre Anfrage',
      submitOffSub: 'Sagen Sie uns, was Sie brauchen, und wir leiten Ihre Anfrage an passende Agenturen weiter. Alle Einsendungen werden vom Betreiber manuell geprüft – nichts wird automatisch veröffentlicht.',
      cardBtn: 'E-Mail schreiben',
      cardEmailLabel: 'E-Mail:',
      cardPhoneLabel: 'Telefon:',
      contactCardTitle: 'Schreiben Sie uns',
      contactCardBody: 'Beschreiben Sie die Position oder Anfrage per E-Mail und wir melden uns so schnell wie möglich.',
      submitAgCardTitle: 'Agentur-Registrierung',
      submitAgCardBody: 'Senden Sie uns eine E-Mail mit Agenturname, Website, angebotenen Leistungen, Standort und einer kurzen Beschreibung. Wir melden uns.',
      submitOffCardTitle: 'Personalanfrage',
      submitOffCardBody: 'Senden Sie uns eine E-Mail mit Ihrem Unternehmen, den benötigten Mitarbeitern, der Anzahl, dem Standort, dem Schichtmodell und dem gewünschten Eintrittstermin. Wir melden uns.',
      offersCtaNote: 'Sind Sie eine Agentur? <a href="/agencies">Durchsuchen Sie das Agenturverzeichnis</a> oder <a href="/submit-agency">reichen Sie Ihr Profil ein</a>.',
      agenciesCtaNote: 'Sind Sie ein Kunde auf der Suche nach einer Agentur? <a href="/submit-offer">Stellen Sie Ihre Anfrage</a> und lassen Sie Agenturen auf Sie zukommen.',
    },
    hero: {
      badge:    'Personalvermittlung · Talent. Netzwerk. Vertrauen.',
      h1a:      'Wir verbinden',
      h1b:      'die richtigen Menschen',
      h1c:      'mit den richtigen',
      h1accent: 'Unternehmen.',
      sub:      'TalentPartnerID hilft Unternehmen, die richtigen Menschen zu finden — für gewerbliche Berufe in Produktion, Lager und Logistik sowie für die angrenzenden Fach- und Technikpositionen.',
      cta1:     'Ich suche Talente',
      cta2:     'Ich suche einen Job',
    },
    stats: {
      s1:    'Produktion, Lager, Logistik',
      s1sub: 'Besetzung gewerblicher Berufe',
      s2:    'Fach- und Technikpositionen',
      s2sub: 'Qualifizierte Berufe und operative Führung',
      s3:    'Beschäftigung ausländischer Arbeitnehmer',
      s3sub: 'Unterstützung bei Genehmigungen und Karten',
      s4:    'Kostenschätzung',
      s4sub: 'Arbeitskostenrechner vor der Anfrage',
    },
    positioning: {
      eyebrow: 'Was wir für Unternehmen tun',
      h2:      'Menschen zu finden ist einfach.<br>Die <span class="text-accent">richtigen</span> zu finden nicht.',
      p1:      'Bewerber gibt es auf dem Markt meist genug. Zu erkennen, wer davon wirklich zur Stelle, zu den Anforderungen und zum Betrieb passt, erfordert Zeit, Prüfung und sorgfältige Auswahl.',
      p2:      'Diesen Teil der Arbeit übernehmen wir — wir helfen Unternehmen, Kandidaten zu finden, ihre Qualifikation zu prüfen und mit den Menschen zusammenzukommen, die die Stelle tatsächlich braucht.',
      tag1:    'Rekrutierung',
      tag2:    'Zeitarbeit',
      tag3:    'Personallösungen für den Betrieb',
    },
    pillars: {
      a: {
        label: 'Gewerbliche Berufe',
        h3:    'Produktions- und Betriebsmitarbeiter',
        p:     'Besetzung in Produktion, Lager und Logistik einschließlich Schichtbetrieb, Saisonspitzen und Kapazitätsaufbau. Direktvermittlung oder Zeitarbeit, je nachdem, ob der Bedarf dauerhaft oder befristet ist.',
        cta:   'Für Arbeitgeber: Übersicht →',
      },
      b: {
        label: 'Fach- und Technikpositionen',
        h3:    'Fachkräfte und qualifizierte Spezialisten',
        p:     'Bei qualifizierten Berufen liegt das Problem selten in der Zahl der Bewerber. Geeignete Personen sind rar, suchen oft nicht aktiv, und ihre Befähigung ist an Nachweise und Berechtigungen gebunden. Die Rekrutierung verläuft daher anders als bei gewerblichen Rollen.',
        cta:   'Fach- und Technikpositionen →',
      },
    },
    employers: {
      eyebrow: 'Für Arbeitgeber',
      h2:      'Rekrutierungsdienstleistungen<br>maßgeschneidert für Ihr Unternehmen',
      sub:     'Von einer einzelnen Stelle bis zum Aufbau ganzer Abteilungen — wir haben eine Lösung, die Ihren Personalbedarf und Zeitplan erfüllt.',
      cta:     'Jetzt starten →',
    },
    services: [
      {
        title: 'Direktvermittlung',
        desc:  'Rekrutierung für Stellen, die Sie direkt in Ihre eigene Belegschaft besetzen wollen. Wir übernehmen die Schritte von der Präzisierung des Briefings bis zur Übergabe der ausgewählten Kandidaten.',
        list:  [
          'Präzisierung von Stellenbeschreibung und Kandidatenprofil',
          'Suche und Ansprache von Kandidaten',
          'Vorauswahl nach den vereinbarten Anforderungen',
          'Koordination von Interviews mit dem Auftraggeber',
          'Konditionen und etwaige Ersatzregelungen werden vertraglich vereinbart',
        ],
      },
      {
        title: 'Fach- und Technikpositionen',
        desc:  'Besetzung qualifizierter Positionen — technisch, fachlich und in der operativen Führung — bei denen Qualifikation, Befähigungsnachweise und Praxis über die Besetzbarkeit entscheiden, nicht die Zahl der Bewerber.',
        list:  [
          'Präzisierung technischer Anforderungen und erforderlicher Befähigungen',
          'Ansprache von Kandidaten, die auf Stellenanzeigen nicht reagieren',
          'Prüfung von Qualifikationen und Nachweisen, die die Stelle verlangt',
          'Vorbereitung der Grundlagen für das Fachinterview beim Auftraggeber',
          'Diskrete Abwicklung der Anfrage nach Vereinbarung',
        ],
      },
      {
        title: 'Zeitarbeit',
        desc:  'Flexible Arbeitskräfte für Saisongipfel, Projektarbeiten, Elternzeitvertretungen oder kurzfristigen Kapazitätsbedarf.',
        list:  [
          'Überlassung nach dem Gesetz Nr. 435/2004 Slg.',
          'Vergleichbare Lohn- und Arbeitsbedingungen wie bei Stammbeschäftigten',
          'Lohnbuchhaltung und Personalverwaltung auf Seiten der Agentur',
          'Möglichkeit der Verlängerung oder Übernahme in die Stammbelegschaft',
          'Eintrittstermine hängen von Beruf, Standort und Befähigungsnachweisen ab',
        ],
      },
      {
        title: 'Unterstützung im Rekrutierungsprozess',
        desc:  'Unterstützung beim Aufsetzen der Personalgewinnung auf Arbeitgeberseite — von der Definition der Stelle bis zur Einarbeitung neuer Mitarbeiter.',
        list:  [
          'Definition von Briefing und Stellenprofil',
          'Aufsetzen des Rekrutierungs- und Auswahlprozesses',
          'Unterstützung bei Einarbeitung und Anlernphase',
          'Unterstützung bei der Beschäftigung ausländischer Arbeitnehmer und zugehöriger Genehmigungen',
          'Schätzung der Arbeitskosten über den öffentlichen Rechner',
        ],
      },
    ],
    process: {
      cta:     'Kostenloses Beratungsgespräch buchen',
    },
    industries: {
      eyebrow: 'Branchen',
      h2:      'Wir rekrutieren in<br>allen Schlüsselsektoren',
      sub:     'Tiefe Spezialisierung in jedem Sektor bedeutet schnellere Ergebnisse, bessere Kandidaten und klügere Markteinblicke für Ihr Unternehmen.',
      note:    'Ihre Branche nicht dabei? <a href="#contact">Kontaktieren Sie uns</a> — wir vermitteln Kandidaten in vielen weiteren Sektoren.',
      list: [
        { icon: '🏭', label: 'Produktion' },
        { icon: '💻', label: 'IT & Technologie' },
        { icon: '💰', label: 'Finanzen & Banken' },
        { icon: '🏥', label: 'Gesundheit & Pharma' },
        { icon: '⚙️', label: 'Ingenieurwesen' },
        { icon: '🚛', label: 'Logistik & Lieferkette' },
        { icon: '🛒', label: 'Einzelhandel & E-Commerce' },
        { icon: '🏗️', label: 'Bauwesen' },
        { icon: '⚖️', label: 'Recht & Compliance' },
        { icon: '⚡', label: 'Energie & Versorgung' },
        { icon: '🎓', label: 'Bildung & Weiterbildung' },
        { icon: '🏨', label: 'Gastronomie & Tourismus' },
      ],
    },
    candidates: {
      eyebrow: 'Für Bewerber',
      h2:      'Auf der Suche nach Ihrer<br>nächsten Karrierechance?',
      sub:     'Wir helfen Bewerbern, passende Stellen zu finden. Unser Service ist für Bewerber vollständig <strong>kostenlos</strong>.',
      benefits: [
        { title: 'Kostenlos — keine Gebühren, nie',     desc: 'Wir werden von Arbeitgebern bezahlt. Sie zahlen keinen einzigen Cent.' },
        { title: 'Vertraulich & diskret',               desc: 'Ihr Lebenslauf wird niemals ohne Ihre ausdrückliche Genehmigung weitergegeben.' },
        { title: 'Ein Lebenslauf — viele Chancen',      desc: 'Wir gleichen Ihr Profil automatisch mit allen aktiven Stellenangeboten ab.' },
        { title: 'Karriereunterstützung & Coaching',    desc: 'Lebenslauf-Überprüfung, Interviewvorbereitung und ehrliche Gehaltsberatung.' },
      ],
      cta1:  'Lebenslauf einsenden',
      cta2:  'Mit einem Recruiter sprechen',
      card: {
        label: 'Aktuell gesucht',
        roles: [
          { color: '#f05a28', text: 'Produktionsleiter · Produktion' },
          { color: '#3b82f6', text: 'Senior Software Engineer · IT' },
          { color: '#22c55e', text: 'Financial Controller · Finanzen' },
          { color: '#a855f7', text: 'Logistikkoordinator · Supply Chain' },
          { color: '#f0b429', text: 'HR Business Partner · HR' },
          { color: '#14b8a6', text: 'Vertriebsleiter · Einzelhandel' },
        ],
        link: 'Alle Stellen anzeigen →',
      },
    },
    why: {
      eyebrow: 'Warum TalentPartnerID',
      h2:      'Wir besetzen nicht nur Stellen.<br>Wir bauen dauerhafte Teams.',
      cards: [
        { num: '01', title: 'Fokus auf die tatsächliche Hürde', desc: 'Bei Fachpositionen sind Qualifikation, Befähigungsnachweise und regionale Verfügbarkeit die Hürde — nicht die Zahl der Bewerber. Wir richten das Briefing danach aus, was die Besetzung wirklich aufhält.' },
        { num: '02', title: 'Konditionen vorab vereinbart',     desc: 'Umfang, Honorar und etwaige Ersatzregelungen werden vor Beginn der Suche schriftlich vereinbart. Wir sagen weder einen Eintrittstermin noch ein Besetzungsergebnis zu.' },
        { num: '03', title: 'Gewerbliche und technische Berufe', desc: 'Unser Schwerpunkt sind Produktion, Lager und Logistik sowie die angrenzenden Fach- und Technikpositionen einschließlich der operativen Führung. Wo wir nichts anzubieten haben, sagen wir es.' },
        { num: '04', title: 'Belegbare Angaben',                desc: 'Die Inhalte dieser Website stützen sich auf Rechtsvorschriften und amtliche Quellen (MPSV, Arbeitsamt ČR, ČSSZ, ČSÚ). Wir veröffentlichen keine Statistiken, Vermittlungszahlen oder Referenzen, die sich nicht belegen lassen.' },
      ],
    },
    testi: {
      eyebrow: 'Kundenbewertungen',
      h2:      'Was unsere Kunden sagen',
      items: [],
    },
    contact: {
      eyebrow:     'Kontakt aufnehmen',
      h2:          'Bereit, Ihren nächsten<br>Top-Mitarbeiter zu finden?',
      sub:         'Erzählen Sie uns von Ihrer offenen Stelle. Wir antworten an Werktagen.',
      labelPhone:  'Telefon',
      labelEmail:  'E-Mail',
      labelOffice: 'Büro',
      labelHours:  'Öffnungszeiten',
      hours:       'Mo–Fr: 8:00 – 17:00 Uhr',
      form: {
        h3:         'Briefing senden',
        name:       'Ihr Name *',
        namePh:     'Max Mustermann',
        company:    'Unternehmen *',
        companyPh:  'Muster GmbH',
        email:      'E-Mail-Adresse *',
        emailPh:    'max@unternehmen.de',
        phone:      'Telefonnummer',
        phonePh:    '+49 123 456 789',
        service:    'Gewünschter Service',
        servicePh:  'Service auswählen…',
        opts: [
          { v: 'permanent',  t: 'Direktvermittlung' },
          { v: 'specialist', t: 'Fach- und Technikpositionen' },
          { v: 'temp',       t: 'Zeitarbeit' },
          { v: 'support',    t: 'Unterstützung im Rekrutierungsprozess' },
          { v: 'candidate',  t: 'Ich bin Bewerber' },
          { v: 'other',      t: 'Sonstiges / Noch unsicher' },
        ],
        message:    'Beschreiben Sie die Stelle *',
        messagePh:  'Jobtitel, Anforderungen, Zeitplan und weitere relevante Details…',
        submit:     'Briefing senden →',
        note:       '100% vertraulich.',
        sending:    'Wird gesendet…',
        sent:       'Gesendet ✓',
        successMsg: 'Nachricht gesendet. Wir antworten an Werktagen.',
        errorMsg:   'Etwas ist schiefgelaufen. Schreiben Sie uns direkt an connect@talentpartnerid.com',
        errorFields:'Bitte füllen Sie alle Pflichtfelder aus.',
        errorEmail: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.',
      },
    },
    footer: {
      tagline:      'Ihr zuverlässiger Partner für Personalvermittlung. Wir verbinden die richtigen Menschen mit den richtigen Unternehmen seit dem ersten Tag.',
      colEmployers: 'Für Arbeitgeber',
      colCompany:   'Unternehmen',
      colFollow:    'Folgen Sie uns',
      colServices:  'Unsere Leistungen',
      colNavigate:  'Navigation',
      colGuides:    'Ratgeber',
      colContact:   'Kontakt',
      navAgencies:  'Agenturen',
      navOffers:    'Angebote',
      navCalc:      'Lohnrechner',
      navCostDe:  'Arbeitgeberkosten — Deutschland',
      navCostCz:  'Arbeitgeberkosten — Tschechien',
      navSubmitAgency: 'Agentur eintragen',
      navPostOffer: 'Anfrage stellen',
      navContact:   'Kontakt',
      navTaxes:     'Sozial- und Krankenversicherung 2026',
      navBlog:      'Blog',
      colTrust:     'Vertrauen & Transparenz',
      navAbout:     'Über uns & Agenturprüfung',
      navEditorial: 'Redaktionsrichtlinien & Quellen',
      navMedia:     'TalentPartnerID Media',
      guide1: 'Ausländer beschäftigen',
      guide2: 'Arbeitserlaubnis in Tschechien',
      guide3: 'Rekrutierung ausländischer Arbeitskräfte',
      guide4: 'Mindestlohn 2026',
      guide5: 'Häufige Fragen',
      links: {
        permanent:  'Direktvermittlung',
        specialist: 'Fach- und Technikpositionen',
        temp:       'Zeitarbeit',
        employers:  'Für Arbeitgeber: Übersicht',
        about:      'Über uns',
        industries: 'Branchen',
        candidates: 'Für Bewerber',
        contact:    'Kontakt',
      },
      copy:  '© 2026 TNT agency s.r.o. Alle Rechte vorbehalten.',
      terms: 'AGB',
      priv:  'Datenschutz',
      cook:  'Cookies',
    },
  },
};

/* ----------------------------------------------------------------
   ICONS (shared SVGs, used in render functions)
   ---------------------------------------------------------------- */
const SVG = {
  permanentPlacement: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  executiveSearch:    `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
  tempStaffing:       `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  hrRpo:              `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
  brief:              `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  search:             `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  hire:               `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  speed:              `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  guarantee:          `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  knowledge:          `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
  transparent:        `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>`,
};

const svcIcons     = [SVG.permanentPlacement, SVG.executiveSearch, SVG.tempStaffing, SVG.hrRpo];
const processIcons = [SVG.brief, SVG.search, SVG.hire];
const whyIcons     = [SVG.speed, SVG.guarantee, SVG.knowledge, SVG.transparent];
const delays       = ['d1','d2','d3','d4'];

/* ----------------------------------------------------------------
   RENDER FUNCTIONS
   ---------------------------------------------------------------- */
function renderAll(lang) {
  const t = T[lang];
  if (!t) return;

  /* — Nav — */
  qs('[data-i18n="nav.employers"]',  t.nav.employers);
  qs('[data-i18n="nav.candidates"]', t.nav.candidates);
  qs('[data-i18n="nav.industries"]', t.nav.industries);
  qs('[data-i18n="nav.about"]',      t.nav.about);
  qs('[data-i18n="nav.contact"]',    t.nav.contact);
  qs('[data-i18n="nav.calc"]',       t.nav.calc);
  qs('[data-i18n="nav.home"]',        t.nav.home);
  qs('[data-i18n="nav.agencies"]',    t.nav.agencies);
  qs('[data-i18n="nav.offers"]',      t.nav.offers);
  qs('[data-i18n="nav.article"]',     t.nav.article);
  qs('[data-i18n="nav.submitAgency"]', t.nav.submitAgency);
  qs('[data-i18n="nav.postOffer"]',   t.nav.postOffer);
  qsa('[data-i18n="nav.contactCta"]', el => el.textContent = t.nav.contactCta);
  qsa('[data-i18n="nav.requestWorkers"]', el => el.textContent = t.nav.requestWorkers);
  qs('[data-i18n="nav.language"]',    t.nav.language);
  qsa('[data-i18n="nav.cta"]', el => el.textContent = t.nav.cta);

  /* mobile nav mirror */
  qs('[data-i18n="mnav.employers"]',  t.nav.employers);
  qs('[data-i18n="mnav.candidates"]', t.nav.candidates);
  qs('[data-i18n="mnav.industries"]', t.nav.industries);
  qs('[data-i18n="mnav.about"]',      t.nav.about);
  qs('[data-i18n="mnav.contact"]',    t.nav.contact);
  qs('[data-i18n="mnav.calc"]',       t.nav.calc);
  qs('[data-i18n="mnav.home"]',        t.nav.home);
  qs('[data-i18n="mnav.agencies"]',    t.nav.agencies);
  qs('[data-i18n="mnav.offers"]',      t.nav.offers);
  qs('[data-i18n="mnav.article"]',     t.nav.article);
  qs('[data-i18n="mnav.submitAgency"]', t.nav.submitAgency);
  qs('[data-i18n="mnav.postOffer"]',   t.nav.postOffer);
  qsa('[data-i18n="mnav.contactCta"]', el => el.textContent = t.nav.contactCta);
  qsa('[data-i18n="mnav.requestWorkers"]', el => el.textContent = t.nav.requestWorkers);
  qs('[data-i18n="mnav.cta"]',        t.nav.cta);

  /* — Homepage calculator section head — */
  qs('[data-i18n="calc.eyebrow"]', t.calc.eyebrow);
  qs('[data-i18n="calc.heading"]', t.calc.heading);
  qs('[data-i18n="calc.sub"]',     t.calc.sub);

  /* — Transactional pages (only the relevant page's elements exist per route) — */
  Object.keys(t.pages).forEach((k) => {
    const v = t.pages[k];
    if (v.indexOf('<') !== -1) qsHTML(`[data-i18n="pages.${k}"]`, v); // cross-link notes carry markup
    else qsa(`[data-i18n="pages.${k}"]`, (el) => { el.textContent = v; });
  });

  /* — Hero — */
  qs('[data-i18n="hero.badge"]',    t.hero.badge);
  qs('[data-i18n="hero.h1a"]',      t.hero.h1a);
  qs('[data-i18n="hero.h1b"]',      t.hero.h1b);
  qs('[data-i18n="hero.h1c"]',      t.hero.h1c);
  qs('[data-i18n="hero.h1accent"]', t.hero.h1accent);
  qs('[data-i18n="hero.sub"]',      t.hero.sub);
  qs('[data-i18n="hero.cta1"]',     t.hero.cta1);
  qs('[data-i18n="hero.cta2"]',     t.hero.cta2);

  /* — Stats — */
  qs('[data-i18n="stats.s1"]', t.stats.s1);
  qs('[data-i18n="stats.s2"]', t.stats.s2);
  qs('[data-i18n="stats.s3"]', t.stats.s3);
  qs('[data-i18n="stats.s4"]', t.stats.s4);
  qs('[data-i18n="stats.s1sub"]', t.stats.s1sub);
  qs('[data-i18n="stats.s2sub"]', t.stats.s2sub);
  qs('[data-i18n="stats.s3sub"]', t.stats.s3sub);
  qs('[data-i18n="stats.s4sub"]', t.stats.s4sub);

  /* — Positioning + the two recruitment pillars (homepage) — */
  if (t.positioning) {
    qs('[data-i18n="positioning.eyebrow"]', t.positioning.eyebrow);
    qsHTML('[data-i18n="positioning.h2"]',  t.positioning.h2);
    qs('[data-i18n="positioning.p1"]',      t.positioning.p1);
    qs('[data-i18n="positioning.p2"]',      t.positioning.p2);
    qs('[data-i18n="positioning.tag1"]',    t.positioning.tag1);
    qs('[data-i18n="positioning.tag2"]',    t.positioning.tag2);
    qs('[data-i18n="positioning.tag3"]',    t.positioning.tag3);
  }
  if (t.pillars) {
    qs('[data-i18n="pillars.a.label"]', t.pillars.a.label);
    qs('[data-i18n="pillars.a.h3"]',    t.pillars.a.h3);
    qs('[data-i18n="pillars.a.p"]',     t.pillars.a.p);
    qs('[data-i18n="pillars.a.cta"]',   t.pillars.a.cta);
    qs('[data-i18n="pillars.b.label"]', t.pillars.b.label);
    qs('[data-i18n="pillars.b.h3"]',    t.pillars.b.h3);
    qs('[data-i18n="pillars.b.p"]',     t.pillars.b.p);
    qs('[data-i18n="pillars.b.cta"]',   t.pillars.b.cta);
  }

  /* — Employers section head — */
  qs('[data-i18n="employers.eyebrow"]',     t.employers.eyebrow);
  qsHTML('[data-i18n="employers.h2"]',      t.employers.h2);
  qs('[data-i18n="employers.sub"]',         t.employers.sub);

  /* — Services grid — */
  const sg = document.getElementById('svcGrid');
  if (sg) {
    sg.innerHTML = t.services.map((s, i) => `
      <article class="svc-card fi ${delays[i]}">
        <div class="svc-card__top">
          <div class="svc-card__icon" aria-hidden="true">${svcIcons[i]}</div>
          <h3>${s.title}</h3>
        </div>
        <p>${s.desc}</p>
        <ul class="svc-list">${s.list.map(li => `<li>${li}</li>`).join('')}</ul>
        <a href="#contact" class="svc-link">${t.employers.cta}</a>
      </article>`).join('');
    sg.querySelectorAll('.fi').forEach(el => io.observe(el));
  }

  /* — Process — */
  qs('[data-i18n="process.cta"]',    t.process.cta);

  // Process steps are server-rendered by components/RecruitmentProcess.tsx
  // from lib/content/recruitment-process.ts — one source of truth, visible to
  // crawlers. The old client-side injector was removed with its #processSteps
  // host; the process.steps dictionary entries went with it.

  /* — Industries — */
  qs('[data-i18n="industries.eyebrow"]',    t.industries.eyebrow);
  qsHTML('[data-i18n="industries.h2"]',     t.industries.h2);
  qs('[data-i18n="industries.sub"]',        t.industries.sub);
  qsHTML('[data-i18n="industries.note"]',   t.industries.note);

  const ig = document.getElementById('industriesGrid');
  if (ig) {
    ig.innerHTML = t.industries.list.map((ind, i) => `
      <div class="ind-card fi ${delays[i % 3]}">
        <div class="ind-card__icon" aria-hidden="true">${ind.icon}</div>
        <span>${ind.label}</span>
      </div>`).join('');
    ig.querySelectorAll('.fi').forEach(el => io.observe(el));
  }

  /* — Candidates — */
  qs('[data-i18n="candidates.eyebrow"]',     t.candidates.eyebrow);
  qsHTML('[data-i18n="candidates.h2"]',      t.candidates.h2);
  qsHTML('[data-i18n="candidates.sub"]',     t.candidates.sub);
  qs('[data-i18n="candidates.cta1"]',        t.candidates.cta1);
  qs('[data-i18n="candidates.cta2"]',        t.candidates.cta2);

  const cb = document.getElementById('candBenefits');
  if (cb) {
    cb.innerHTML = t.candidates.benefits.map(b => `
      <div class="cand-benefit">
        <div class="cand-benefit__icon" aria-hidden="true">✓</div>
        <div><strong>${b.title}</strong><p>${b.desc}</p></div>
      </div>`).join('');
  }

  qs('[data-i18n="candidates.card.label"]', t.candidates.card.label);
  const cr = document.getElementById('candRoles');
  if (cr) {
    cr.innerHTML = t.candidates.card.roles.map(r => `
      <div class="cand-role">
        <span class="cand-role__dot" style="background:${r.color};"></span>
        ${r.text}
      </div>`).join('');
  }
  qs('[data-i18n="candidates.card.link"]', t.candidates.card.link);
  const cvLink = document.querySelector('[data-i18n-href="candidates.cta1"]');
  if (cvLink) cvLink.textContent = t.candidates.cta1;

  /* — Why — */
  qs('[data-i18n="why.eyebrow"]', t.why.eyebrow);
  qsHTML('[data-i18n="why.h2"]',  t.why.h2);

  const wg = document.getElementById('whyGrid');
  if (wg) {
    wg.innerHTML = t.why.cards.map((c, i) => `
      <div class="why-card fi ${delays[i]}">
        <div class="why-card__num" aria-hidden="true">${c.num}</div>
        <div class="why-card__icon" aria-hidden="true">${whyIcons[i]}</div>
        <h3>${c.title}</h3>
        <p>${c.desc}</p>
      </div>`).join('');
    wg.querySelectorAll('.fi').forEach(el => io.observe(el));
  }

  /* — Testimonials —
     Deliberately not rendered. The previous implementation hard-coded a
     five-star rating (★★★★★) and placeholder author names ("[Jméno klienta]")
     for every entry, so any page that gained an #testiGrid element would have
     published fabricated reviews. No verified client testimonial exists, and
     the site's editorial rules forbid invented reviews, ratings and client
     references. The heading strings stay translated for reuse if real,
     attributable references are ever collected; the items arrays are empty. */

  /* — Contact — */
  qs('[data-i18n="contact.eyebrow"]',     t.contact.eyebrow);
  qsHTML('[data-i18n="contact.h2"]',      t.contact.h2);
  qs('[data-i18n="contact.sub"]',         t.contact.sub);
  qs('[data-i18n="contact.labelPhone"]',  t.contact.labelPhone);
  qs('[data-i18n="contact.labelEmail"]',  t.contact.labelEmail);
  qs('[data-i18n="contact.labelOffice"]', t.contact.labelOffice);
  qs('[data-i18n="contact.labelHours"]',  t.contact.labelHours);
  qs('[data-i18n="contact.hours"]',       t.contact.hours);

  const f = t.contact.form;
  qs('[data-i18n="form.h3"]',         f.h3);
  qs('[data-i18n="form.name"]',       f.name);
  qs('[data-i18n="form.company"]',    f.company);
  qs('[data-i18n="form.email"]',      f.email);
  qs('[data-i18n="form.phone"]',      f.phone);
  qs('[data-i18n="form.service"]',    f.service);
  qs('[data-i18n="form.message"]',    f.message);
  qs('[data-i18n="form.submit"]',     f.submit);
  qs('[data-i18n="form.note"]',       f.note);

  /* placeholders */
  qsPh('[data-i18n-ph="form.namePh"]',     f.namePh);
  qsPh('[data-i18n-ph="form.companyPh"]',  f.companyPh);
  qsPh('[data-i18n-ph="form.emailPh"]',    f.emailPh);
  qsPh('[data-i18n-ph="form.phonePh"]',    f.phonePh);
  qsPh('[data-i18n-ph="form.messagePh"]',  f.messagePh);

  /* select options */
  const sel = document.getElementById('fservice');
  if (sel) {
    const cur = sel.value;
    sel.innerHTML = `<option value="" disabled>${f.servicePh}</option>` +
      f.opts.map(o => `<option value="${o.v}"${o.v === cur ? ' selected' : ''}>${o.t}</option>`).join('');
    if (!cur) sel.selectedIndex = 0;
  }

  /* — Footer — */
  qs('[data-i18n="footer.tagline"]',      t.footer.tagline);
  qs('[data-i18n="footer.colServices"]',  t.footer.colServices);
  qs('[data-i18n="footer.colNavigate"]',  t.footer.colNavigate);
  qs('[data-i18n="footer.colGuides"]',    t.footer.colGuides);
  qs('[data-i18n="footer.colContact"]',   t.footer.colContact);
  qs('[data-i18n="footer.links.permanent"]', t.footer.links.permanent);
  qs('[data-i18n="footer.links.specialist"]', t.footer.links.specialist);
  qs('[data-i18n="footer.links.temp"]',   t.footer.links.temp);
  qs('[data-i18n="footer.links.employers"]', t.footer.links.employers);
  qs('[data-i18n="footer.navAgencies"]',  t.footer.navAgencies);
  qs('[data-i18n="footer.navOffers"]',    t.footer.navOffers);
  qs('[data-i18n="footer.navCalc"]',      t.footer.navCalc);
  qs('[data-i18n="footer.navSubmitAgency"]', t.footer.navSubmitAgency);
  qs('[data-i18n="footer.navPostOffer"]', t.footer.navPostOffer);
  qs('[data-i18n="footer.navContact"]',   t.footer.navContact);
  qs('[data-i18n="footer.navTaxes"]',     t.footer.navTaxes);
  qs('[data-i18n="footer.navBlog"]',      t.footer.navBlog);
  qs('[data-i18n="footer.colTrust"]',     t.footer.colTrust);
  qs('[data-i18n="footer.navAbout"]',     t.footer.navAbout);
  qs('[data-i18n="footer.navEditorial"]', t.footer.navEditorial);
  qs('[data-i18n="footer.guide1"]',       t.footer.guide1);
  qs('[data-i18n="footer.guide2"]',       t.footer.guide2);
  qs('[data-i18n="footer.guide3"]',       t.footer.guide3);
  qs('[data-i18n="footer.guide4"]',       t.footer.guide4);
  qs('[data-i18n="footer.guide5"]',       t.footer.guide5);
  qs('[data-i18n="footer.copy"]',         t.footer.copy);
  qs('[data-i18n="footer.terms"]',        t.footer.terms);
  qs('[data-i18n="footer.priv"]',         t.footer.priv);
  qs('[data-i18n="footer.cook"]',         t.footer.cook);

  /* — Active lang buttons — */
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  /* — html lang attr — */
  document.documentElement.lang = lang;

  /* store current form translations for validation */
  window._formT = f;
}

/* helpers */
function qs(sel, text) {
  const el = document.querySelector(sel);
  if (el && text !== undefined) el.textContent = text;
}
function qsHTML(sel, html) {
  const el = document.querySelector(sel);
  if (el && html !== undefined) el.innerHTML = html;
}
function qsa(sel, fn) {
  document.querySelectorAll(sel).forEach(fn);
}
function qsPh(sel, ph) {
  const el = document.querySelector(sel);
  if (el && ph !== undefined) el.placeholder = ph;
}

/* ----------------------------------------------------------------
   LANGUAGE SWITCHER
   ---------------------------------------------------------------- */
function setLang(lang, options) {
  if (!T[lang]) lang = 'en';
  // Do not persist on a locale-locked page: arriving at /en/… is a consequence
  // of the URL, not a language choice the visitor made, and recording it would
  // silently rewrite their preference for every Czech page afterwards.
  if (!options || options.persist !== false) localStorage.setItem('tnt-lang', lang);
  renderAll(lang);
  // Notify React islands (e.g. the payroll calculator) that own their own
  // content and cannot be updated by the [data-i18n] DOM swap.
  window.dispatchEvent(new CustomEvent('tnt-lang', { detail: lang }));
}

document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => setLang(btn.dataset.lang));
});

/* ----------------------------------------------------------------
   INTERSECTION OBSERVER — Scroll fade-in
   ---------------------------------------------------------------- */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('vis');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.fi').forEach(el => io.observe(el));

/* ----------------------------------------------------------------
   STICKY HEADER
   ---------------------------------------------------------------- */
const header = document.querySelector('.header');
if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

/* ----------------------------------------------------------------
   HAMBURGER / MOBILE NAV
   ---------------------------------------------------------------- */
const burger    = document.getElementById('burger');
const mobileNav = document.getElementById('mobileNav');

if (burger && mobileNav) {
  burger.addEventListener('click', () => {
    const isOpen = burger.classList.toggle('open');
    mobileNav.classList.toggle('open', isOpen);
    burger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      burger.classList.remove('open');
      mobileNav.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && burger.classList.contains('open')) {
      burger.classList.remove('open');
      mobileNav.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
}

/* ----------------------------------------------------------------
   SMOOTH SCROLL
   ---------------------------------------------------------------- */
document.addEventListener('click', e => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;
  const id = link.getAttribute('href').slice(1);
  const target = document.getElementById(id);
  if (target) {
    e.preventDefault();
    const headerH = header ? header.offsetHeight : 80;
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - headerH - 16, behavior: 'smooth' });
  }
});

/* ----------------------------------------------------------------
   ACTIVE NAV LINK
   ---------------------------------------------------------------- */
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav a, .mobile-nav a');

const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(sec => navObserver.observe(sec));

/* ----------------------------------------------------------------
   INIT — detect stored language preference
   Czech is the primary market: the server renders Czech by default, so a clean
   browser (no stored preference) stays Czech with no flash. A previously chosen
   EN/DE preference is still honoured after hydration.
   ---------------------------------------------------------------- */
// Locale-locked pages take their language from the URL, not from storage.
//
// The server renders /en/… and /de/… with the correct lang and chrome. Reading
// localStorage here unconditionally would replace that with the visitor's last
// switcher choice (or Czech, for a first-time visitor) the moment this script
// ran — server-rendered English chrome flipping to Czech on a page whose URL
// says English. On ordinary Czech routes storage remains the authority,
// because there the switcher choice is the only signal there is.
const localeLocked = document.documentElement.getAttribute('data-locale-locked') === 'true';
const documentLang = document.documentElement.lang || 'cs';

// A locale this dictionary does not carry is LEFT ALONE.
//
// T holds cs/en/de. The candidate locales (pt-BR, es) are served fully rendered
// from the server with their own chrome components, and none of their markup
// carries a [data-i18n] hook — so there is nothing here for this script to
// translate, and everything for it to damage. setLang begins `if (!T[lang])
// lang = 'en'`, which on /pt-br/… rewrote <html lang> from "pt-BR" to "en"
// after hydration: a Brazilian page announcing itself as English to every
// screen reader and crawler that reads the live DOM. Nothing visible changed,
// which is why only a browser-level assertion caught it.
//
// Returning early is correct rather than defensive: on these pages the server
// output is already complete and already right.
if (localeLocked && !T[documentLang]) {
  // Nothing to do. The server-rendered locale chrome is authoritative.
} else {
  const initLang = localeLocked ? documentLang : (localStorage.getItem('tnt-lang') || 'cs');
  setLang(initLang, { persist: !localeLocked });
}
