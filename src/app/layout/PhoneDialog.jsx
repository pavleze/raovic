import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

// Dugmad „Zakažite pregled“, „Pozovite nas“, slušalica i sl. otvaraju ovaj prozor da se
// izabere broj (fiksni ili mobilni). Na telefonu se broj dodirne i poziva; na računaru,
// koji ne može da pozove, brojevi su samo ispisani.
// Linkovi koji već prikazuju broj (npr. u podnožju) ostaju obični pozivi.
const DESKTOP_QUERY = "(hover: hover) and (pointer: fine)";

const NUMBERS = [
  { label: "Fiksni", text: "011 244 77 63", href: "tel:+381112447763" },
  { label: "Mobilni", text: "063 687 889", href: "tel:+38163687889" },
];

export function PhoneDialog() {
  const [open, setOpen] = useState(false);
  const [canCall, setCanCall] = useState(false);
  const closeRef = useRef(null);
  const returnFocusRef = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      const link = e.target.closest?.('a[href^="tel:"]');
      if (!link || /\d{3}/.test(link.textContent)) return;
      e.preventDefault();
      returnFocusRef.current = link;
      setCanCall(!window.matchMedia(DESKTOP_QUERY).matches);
      setOpen(true);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      returnFocusRef.current?.focus();
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="phone-dialog" onClick={() => setOpen(false)}>
      <div
        className="phone-dialog__box"
        role="dialog"
        aria-modal="true"
        aria-labelledby="phone-dialog-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeRef}
          type="button"
          className="phone-dialog__close"
          aria-label="Zatvori"
          onClick={() => setOpen(false)}
        >
          ×
        </button>
        <h2 id="phone-dialog-title">Zakažite pregled telefonom</h2>
        <div className="phone-dialog__numbers">
          {NUMBERS.map(({ label, text, href }) =>
            canCall ? (
              <a key={href} className="phone-dialog__number" href={href}>
                <span>{label}</span>
                <strong>{text}</strong>
              </a>
            ) : (
              <p key={href} className="phone-dialog__number">
                <span>{label}</span>
                <strong>{text}</strong>
              </p>
            )
          )}
        </div>
        {canCall && <p className="phone-dialog__hint">Dodirnite broj da pozovete.</p>}
        <p className="phone-dialog__hours">Pon - Pet: 08:00 - 20:00 · Subota: 08:00 - 14:00</p>
        <Link className="phone-dialog__link" to="/kontakt" onClick={() => setOpen(false)}>
          ili pošaljite upit putem forme
        </Link>
      </div>
    </div>
  );
}
