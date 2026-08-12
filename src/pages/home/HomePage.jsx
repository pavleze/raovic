import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useBooking } from "../../app/context/BookingContext";

const services = [
  {
    title: "Ginekologija",
    text: "Konsultativni pregledi, ultrazvuk, Papa test, pregled dojki, kontracepcija i bakteriološke analize.",
    image: "/usluga-ginekologija.jpg",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="5"/><line x1="12" y1="13" x2="12" y2="21"/><line x1="9" y1="18" x2="15" y2="18"/></svg>,
  },
  {
    title: "Trudnoća",
    text: "Praćenje trudnoće kroz redovne kontrole, ultrazvučne preglede i Kolor Dopler u svakom trimestru.",
    image: "/usluga-trudnoca.jpg",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
  },
  {
    title: "Intervencije",
    text: "Ambulantne procedure, Papa test, kolposkopija i dijagnostičko-terapijske intervencije.",
    image: "/usluga-intervencije.webp",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>,
  },
  {
    title: "Konsultativni pregledi",
    text: "Specijalistički konsultativni pregledi - endokrinologija, hematologija, radiologija i drugi.",
    image: "/usluga-konsultativni.webp",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>,
  },
];

const faqs = [
  {
    q: "Koliko često treba da obavim ginekološki pregled?",
    a: "Preporučuje se redovni ginekološki pregled jednom godišnje za sve žene starije od 18 godina, ili od početka seksualne aktivnosti. Kod pojave simptoma kao što su bol, neuobičajeno krvarenje ili promene u ciklusu, pregled treba zakazati odmah.",
  },
  {
    q: "Kako da zakažem pregled i šta da ponesem?",
    a: "Pregled možete zakazati telefonom (011 244 77 63 ili 063 687 889), e-mailom ili putem forme na sajtu. Na prvi pregled nije potrebna uputnica. Ponesite ličnu kartu, a ako imate ranije nalaze ili dokumentaciju - i njih.",
  },
  {
    q: "Da li su pregledi poverljivi?",
    a: "Apsolutno. Svaki razgovor i nalaz ostaje isključivo između vas i vašeg lekara. Ordinacija Raović u potpunosti poštuje medicinsku tajnu i privatnost svake pacijentkinje.",
  },
  {
    q: "Šta je Papa test i koliko često treba da se radi?",
    a: "Papa test (cervikalni bris) je brza, bezbolna procedura kojom se utvrđuju eventualne promene na grliću materice. Preporučuje se jednom u dve do tri godine kod žena između 25 i 65 godina, a češće ukoliko postoje rizični faktori.",
  },
  {
    q: "Da li se bave i problemima neplodnosti?",
    a: "Da. Dr Zoran Raović je specijalizovan za dijagnostiku i lečenje steriliteta. Parovima koji imaju poteškoće sa začećem ordinacija pruža kompletnu obradu i upućuje ka odgovarajućim terapijskim opcijama.",
  },
  {
    q: "Koje su mogućnosti plaćanja?",
    a: "Usluge ordinacije plaćaju se privatno - gotovinom ili karticom. Cenovnik je dostupan na upit telefonom ili e-mailom. Neke usluge mogu biti pokrivene dopunskim zdravstvenim osiguranjem.",
  },
];

const processSteps = [
  "Zakazivanje termina telefonom ili porukom",
  "Kratak razgovor o tegobama ili cilju pregleda",
  "Pregled i dijagnostika u mirnom, diskretnom ambijentu",
  "Jasan nalaz, preporuke i plan sledećih koraka",
];

const GOOGLE_MAPS_URL = "https://www.google.com/maps/place/Ginekolo%C5%A1ka+ordinacija+Raovi%C4%87/@44.8024123,20.4732801,17z/data=!3m1!4b1!4m6!3m5!1s0x475a7a9fc7cca91b:0x120c20fa7a5e4749!8m2!3d44.8024123!4d20.475855!16s%2Fg%2F1hc2x6r3d";

