import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { TeamCard } from "../../shared/ui/TeamCard";
import { FocusGallery } from "../../shared/ui/FocusGallery";
import { founders, associates } from "../../shared/data/teamData";
import { ordinacijaGallery } from "../../shared/data/galleryData";
import heroDoktor from "../../assets/doktor-i-trudnica-hero.png";
import heroStolice from "../../assets/stolice-landscape.png";
import heroBeba from "../../assets/beba-i-mama-hero.png";
import orbitLogo from "../../assets/mauve-braon-krug.png";
import missionMark from "../../assets/mauve-krug-beli.png";
import photoWhy from "../../assets/novaslika-zxast-izabrati.png";
import servicesBandBg from "../../assets/usluge-bg-soft.png";
import dnaPattern from "../../assets/dna-helix-pattern.svg";
import missionVisual from "../../assets/prostor_lepse.png";

const HERO_SLIDES = [heroStolice, heroBeba, heroDoktor];
const homeTeam = [...founders, ...associates];

function CountUp({ to, suffix = "", duration = 1600 }) {
  const ref = useRef(null);
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setValue(to);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;
        io.disconnect();

        const start = performance.now();
        const tick = (now) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - (1 - t) ** 3;
          setValue(Math.round(to * eased));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.45 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [to, duration]);

  return (
    <strong ref={ref}>
      {value}
      {suffix}
    </strong>
  );
}

const services = [
  {
    title: "Ginekologija",
    text: "Konsultativni pregledi, ultrazvuk, Papa test, pregled dojki, kontracepcija i bakteriološke analize.",
    image: "/images/usluge/ginekologija.jpg",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="5"/><line x1="12" y1="13" x2="12" y2="21"/><line x1="9" y1="18" x2="15" y2="18"/></svg>,
  },
  {
    title: "Trudnoća",
    text: "Praćenje trudnoće kroz redovne kontrole, ultrazvučne preglede i Kolor Dopler u svakom trimestru.",
    image: "/images/usluge/trudnoca.jpg",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
  },
  {
    title: "Intervencije",
    text: "Ambulantne procedure, Papa test, kolposkopija i dijagnostičko-terapijske intervencije.",
    image: "/images/usluge/intervencije.webp",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>,
  },
  {
    title: "Konsultativni pregledi",
    text: "Specijalistički konsultativni pregledi - endokrinologija, hematologija, radiologija i drugi.",
    image: "/images/usluge/konsultativni.webp",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>,
  },
];

const processSteps = [
  "Zakazivanje termina telefonom ili porukom",
  "Kratak razgovor o tegobama ili cilju pregleda",
  "Pregled i dijagnostika u mirnom, diskretnom ambijentu",
  "Jasan nalaz, preporuke i plan sledećih koraka",
];

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

const PHONE_HREF = "tel:+381112447763";

