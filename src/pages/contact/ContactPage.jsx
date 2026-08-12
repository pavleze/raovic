import { useState } from "react";
import { PageHeader } from "../../shared/ui/PageHeader";
import { useBooking } from "../../app/context/BookingContext";

const quickInfo = [
  {
    label: "Telefon",
    values: [
      { text: "011 244 77 63", href: "tel:+381112447763" },
      { text: "063 687 889",   href: "tel:+381636878890" },
    ],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.6 3.4 2 2 0 0 1 3.58 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.78a16 16 0 0 0 6.29 6.29l1.65-1.65a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
  },
  {
    label: "Email",
    values: [
      { text: "ordinacijaraovic@gmail.com", href: "mailto:ordinacijaraovic@gmail.com" },
    ],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <polyline points="2,4 12,13 22,4" />
      </svg>
    ),
  },
  {
    label: "Adresa",
    values: [
      { text: "Golsvordijeva 6" },
      { text: "11000 Beograd, Vračar" },
    ],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    label: "Radno vreme",
    values: [
      { text: "Pon – Pet: 08:00 – 20:00" },
      { text: "Subota: 08:00 – 14:00" },
    ],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
];

export function ContactPage() {
  const { openBooking } = useBooking();
  const [sent, setSent] = useState(false);

  return (
    <div className="inner-page">
      <PageHeader
        eyebrow="Stupite u kontakt"
        title="Zakazivanje i informacije"
        lead="Zakažite pregled telefonom, porukom ili putem forme. Odgovaramo u toku radnog vremena."
      />
      <div className="site-shell inner-page__content">

        {/* ── Quick info ── */}
        <div className="contact-quick">
          {quickInfo.map((item) => (
            <div className="contact-quick__card" key={item.label}>
              <div className="contact-quick__icon">{item.icon}</div>
              <div>
                <p className="contact-quick__label">{item.label}</p>
                <div className="contact-quick__values">
                  {item.values.map((v) =>
                    v.href ? (
                      <a key={v.text} href={v.href} className="contact-quick__val">{v.text}</a>
                    ) : (
                      <span key={v.text} className="contact-quick__val">{v.text}</span>
                    )
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Form + Map ── */}
        <div className="contact-main">

          {/* Form */}
          <div className="contact-form-card">
            <div className="contact-form-card__header">
              <p className="eyebrow">Pišite nam</p>
              <h2>Pošaljite upit</h2>
              <p>Odgovorićemo u toku radnog dana. Za hitne slučajeve pozovite direktno.</p>
            </div>

            {sent ? (
              <div className="contact-sent">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <p>Poruka je poslata! Javićemo vam se uskoro.</p>
              </div>
            ) : (
              <form className="contact-form-inner" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
                <div className="form-row">
                  <div className="form-field">
                    <label>Ime</label>
                    <input type="text" placeholder="Vaše ime" required />
                  </div>
                  <div className="form-field">
                    <label>Prezime</label>
                    <input type="text" placeholder="Vaše prezime" required />
                  </div>
                </div>
                <div className="form-field">
                  <label>Telefon</label>
                  <input type="tel" placeholder="06x xxx xxxx" required />
                </div>
                <div className="form-field">
                  <label>Poruka</label>
                  <textarea placeholder="Za koji pregled se javljate ili šta vas zanima?" rows={5} />
                </div>
                <button className="button button--primary" type="submit">
                  Pošalji upit →
                </button>
              </form>
            )}
          </div>

          {/* Map */}
          <div className="contact-map-wrap">
            <div className="contact-map">
              <iframe
                title="Lokacija ordinacije Raović"
                src="https://maps.google.com/maps?q=Golsvordijeva+6,+Beograd,+Srbija&output=embed&z=17"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="contact-map-footer">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>Golsvordijeva 6, Vračar · </span>
              <a href="https://maps.google.com/maps?q=Golsvordijeva+6,+Beograd" target="_blank" rel="noopener noreferrer">
                Otvori u Google Maps →
              </a>
            </div>
          </div>

        </div>

        {/* ── CTA ── */}
        <div className="cta-band">
          <div className="cta-band__text">
            <p className="eyebrow">Brže zakazivanje</p>
            <h2>Volite da zakažete odmah?</h2>
          </div>
          <div className="cta-band__action">
            <button className="button button--light" onClick={openBooking}>Zakažite pregled</button>
          </div>
        </div>

      </div>
    </div>
  );
}