const testimonials = [
  {
    name: "Jelena Petrović",
    text: "Redovna sam pacijentkinja više od 10 godina. Dr Slađana je neverovatno stručna i pažljiva - uvek ima vremena da objasni svaki detalj. Jedina ginekolog kojoj potpuno verujem.",
    date: "pre mesec dana",
  },
  {
    name: "Milica Đorđević",
    text: "Pratili su moju trudnoću od prvog ultrazvuka do porođaja. Osećala sam se sigurno u svakom trenutku. Dr Zoran jasno objasni sve. Hvala na posvećenosti!",
    date: "pre 2 meseca",
  },
  {
    name: "Ana Nikolić",
    text: "Pregled je bio detaljan i pažljiv, a objašnjenje nalaza jasno i smirujuće. Osećala sam se bezbedno od prvog dolaska. Definitivno preporučujem svim ženama!",
    date: "pre 3 meseca",
  },
  {
    name: "Tijana B.",
    text: "Pratili su moju trudnoću od početka do kraja. Svaki pregled je bio detaljno objašnjen, nikada nisam izašla bez potpunog razumevanja nalaza. Hvala dr Slađani na svemu.",
    date: "pre 3 meseca",
  },
  {
    name: "Tamara Savić",
    text: "Sve pohvale za ceo tim! Ambijent je miran i diskretan, osoblje ljubazno i toplo, a lekari vrhunski stručnjaci. Preporučujem svima iz okruženja.",
    date: "pre 3 nedelje",
  },
  {
    name: "Ivana Marković",
    text: "Dolazim zbog kontrole trudnoće i ne mogu da zamislim bolju ordinaciju. Sve je savremeno, uvek na vreme. Dr Zoran mi je pomogao i sa sterilitetom - sada čekamo bebu!",
    date: "pre mesec dana",
  },
  {
    name: "Katarina Simić",
    text: "Ultrazvuk koji sam radila bio je neverovatno detaljan. Sve je objašnjeno jasno, dobila sam nalaz na vreme. Profesionalizam na svakom koraku - vratiću se sigurno.",
    date: "pre 2 nedelje",
  },
  {
    name: "Vesna Jovanović",
    text: "Koristim usluge ordinacije Raović za sve ginekološke preglede već 7 godina. Cenim individualnost u pristupu i činjenicu da nikada ne osećam žurbu. Pravi profesionalci.",
    date: "pre 2 meseca",
  },
];

