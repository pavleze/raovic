import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { serviceCategories } from "../../shared/data/servicesData";
import logoRaovic from "../../assets/logo_raovic.png";
import logoWordmark from "../../assets/Ravovic-bez-kruga.png";
import logoWordmarkScrolled from "../../assets/Ravovic-mauve-bez-kruga.png";
import logoCircle from "../../assets/mauve-krug-beli.png";
import logoCircleScrolled from "../../assets/roze-lila-krug.png";

const PHONE_HREF = "tel:+381112447763";

/** Unutrašnje stranice - beli header sa radijusom odmah, bez čekanja skrola */
const SOLID_HEADER_PATHS = ["/usluge", "/tim", "/blog", "/kontakt"];

const PAGE_TITLES = {
  "/usluge": {
    title: "Usluge",
    lead: "Kompletna ginekološka zaštita u svim fazama ženskog života - od preventive do složenih dijagnostičkih procedura.",
  },
  "/tim": {
    title: "Tim",
    lead: "Iskusni specijalisti posvećeni tome da svaka poseta bude profesionalna, pažljiva i prijatna.",
  },
  "/blog": {
    title: "Blog",
    lead: "Saveti i novosti iz ordinacije Raović.",
  },
  "/kontakt": {
    title: "Kontakt",
    lead: "Zakažite pregled telefonom, porukom ili putem forme. Odgovaramo u toku radnog vremena.",
  },
};