export function HomePage() {
  const { state } = useLocation();
  const heroRef = useRef(null);
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setHeroIndex((i) => (i + 1) % HERO_SLIDES.length);
    }, 5500);
    return () => window.clearInterval(id);
  }, []);

  // Hero: pri skrolu krug ide desno, beli panel se produzava
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const range = Math.max(220, hero.offsetHeight * 0.6);
      const scrolled = Math.min(range, Math.max(0, -hero.getBoundingClientRect().top));
      hero.style.setProperty("--hero-drift", String(scrolled / range));
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const [activeT, setActiveT] = useState(0);
  const viewRef = useRef(null);
  const [cardW, setCardW] = useState(0);
  const [visibleT, setVisibleT] = useState(1);
  const GAP = 20;
  const maxT = Math.max(0, testimonials.length - visibleT);

  useEffect(() => {
    const calc = (observedWidth) => {
      if (!viewRef.current) return;
      // Ogranicava sirinu na razumne vrednosti - stiti od ResizeObserver-a
      // koji ume da prijavi ogromnu (privremenu, "intrinsic") sirinu flex
      // kontejnera i tako "naduva" kartice van ekrana.
      const raw = observedWidth ?? viewRef.current.offsetWidth;
      const w = Math.max(0, Math.min(raw, 2400));
      const vis = w < 560 ? 1 : w < 900 ? 2 : 3;
      setVisibleT(vis);
      setCardW((w - GAP * (vis - 1)) / vis);
    };
    calc();
    const ro = typeof ResizeObserver !== "undefined"
      ? new ResizeObserver((entries) => calc(entries[0]?.contentRect.width))
      : null;
    if (ro && viewRef.current) ro.observe(viewRef.current);
    const onResize = () => calc();
    window.addEventListener("resize", onResize);
    return () => {
      ro?.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    setActiveT((i) => Math.min(i, Math.max(0, testimonials.length - visibleT)));
  }, [visibleT]);

  // Link iz navigacije moze da cilja sekciju na pocetnoj strani
  useEffect(() => {
    if (!state?.scrollTo) return;
    const el = document.getElementById(state.scrollTo);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [state]);

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
      <section className="site-hero" ref={heroRef}>
        <div className="site-hero__bg-stack" aria-hidden="true">
          {HERO_SLIDES.map((src, i) => (
            <div
              key={src}
              className={`site-hero__bg${i === heroIndex ? " is-active" : ""}`}
              style={{ backgroundImage: `url(${src})` }}
            />
          ))}
        </div>
        <div className="site-hero__inner">
          <div className="site-hero__content">
            <div className="site-hero__orbit" aria-hidden="true">
              <span className="site-hero__orbit-ring" />
              <span className="site-hero__orbit-ring site-hero__orbit-ring--slow" />
              <span className="site-hero__orbit-logo">
                <img src={orbitLogo} alt="" />
              </span>
            </div>
            <div className="site-hero__copy">
              <p className="eyebrow">Ginekološka ordinacija Raović · Beograd</p>
              <h1>
                <span className="site-hero__title-line">Savremena ginekologija</span>
                <em>na jednom mestu.</em>
              </h1>
              <p className="site-hero__lead">
                Kompletna ginekološka zaštita i nega žena u svim fazama života.
                Više od 22 godine iskustva, savremena dijagnostika i visok standard
                medicinske nege.
              </p>
              <div className="site-hero__actions">
                <a className="button button--primary" href={PHONE_HREF}>
                  Pozovite nas
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                </a>
                <Link className="button button--ghost" to="/usluge">Naše usluge</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brzi info blok */}
      <section className="quick-info">
        <div className="site-shell">
          <div className="quick-info__grid reveal">

              <article className="info-card">
                <div className="info-card__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                </div>
                <h3>Pozovite nas</h3>
                <p>Zakažite pregled telefonom. Call centar je dostupan svakog dana od 08:00 do 20:00h.</p>
                <div className="info-card__phones">
                  <a href="tel:+381112447763"><span>Fiksni</span>011 244 77 63</a>
                  <a href="tel:+38163687889"><span>Mobilni</span>063 687 889</a>
                </div>
              </article>

              <article className="info-card info-card--accent">
                <div className="info-card__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15.5 14"/>
                  </svg>
                </div>
                <h3>Radno vreme</h3>
                <p>
                  Radnim danom: 08:00 - 20:00h<br />
                  Subotom: 08:00 - 14:00h
                </p>
                <Link className="info-card__link" to="/kontakt">Kontaktirajte nas →</Link>
              </article>

              <article className="info-card">
                <div className="info-card__icon" aria-hidden="true">
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

      {/* Why Raović */}
      <section className="why-section">
        <div className="site-shell why-layout">
          <div className="why-layout__main">
            <div className="why-header reveal">
              <h2>Zašto izabrati <span className="why-header__accent">ordinaciju Raović</span>?</h2>
              <p>
                Uz vas u svakoj fazi života - od prvih pregleda, kroz trudnoću
                i majčinstvo, do negovanja zdravlja u zrelim godinama.
              </p>
            </div>

            <div className="why-features">
              <article className="why-card reveal reveal--left">
                <div className="why-card__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 00-3-3.87"/>
                    <path d="M16 3.13a4 4 0 010 7.75"/>
                  </svg>
                </div>
                <h3>Tim specijalista</h3>
                <p>Dr Slađana i dr Zoran Raović — više od 20 godina zajedničkog iskustva u ginekologiji, akušerstvu i endokrinologiji.</p>
              </article>

              <article className="why-card reveal reveal--right">
                <div className="why-card__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                  </svg>
                </div>
                <h3>Savremena dijagnostika</h3>
                <p>Ultrazvučna dijagnostika najnovije generacije — brza, precizna i pouzdana, od rutinskog pregleda do složene analize.</p>
              </article>

              <article className="why-card reveal reveal--left">
                <div className="why-card__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0110 0v4"/>
                  </svg>
                </div>
                <h3>Privatnost i diskrecija</h3>
                <p>Prostor projektovan za komfor i poverljivost. Svaka poseta ostaje između vas i vašeg lekara — bez kompromisa.</p>
              </article>

              <article className="why-card reveal reveal--right">
                <div className="why-card__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                  </svg>
                </div>
                <h3>Individualan pristup</h3>
                <p>Nema standardizovane rutine. Svaka pacijentkinja dobija punu pažnju, jasno objašnjenje i plan prilagođen njoj.</p>
              </article>
            </div>
          </div>

          <figure className="why-media reveal">
            <img
              src={photoWhy}
              alt="Pregled u ordinaciji Raović — lekar i trudnica uz ultrazvučni snimak"
              loading="lazy"
            />
          </figure>
        </div>
      </section>

      {/* Services preview */}
      <section
        className="services-band"
        style={{
          "--services-band-bg": `url(${servicesBandBg})`,
          "--services-dna": `url(${dnaPattern})`,
        }}
      >
        <div className="site-shell">
          <div className="services-band__header reveal">
            <h2>Usluge koje nudimo</h2>
            <p>
              Spajamo stručnost, savremenu dijagnostiku i pažljiv pristup, kako
              bismo bili uz vas u svakoj fazi života.
            </p>
          </div>

          <div className="services-band__grid">
            {services.slice(0, 3).map((service, index) => (
              <article
                className={`services-band__card reveal reveal--up`}
                key={service.title}
                style={{ "--reveal-delay": `${0.08 + index * 0.12}s` }}
              >
                <div className="services-band__card-top">
                  <div className="services-band__icon" aria-hidden="true">
                    {service.icon}
                  </div>
                  <h3>{service.title}</h3>
                </div>
                <p>{service.text}</p>
                <Link className="services-band__more" to="/usluge">
                  Pročitaj više
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="13 6 19 12 13 18" />
                  </svg>
                </Link>
              </article>
            ))}
          </div>

          <div className="services-band__cta reveal">
            <Link className="services-band__all" to="/usluge">
              Pogledaj sve usluge
            </Link>
          </div>
        </div>
      </section>

      {/* Cilj ordinacije */}
      <section className="mission-band" aria-label="Cilj ordinacije">
        <div className="site-shell">
          <div className="mission-pill">
            <img
              className="mission-pill__mark"
              src={missionMark}
              alt=""
              aria-hidden="true"
            />
            <div className="mission-pill__copy">
              <blockquote className="mission-pill__quote">
                <p className="mission-pill__title">Cilj ordinacije</p>
                <p>
                  <q>
                    Pružiti potpunu ginekološku zaštitu i negu ženama u svim
                    fazama života.
                  </q>
                </p>
                <footer>Slađana i Zoran Raović</footer>
              </blockquote>
            </div>
            <div className="mission-pill__visual" aria-hidden="true">
              <img src={missionVisual} alt="" />
            </div>
          </div>
        </div>
      </section>

      {/* O nama + Tim */}
      <section
        className="about-band"
        id="o-nama"
        style={{
          "--doctor-card-bg": `url(${servicesBandBg})`,
          "--doctor-dna": `url(${dnaPattern})`,
        }}
      >
        <div className="site-shell">
          <div className="about-band__layout">
            <div className="about-band__main">
              <div className="about-band__copy reveal">
                <h2>O nama</h2>
                <p className="about-band__lead">
                  Dobrodošli u Ginekološku Ordinaciju Raović. Specijalistička
                  ginekološko-akušerska ordinacija Raović smeštena je u samom srcu
                  Vračara i brine o Vašem zdravlju od 2004. godine.
                </p>
                <p>
                  Naša ordinacija pruža potpunu ginekološku zaštitu i negu ženama
                  u svim fazama života - od puberteta do menopauzalnog perioda.
                  Pored toga, uspešno se bavimo lečenjem ženskog i muškog
                  steriliteta, i pomažemo budućim roditeljima da planiraju
                  trudnoću. Vodimo trudnoću od prvog trenutka, pa sve do
                  postporođajnog perioda, jer znamo da je ovo najlepši, ali i
                  najneizvesniji period u životu jedne žene. U svakom trenutku
                  pružamo podršku našim pacijentima, i nastojimo da u najkraćem
                  roku odgovorimo na sva pitanja, rešimo sve nedoumice, nađemo
                  najbolja rešenja za probleme i damo najbolje savete. U potpunosti
                  smo posvećeni ne samo ka lečenju, već i ka preventivi i
                  očuvanju dragocenog ženskog zdravlja. Uvek smo okrenuti ka
                  budućnosti i daljem stručnom usavršavanju i uvođenju
                  najsavremenije opreme, prateći najnovije svetske standarde u
                  oblasti medicine, a naročito ginekologije i akušerstva.
                </p>
                <p>
                  Sa Vama ćemo proći kroz sve lepe, neizvesne i teške trenutke, jer
                  su naši pacijenti stub ordinacije Raović.
                </p>
              </div>

              <div className="about-band__team">
                <div className="team-band__header reveal">
                  <h2>Naš tim lekara</h2>
                  <p>
                    Specijalisti koji spajaju iskustvo, savremenu dijagnostiku i
                    pažljiv pristup - uz vas u svakoj fazi života.
                  </p>
                </div>

                <div className="team-band__founders">
                  {founders.map((d) => (
                    <TeamCard key={d.name} {...d} accent panel />
                  ))}
                </div>

                <div className="team-band__rail">
                  <div className="rail">
                    <div className="rail__track">
                      {homeTeam.map((d) => (
                        <TeamCard key={d.name} {...d} accent panel />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="team-band__cta">
                  <Link className="team-band__all" to="/tim">
                    Pogledajte ceo tim
                  </Link>
                </div>
              </div>
            </div>

            <aside className="about-band__facts" aria-label="Ključne činjenice">
              <article className="about-band__fact">
                <CountUp to={22} suffix="+" />
                <span>godina iskustva u ginekologiji i akušerstvu</span>
              </article>
              <article className="about-band__fact">
                <CountUp to={10} />
                <span>lekara specijalista, uključujući profesora i docenta</span>
              </article>
              <article className="about-band__fact">
                <strong>Tim</strong>
                <span>saradnja sa nefrologom, kardiologom i hematologom</span>
              </article>
              <article className="about-band__fact">
                <strong>Vračar</strong>
                <span>Golsvordijeva 6 - diskretan ambijent u Beogradu</span>
              </article>
            </aside>
          </div>
        </div>
      </section>

      {/* Galerija */}
      <section className="home-gallery" aria-label="Galerija ordinacije">
        <div className="site-shell">
          <div className="home-gallery__header reveal">
            <h2>Galerija</h2>
            <p>Pogled u prostor ordinacije Raović.</p>
          </div>
          <div className="home-gallery__stage reveal">
            <FocusGallery images={ordinacijaGallery} />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <div className="site-shell">
          <div className="testimonials-header reveal">
            <h2>Šta kažu naše pacijentkinje</h2>
            <p>Iskustva pacijentkinja koje nam ukazuju poverenje.</p>
          </div>

          <div className="t-slider reveal">
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
                {Array.from({ length: maxT + 1 }, (_, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`t-dot${i === activeT ? " t-dot--active" : ""}`}
                    onClick={() => setActiveT(i)}
                    aria-label={`Recenzija ${i + 1}`}
                  />
                ))}
              </div>
              <div className="t-navs">
                <button type="button" className="t-nav" onClick={prevT} disabled={activeT === 0} aria-label="Prethodna">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6"/>
                  </svg>
                </button>
                <button type="button" className="t-nav" onClick={nextT} disabled={activeT >= maxT} aria-label="Sledeća">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </button>
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