export function HomePage() {
  const { openBooking } = useBooking();
  const [openFaq, setOpenFaq] = useState(null);
  const [activeT, setActiveT] = useState(0);
  const viewRef = useRef(null);
  const [cardW, setCardW] = useState(0);
  const GAP = 20;
  const VISIBLE = 3;
  const maxT = testimonials.length - VISIBLE;

  useEffect(() => {
    const calc = () => {
      if (viewRef.current) {
        const w = viewRef.current.offsetWidth;
        setCardW((w - GAP * (VISIBLE - 1)) / VISIBLE);
      }
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  // Scroll-reveal: elementi sa klasom .reveal se pojave kad uđu u vidokrug
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const prevT = () => setActiveT((i) => Math.max(0, i - 1));
  const nextT = () => setActiveT((i) => Math.min(maxT, i + 1));
  return (
    <div className="home-page">

      {/* Hero */}
      <section className="site-hero">
        <div className="site-hero__bg site-hero__bg--1" />
        <div className="site-hero__bg site-hero__bg--2" />
        <div className="site-hero__overlay" />
        <div className="site-shell site-hero__inner">
          <div className="site-hero__content">
            <p className="eyebrow">Ginekološka ordinacija · Beograd</p>
            <h1>
              Savremena ginekologija<br />
              <em>na jednom mestu.</em>
            </h1>
            <p className="site-hero__lead">
              Kompletna ginekološka zaštita i nega žena u svim fazama života.
              Više od 20 godina iskustva, savremena dijagnostika i visok
              standard medicinske nege.
            </p>
            <div className="site-hero__actions">
              <button className="button button--primary" onClick={openBooking}>
                Kontakt
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </button>
              <Link className="button button--ghost" to="/usluge">Naše usluge</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Brzi info blok */}
      <section className="quick-info">
        <div className="site-shell">
          <div className="quick-info__grid reveal">

              <article className="info-card">
                <div className="info-card__icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                </div>
                <h3>Pozovite nas</h3>
                <p>Zakažite pregled telefonom. Call centar je dostupan svakoga dana u periodu od 08.00 do 20.00h.</p>
                <div className="info-card__phones">
                  <span><span className="info-card__phone-label">Fiksni:</span> <a href="tel:+381112447763">011 244 77 63</a></span>
                  <span><span className="info-card__phone-label">Mobilni:</span> <a href="tel:+381636878890">063 687 889</a></span>
                </div>
              </article>

              <article className="info-card">
                <div className="info-card__icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15.5 14"/>
                  </svg>
                </div>
                <h3>Radno vreme</h3>
                <p>
                  Radnim danom: 08:00 – 20:00h<br />
                  Subotom: 08:00 – 14:00h
                </p>
                <Link className="info-card__link" to="/kontakt">Kontaktirajte nas →</Link>
              </article>

              <article className="info-card">
                <div className="info-card__icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                <h3>Lokacija</h3>
                <p>
                  Golsvordijeva 6, 11000 Beograd<br />
                  Vračar
                </p>
                <a
                  className="info-card__link"
                  href="https://maps.google.com/?q=Golsvordijeva+6+Beograd"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Pogledaj na mapama →
                </a>
              </article>

          </div>
        </div>
      </section>

      {/* Services preview */}
      <section className="home-section">
        <div className="site-shell">
          <div className="service-grid reveal">
            {services.map((service) => (
              <article className="service-card" key={service.title}>
                <div className="service-card__body">
                  <div className="service-card__icon" aria-hidden="true">{service.icon}</div>
                  <h3>{service.title}</h3>
                  <p>{service.text}</p>
                  <button className="service-card__link" onClick={openBooking}>Zakažite pregled →</button>
                </div>
                <div className="service-card__media">
                  {service.image && (
                    <img src={service.image} alt={service.title} loading="lazy" />
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Why Raović */}
      <section className="why-section">
        <div className="site-shell">
          <div className="section-header reveal">
            <p className="eyebrow eyebrow--dash">Sve što vam je potrebno na jednom mestu</p>
            <h2>Zašto izabrati ordinaciju Raović?</h2>
          </div>

          <div className="why-track">
            <svg
              className="why-wave"
              viewBox="0 0 1000 320"
              preserveAspectRatio="none"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M125,223 C230,223 270,63 375,63 C480,63 520,223 625,223 C730,223 770,63 875,63 C935,63 965,30 1010,8"
                stroke="rgba(80,37,107,0.13)"
                strokeWidth="2"
                strokeDasharray="8 6"
              />
            </svg>

            <div className="why-items reveal">
              <div className="why-item why-item--low">
                <div className="why-item__icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 00-3-3.87"/>
                    <path d="M16 3.13a4 4 0 010 7.75"/>
                  </svg>
                </div>
                <h3>Tim specijalista</h3>
                <p>Dr Slađana i dr Zoran Raović - više od 20 godina zajedničkog iskustva u ginekologiji, akušerstvu i endokrinologiji.</p>
              </div>

              <div className="why-item why-item--high">
                <div className="why-item__icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                  </svg>
                </div>
                <h3>Savremena dijagnostika</h3>
                <p>Ultrazvučna dijagnostika najnovije generacije - brza, precizna i pouzdana, od rutinskog pregleda do složene analize.</p>
              </div>

              <div className="why-item why-item--low">
                <div className="why-item__icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0110 0v4"/>
                  </svg>
                </div>
                <h3>Privatnost i diskrecija</h3>
                <p>Prostor projektovan za komfor i poverljivost. Svaka poseta ostaje između vas i vašeg lekara - bez kompromisa.</p>
              </div>

              <div className="why-item why-item--high">
                <div className="why-item__icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                  </svg>
                </div>
                <h3>Individualan pristup</h3>
                <p>Nema standardizovane rutine. Svaka pacijentkinja dobija punu pažnju, jasno objašnjenje i plan prilagođen njoj.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* O nama */}
      <section className="home-section">
        <div className="site-shell">
          <div className="about-intro reveal">
            <p className="eyebrow eyebrow--dash">O nama</p>
            <h2>Dobrodošli u Ginekološku Ordinaciju Raović</h2>
            <p className="about-intro__lead">
              Specijalistička ginekološko-akušerska ordinacija Raović smeštena u samom
              srcu Vračara, brine o Vašem zdravlju od 2004. godine.
            </p>
          </div>

          <div className="about-section about-section--textleft reveal">
            <div className="about-content">
              <h3 className="about-content__title">Ginekološka ordinacija Raović</h3>
              <p>
                Naša ordinacija pruža potpunu ginekološku zaštitu i negu ženama u svim fazama
                života - od puberteta do menopauzalnog perioda. Pored toga, uspešno se bavimo
                lečenjem ženskog i muškog steriliteta, i pomažemo budućim roditeljima da planiraju
                trudnoću. Vodimo trudnoću od prvog trenutka, pa sve do postporođajnog perioda, jer
                znamo da je ovo najlepši, ali i najneizvesniji period u životu jedne žene. U svakom
                trenutku pružamo podršku našim pacijentima, i nastojimo da u najkraćem roku
                odgovorimo na sva pitanja, rešimo sve nedoumice, nađemo najbolja rešenja za probleme
                i damo najbolje savete. U potpunosti smo posvećeni ne samo ka lečenju, već i ka
                preventivi i očuvanju dragocenog ženskog zdravlja. Uvek smo okrenuti ka budućnosti i
                daljem stručnom usavršavanju i uvođenju najsavremenije opreme, prateći najnovije
                svetske standarde u oblasti medicine, a naročito ginekologije i akušerstva.
              </p>
              <p>
                Sa Vama ćemo proći kroz sve lepe, neizvesne i teške trenutke, jer su naši pacijenti
                stub ordinacije Raović.
              </p>
              <blockquote className="about-quote">
                <span className="about-quote__label">Cilj naše ginekološke ordinacije</span>
                <p className="about-quote__text">
                  Pružiti potpunu ginekološku zaštitu i negu ženama u svim fazama života
                </p>
                <footer className="about-quote__author">Slađana i Zoran Raović</footer>
              </blockquote>
            </div>
            <div className="about-visual">
              <div className="about-card">
                <img src="/o-nama.png" alt="Ginekološka ordinacija Raović" className="about-card__img" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-section">
        <div className="site-shell">
          <div className="faq-section__header reveal">
            <p className="eyebrow eyebrow--dash">Imate pitanja?</p>
            <h2>Najčešća pitanja</h2>
            <p className="faq-section__lead">
              Odgovorili smo na pitanja koja pacijentkinje najčešće postavljaju.
              Ukoliko ne pronađete odgovor - slobodno nas pozovite.
            </p>
          </div>

          <div className="faq-list reveal">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className={`faq-item ${openFaq === i ? "faq-item--open" : ""}`}
              >
                <button
                  className="faq-item__question"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                >
                  <span className="faq-item__badge" aria-hidden="true">?</span>
                  <span className="faq-item__text">{faq.q}</span>
                  <span className="faq-item__chevron" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </span>
                </button>
                <div className="faq-item__answer">
                  <p>{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <div className="site-shell">
          <div className="testimonials-layout">

            {/* Left: Google summary panel */}
            <div className="t-panel">
              <div className="t-panel__logo">
                <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Google recenzije</span>
              </div>
              <div className="t-panel__score">4.9</div>
              <div className="t-panel__stars" aria-label="4.9 od 5 zvezdica">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="22" height="22" viewBox="0 0 24 24" fill="#F59E0B" aria-hidden="true">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </div>
              <div className="t-panel__label">Odlično</div>
              <div className="t-panel__count">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
                </svg>
                <span>59 recenzija</span>
              </div>
              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="t-panel__cta"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
                Pogledajte sve recenzije
              </a>
              <div className="t-panel__verified">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                Google verifikovane recenzije
              </div>
            </div>

            {/* Right: Slider */}
            <div className="t-slider">
              <div className="t-viewport" ref={viewRef}>
                <div
                  className="t-track"
                  style={{
                    transform: `translateX(-${activeT * (cardW + GAP)}px)`,
                    gap: `${GAP}px`,
                  }}
                >
                  {testimonials.map((t) => (
                    <article
                      className="t-card"
                      key={t.name}
                      style={cardW ? { width: `${cardW}px` } : undefined}
                    >
                      <div className="t-card__quote" aria-hidden="true">❝</div>
                      <div className="t-card__stars" aria-label="5 od 5 zvezdica">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#F59E0B" aria-hidden="true">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                          </svg>
                        ))}
                      </div>
                      <p className="t-card__text">{t.text}</p>
                      <div className="t-card__author">
                        <div className="t-card__avatar">{t.name[0]}</div>
                        <div>
                          <div className="t-card__name">{t.name}</div>
                          <div className="t-card__date">{t.date}</div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              <div className="t-footer">
                <div className="t-dots">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      className={`t-dot${i === activeT ? " t-dot--active" : ""}`}
                      onClick={() => setActiveT(Math.min(i, maxT))}
                      aria-label={`Recenzija ${i + 1}`}
                    />
                  ))}
                </div>
                <div className="t-navs">
                  <button className="t-nav" onClick={prevT} disabled={activeT === 0} aria-label="Prethodna">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="15 18 9 12 15 6"/>
                    </svg>
                  </button>
                  <button className="t-nav" onClick={nextT} disabled={activeT >= maxT} aria-label="Sledeća">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Mapa / Lokacija */}
      <section className="home-section">
        <div className="site-shell">
          <div className="map-embed reveal">
            <iframe
              src="https://www.google.com/maps?q=Ginekolo%C5%A1ka+ordinacija+Raovi%C4%87,+Golsvordijeva+6,+Beograd&output=embed"
              title="Lokacija ordinacije Raović na mapi"
              width="100%"
              height="440"
              style={{ border: 0, display: "block" }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </section>

    </div>
  );
}
