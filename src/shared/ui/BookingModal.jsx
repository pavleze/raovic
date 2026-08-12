import { useEffect, useRef, useState } from "react";
import { useBooking } from "../../app/context/BookingContext";

const services = [
  "Ginekološki pregled",
  "Trudnoća i akušerstvo",
  "4D ultrazvuk",
  "Ginekološke intervencije",
  "Endokrinologija",
  "Sterilitet",
  "Menopauza",
  "Nisam sigurna",
];

const doctors = [
  "Bilo koji dostupan",
  "Dr Slađana Raović",
  "Dr Zoran Raović",
];

const timeSlots = ["09:00", "10:30", "12:00", "14:00", "16:30", "18:00"];

const servicePrices = {
  "Ginekološki pregled":       { price: "4.000 RSD", dur: "15 min" },
  "Trudnoća i akušerstvo":     { price: "od 9.000 RSD", dur: "30 min" },
  "4D ultrazvuk":              { price: "10.000 RSD", dur: "30 min" },
  "Ginekološke intervencije":  { price: "od 6.500 RSD", dur: "15–45 min" },
  "Endokrinologija":           { price: "10.000 RSD", dur: "30 min" },
  "Sterilitet":                { price: "besplatna konsultacija", dur: "30 min" },
  "Menopauza":                 { price: "od 4.000 RSD", dur: "15 min" },
};

const initialForm = {
  service: "",
  doctor: "Bilo koji dostupan",
  date: "",
  time: "",
  name: "",
  phone: "",
};

export function BookingModal() {
  const { open, closeBooking } = useBooking();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const overlayRef = useRef(null);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && closeBooking();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, closeBooking]);

  useEffect(() => {
    if (!open) {
      setStep(1);
      setForm(initialForm);
      setSubmitted(false);
    }
  }, [open]);

  if (!open) return null;

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const canNext1 = form.service !== "";
  const canNext2 = form.date !== "" && form.time !== "";
  const canSubmit = form.name.trim() !== "" && form.phone.trim() !== "";

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(closeBooking, 2400);
  };

  return (
    <div
      className="booking-overlay"
      ref={overlayRef}
      onClick={(e) => e.target === overlayRef.current && closeBooking()}
      role="dialog"
      aria-modal="true"
      aria-label="Zakažite termin"
    >
      <div className="booking-modal">

        {/* Gradient header */}
        <div className="booking-modal__header">
          <div>
            <h2 className="booking-modal__title">Zakažite termin</h2>
            <p className="booking-modal__subtitle">Brzo, jednostavno i diskretno</p>
          </div>
          <button className="booking-modal__close" onClick={closeBooking} aria-label="Zatvori">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="booking-modal__body">

          {submitted ? (
            <div className="booking-success">
              <div className="booking-success__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h3>Upit je poslat!</h3>
              <p>Kontaktiraćemo vas na <strong>{form.phone}</strong> radi potvrde termina.</p>
            </div>
          ) : (
            <>
              {/* Progress pills */}
              <div className="booking-steps" aria-hidden="true">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={`booking-step-pill ${step >= s ? "booking-step-pill--active" : ""}`}
                  />
                ))}
              </div>

              {/* ── Step 1: Usluga + Lekar ── */}
              {step === 1 && (
                <div className="booking-step-body">
                  <div className="booking-form__field">
                    <label>Izaberite uslugu</label>
                    <select
                      value={form.service}
                      onChange={(e) => set("service", e.target.value)}
                    >
                      <option value="">Izaberite uslugu</option>
                      {services.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    {form.service && servicePrices[form.service] && (
                      <div className="booking-price-hint">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="8" x2="12" y2="8" strokeWidth="2.5" />
                          <line x1="12" y1="12" x2="12" y2="16" />
                        </svg>
                        <span>
                          Okvirna cena: <strong>{servicePrices[form.service].price}</strong>
                          <span className="booking-price-hint__dur"> · {servicePrices[form.service].dur}</span>
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="booking-form__field">
                    <label>Lekar <span>(opciono)</span></label>
                    <select
                      value={form.doctor}
                      onChange={(e) => set("doctor", e.target.value)}
                    >
                      {doctors.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* ── Step 2: Datum + Vreme ── */}
              {step === 2 && (
                <div className="booking-step-body">
                  <div className="booking-form__field">
                    <label>Datum</label>
                    <input
                      type="date"
                      value={form.date}
                      min={today}
                      onChange={(e) => set("date", e.target.value)}
                    />
                  </div>
                  <div className="booking-form__field">
                    <label>Vreme</label>
                    <div className="booking-times">
                      {timeSlots.map((t) => (
                        <button
                          key={t}
                          type="button"
                          className={`booking-time-slot ${form.time === t ? "booking-time-slot--selected" : ""}`}
                          onClick={() => set("time", t)}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── Step 3: Kontakt + Rezime ── */}
              {step === 3 && (
                <div className="booking-step-body">
                  <div className="booking-form__field">
                    <label>Ime i prezime</label>
                    <input
                      type="text"
                      placeholder="Vaše ime"
                      value={form.name}
                      onChange={(e) => set("name", e.target.value)}
                    />
                  </div>
                  <div className="booking-form__field">
                    <label>Telefon</label>
                    <input
                      type="tel"
                      placeholder="06x xxx xxxx"
                      value={form.phone}
                      onChange={(e) => set("phone", e.target.value)}
                    />
                  </div>
                  <div className="booking-summary">
                    <div className="booking-summary__row">
                      <strong>Usluga:</strong>
                      <span>{form.service}</span>
                    </div>
                    <div className="booking-summary__row">
                      <strong>Termin:</strong>
                      <span>{form.date} u {form.time}</span>
                    </div>
                    {servicePrices[form.service] && (
                      <div className="booking-summary__row booking-summary__row--price">
                        <strong>Cena:</strong>
                        <span>{servicePrices[form.service].price}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className={`booking-nav ${step === 1 ? "booking-nav--single" : ""}`}>
                {step > 1 && (
                  <button
                    type="button"
                    className="booking-nav__back"
                    onClick={() => setStep((s) => s - 1)}
                  >
                    ← Nazad
                  </button>
                )}
                {step < 3 ? (
                  <button
                    type="button"
                    className="booking-nav__next"
                    disabled={step === 1 ? !canNext1 : !canNext2}
                    onClick={() => setStep((s) => s + 1)}
                  >
                    Dalje →
                  </button>
                ) : (
                  <button
                    type="button"
                    className="booking-nav__submit"
                    disabled={!canSubmit}
                    onClick={handleSubmit}
                  >
                    Potvrdi termin ✓
                  </button>
                )}
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
