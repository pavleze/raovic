import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useBooking } from "../context/BookingContext";
import { BookingModal } from "../../shared/ui/BookingModal";
import { serviceCategories } from "../../shared/data/servicesData";
import { blogCategories } from "../../shared/data/blogData";

// Nav stavka sa dropdown-om (otvara se na hover, zatvara na klik i na izlazak miša)
function NavDropdown({ to, label, links }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="site-nav__item"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <NavLink to={to} onClick={() => setOpen(false)}>{label}</NavLink>
      <div className={`nav-dropdown ${open ? "is-open" : ""}`}>
        {links.map((l) => (
          <NavLink key={l.to} to={l.to} onClick={() => setOpen(false)}>
            {l.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
}

export function AppShell({ children }) {
  const { openBooking } = useBooking();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);
  return (
    <div className="site-root">

      {/* Sticky header */}
      <header className="site-header">
        <div className="site-shell site-header__inner">
          <Link className="site-brand" to="/" aria-label="RAOVIC početna" onClick={closeMenu}>
            <img className="site-brand__logo" src="/logo_bg.jpg" alt="RAOVIC" />
          </Link>
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
            <NavLink to="/o-nama">O nama</NavLink>
            <NavDropdown
              to="/vodic"
              label="Vodič"
              links={blogCategories
                .filter((c) => c.id !== "sve")
                .map((cat) => ({ to: `/vodic?kategorija=${cat.id}`, label: cat.label }))}
            />
            <NavLink to="/kontakt">Kontakt</NavLink>
          </nav>
          <button className="button button--primary site-header__cta" onClick={openBooking}>
            Zakažite pregled
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          </button>
          <button
            className={`site-header__burger ${menuOpen ? "is-open" : ""}`}
            aria-label="Meni"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span /><span /><span />
          </button>
        </div>

        {/* Mobilni meni */}
        <div className={`mobile-menu ${menuOpen ? "is-open" : ""}`}>
          <nav className="mobile-menu__nav" aria-label="Mobilna navigacija">
            <NavLink to="/" end onClick={closeMenu}>Početna</NavLink>
            <NavLink to="/usluge" onClick={closeMenu}>Usluge</NavLink>
            <NavLink to="/tim" onClick={closeMenu}>Tim</NavLink>
            <NavLink to="/o-nama" onClick={closeMenu}>O nama</NavLink>
            <NavLink to="/vodic" onClick={closeMenu}>Vodič</NavLink>
            <NavLink to="/kontakt" onClick={closeMenu}>Kontakt</NavLink>
          </nav>
          <button
            className="button button--primary"
            onClick={() => { closeMenu(); openBooking(); }}
          >
            Zakažite pregled
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          </button>
        </div>
      </header>

      <main className="site-main">{children}</main>
      <BookingModal />

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
              <img className="site-brand__logo site-footer__logo" src="/logo_bg.jpg" alt="RAOVIC" />
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
              <Link to="/o-nama">O nama</Link>
              <Link to="/vodic">Vodič</Link>
              <Link to="/kontakt">Kontakt</Link>
            </nav>
          </div>

          <div className="site-footer__col">
            <h4>Usluge</h4>
            <nav>
              <Link to="/usluge">Ginekologija</Link>
              <Link to="/usluge">Trudnoća</Link>
              <Link to="/usluge">Intervencije</Link>
              <Link to="/usluge">Sterilitet</Link>
              <Link to="/usluge">Konsultativni pregledi</Link>
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
