import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

// Računar (miš) ne može da pozove broj, pa dugmad „Zakažite pregled“, „Pozovite nas“ i sl.
// tamo otvaraju ovaj prozor sa brojevima. Na telefonu tel: linkovi rade kao i do sada.
// Linkovi koji već prikazuju broj (npr. u podnožju) ostaju nepromenjeni.
const DESKTOP_QUERY = "(hover: hover) and (pointer: fine)";

export function PhoneDialog() {
  const [open, setOpen] = useState(false);
  const closeRef = useRef(null);
  const returnFocusRef = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      const link = e.target.closest?.('a[href^="tel:"]');
      if (!link || !window.matchMedia(DESKTOP_QUERY).matches) return;
      if (/\d{3}/.test(link.textContent)) return;
      e.preventDefault();
      returnFocusRef.current = link;
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
          <p>
            <span>Fiksni</span>
            <strong>011 244 77 63</strong>
          </p>
          <p>
            <span>Mobilni</span>
            <strong>063 687 889</strong>
          </p>
        </div>
        <p className="phone-dialog__hours">Pon - Pet: 08:00 - 20:00 · Subota: 08:00 - 14:00</p>
        <Link className="phone-dialog__link" to="/kontakt" onClick={() => setOpen(false)}>
          ili pošaljite upit putem forme
        </Link>
      </div>
    </div>
  );
}