// Nav stavka sa dropdown-om (otvara se na hover, zatvara na klik i na izlazak miša)
function NavDropdown({ to, label, links }) {
  const [open, setOpen] = useState(false);
  const { pathname, search } = useLocation();
  const currentQuery = search.startsWith("?") ? search.slice(1) : search;

  return (
    <div
      className="site-nav__item"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <NavLink to={to} onClick={() => setOpen(false)} className="site-nav__link">
        {label}
        <svg className="site-nav__chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </NavLink>
      <div className={`nav-dropdown ${open ? "is-open" : ""}`}>
        {links.map((l) => {
          const qIndex = l.to.indexOf("?");
          const linkPath = qIndex === -1 ? l.to : l.to.slice(0, qIndex);
          const linkQuery = qIndex === -1 ? "" : l.to.slice(qIndex + 1);
          const isActive =
            pathname === linkPath &&
            (linkQuery
              ? currentQuery === linkQuery ||
                (pathname === "/usluge" && !currentQuery && linkQuery === "kat=ginekologija")
              : !currentQuery);

          return (
            <Link
              key={l.to}
              to={l.to}
              className={isActive ? "is-active" : undefined}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function AppShell({ children }) {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [compactNav, setCompactNav] = useState(false);
  const closeMenu = () => setMenuOpen(false);
  const forceSolidHeader = SOLID_HEADER_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
  const pageMeta = PAGE_TITLES[pathname] ?? null;
  const pageTall = Boolean(pageMeta) && !scrolled;
  // Na mobilnom / uslugama je header uvek bel — mauve logo odmah.
  const solidHeader = scrolled || compactNav || forceSolidHeader;
  const solidLogo = solidHeader;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setScrolled(window.scrollY > 40);
  }, [pathname]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 900px)");
    const sync = () => setCompactNav(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return (
    <div
      className={[
        "site-root",
        pageMeta ? "site-root--page-header" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >

      {/* Sticky header */}
      <header
        className={[
          "site-header",
          solidHeader ? "is-scrolled" : "",
          solidLogo ? "has-solid-logo" : "",
          pageMeta ? "site-header--page" : "",
          pageTall ? "site-header--page-tall" : "",
          pageMeta && scrolled ? "site-header--page-compact" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <div className="site-shell site-header__inner">
          <Link className="site-brand" to="/" aria-label="RAOVIC početna" onClick={closeMenu}>
            <span className="site-brand__mark">
              <img
                className="site-brand__wordmark"
                src={solidLogo ? logoWordmarkScrolled : logoWordmark}
                alt="RAOVIC"
              />
              <span className="site-brand__spin" aria-hidden="true">
                <img src={solidLogo ? logoCircleScrolled : logoCircle} alt="" />
              </span>
            </span>
          </Link>

          <div className="site-header__pill">
            <nav className="site-nav" aria-label="Glavna navigacija">
              <NavLink to="/" end>Početna</NavLink>
              <NavDropdown
                to="/usluge"
                label="Usluge"
                links={serviceCategories.map((cat) => ({
                  to: `/usluge?kat=${cat.id}`,
                  label: cat.label,
                }))}
              />
              <NavLink to="/tim">Tim</NavLink>
              {/* Sekcija na pocetnoj - obican link, da se ne pali kao aktivna strana */}
              <Link to="/" state={{ scrollTo: "o-nama" }}>O nama</Link>
              <NavLink to="/blog">Blog</NavLink>
              <NavLink to="/kontakt">Kontakt</NavLink>
            </nav>
            <a className="button button--primary site-header__cta" href={PHONE_HREF}>
              Zakažite pregled
            </a>
          </div>

          <button
            className={`site-header__burger ${menuOpen ? "is-open" : ""}`}
            aria-label="Meni"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span /><span /><span />
          </button>
        </div>

        {pageMeta && (
          <div className="site-shell site-header__page" aria-hidden={!pageTall}>
            <div className="site-header__page-inner">
              <h1>{pageMeta.title}</h1>
              {pageMeta.lead && <p>{pageMeta.lead}</p>}
            </div>
          </div>
        )}

        {/* Mobilni meni */}
        <div className={`mobile-menu ${menuOpen ? "is-open" : ""}`}>
          <nav className="mobile-menu__nav" aria-label="Mobilna navigacija">
            <NavLink to="/" end onClick={closeMenu}>Početna</NavLink>
            <NavLink to="/usluge" onClick={closeMenu}>Usluge</NavLink>
            <NavLink to="/tim" onClick={closeMenu}>Tim</NavLink>
            <Link to="/" state={{ scrollTo: "o-nama" }} onClick={closeMenu}>O nama</Link>
            <NavLink to="/blog" onClick={closeMenu}>Blog</NavLink>
            <NavLink to="/kontakt" onClick={closeMenu}>Kontakt</NavLink>
          </nav>
          <a className="button button--primary" href={PHONE_HREF} onClick={closeMenu}>
            Zakažite pregled
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          </a>
        </div>
      </header>

      <main className="site-main">{children}</main>

      {/* Plutajući brzi linkovi */}
      <div className="quick-contact" aria-label="Brzi kontakt">
        <a className="quick-contact__btn" href="tel:+381112447763" aria-label="Pozovite nas">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
        </a>
        <a className="quick-contact__btn" href="mailto:ordinacijaraovic@gmail.com" aria-label="Pošaljite email">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="2" y="4" width="20" height="16" rx="2"/>
            <path d="m22 7-10 6L2 7"/>
          </svg>
        </a>
      </div>

      {/* Footer */}
      <footer className="site-footer">
        <div className="site-shell site-footer__body">

          <div className="site-footer__brand">
            <Link className="site-brand" to="/" aria-label="RAOVIC početna">
              <img className="site-brand__logo site-footer__logo" src={logoRaovic} alt="RAOVIC" />
            </Link>
            <p>
              Kompletna ginekološka zaštita i nega žena u svim fazama života.
              Više od 20 godina iskustva, Golsvordijeva 6, Vračar.
            </p>
            <div className="site-footer__social">
              <a href="https://www.instagram.com/raovicordinacija" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
                </svg>
              </a>
              <a href="https://www.facebook.com/GinekoloskaOrdinacijaRaovic" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
            </div>
          </div>

          <div className="site-footer__col">
            <h4>Navigacija</h4>
            <nav>
              <Link to="/">Početna</Link>
              <Link to="/usluge">Usluge</Link>
              <Link to="/tim">Tim</Link>
              <Link to="/" state={{ scrollTo: "o-nama" }}>O nama</Link>
              <Link to="/blog">Blog</Link>
              <Link to="/kontakt">Kontakt</Link>
            </nav>
          </div>

          <div className="site-footer__col">
            <h4>Usluge</h4>
            <nav>
              <Link to="/usluge?kat=ginekologija">Ginekologija</Link>
              <Link to="/usluge?kat=trudnoca">Trudnoća</Link>
              <Link to="/usluge?kat=intervencije">Intervencije</Link>
              <Link to="/usluge?kat=sterilitet">Sterilitet</Link>
              <Link to="/usluge?kat=konsultativni">Konsultativni pregledi</Link>
            </nav>
          </div>

          <div className="site-footer__col">
            <h4>Kontakt</h4>
            <div className="site-footer__contact">
              <span>Golsvordijeva 6, Vračar</span>
              <span>11000 Beograd</span>
              <a href="tel:+381112447763">011 244 77 63</a>
              <a href="tel:+381636878890">063 687 889</a>
              <a href="mailto:ordinacijaraovic@gmail.com">ordinacijaraovic@gmail.com</a>
              <span>Pon – Pet: 08:00 – 20:00</span>
              <span>Subota: 08:00 – 14:00</span>
            </div>
          </div>

        </div>

        <div className="site-footer__bottom">
          <div className="site-shell site-footer__bottom-inner">
            <span>© 2025 Ginekološka ordinacija Raović. Sva prava zadržana.</span>
            <span>Golsvordijeva 6, 11000 Beograd</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
