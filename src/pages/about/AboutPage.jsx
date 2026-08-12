import { useBooking } from "../../app/context/BookingContext";
import { PageHeader } from "../../shared/ui/PageHeader";
import { TeamCard } from "../../shared/ui/TeamCard";
import { founders, associates, staff } from "../../shared/data/teamData";

const values = [
  {
    title: "Diskrecija i poverenje",
    text: "Svaka poseta je privatna stvar. Ambijent ordinacije i naš pristup osmišljeni su tako da se svaka pacijentkinja oseća bezbedno i zaštićeno.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
  {
    title: "Savremena dijagnostika",
    text: "Radimo sa najnovijom opremom za ultrazvuk, kolposkopiju i laboratorijsku dijagnostiku - jer tačna dijagnoza je osnova dobrog lečenja.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  },
  {
    title: "Individualan pristup",
    text: "Nema standardizovane rutine. Svaka žena je drugačija - u svim fazama života uzimamo vreme da razumemo njenu situaciju i pružimo pravu brigu.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    ),
  },
];

export function AboutPage() {
  const { openBooking } = useBooking();

  return (
    <div className="inner-page">
      <PageHeader
        eyebrow="Ginekološka ordinacija Raović"
        title="O nama"
        lead="Specijalistička ginekološko-akušerska ordinacija Raović smeštena u samom srcu Vračara, brine o Vašem zdravlju od 2004. godine."
      />
      <div className="site-shell inner-page__content">

        {/* ── Intro ── */}
        <section className="about-section">
          <div className="about-visual">
            <div className="about-card">
              <img src="/ordinacija.jpg" alt="Recepcija ordinacije Raović" className="about-card__img" />
            </div>
            <div className="about-tag">Privatna ordinacija · Vračar</div>
          </div>
          <div className="about-content">
            <p className="eyebrow">Ko smo mi</p>
            <h2>Dobrodošli u Ginekološku ordinaciju Raović</h2>
            <p>
              Naša ordinacija pruža potpunu ginekološku zaštitu i negu ženama u svim
              fazama života – od puberteta do menopauzalnog perioda. Pored toga, uspešno
              se bavimo lečenjem ženskog i muškog steriliteta, i pomažemo budućim
              roditeljima da planiraju trudnoću. Vodimo trudnoću od prvog trenutka,
              pa sve do postporođajnog perioda.
            </p>
            <p>
              Sa Vama ćemo proći kroz sve lepe, neizvesne i teške trenutke, jer su naši
              pacijenti stub ordinacije Raović.
            </p>
            <div className="about-features">
              <div className="about-feature">
                <span className="about-feature-dot" />
                <p>Više od 20 godina iskustva u ginekologiji i akušerstvu</p>
              </div>
              <div className="about-feature">
                <span className="about-feature-dot" />
                <p>9 lekara specijalista, uključujući profesora i docenta medicine</p>
              </div>
              <div className="about-feature">
                <span className="about-feature-dot" />
                <p>Saradnja sa nefrologom, kardiologom, hematologom i ostalim specijalistima</p>
              </div>
              <div className="about-feature">
                <span className="about-feature-dot" />
                <p>Golsvordijeva 6, Vračar - diskretan ambijent u srcu Beograda</p>
              </div>
            </div>
            <button className="button button--primary" onClick={openBooking}>Zakažite pregled</button>
          </div>
        </section>

        {/* ── Stats ── */}
        <section className="about-stats">
          {[
            { num: "20+", label: "godina iskustva" },
            { num: "9",   label: "lekara specijalista" },
            { num: "6",   label: "oblasti ginekologije" },
            { num: "100%", label: "privatnost" },
          ].map((s) => (
            <div className="about-stat" key={s.label}>
              <span className="about-stat__num">{s.num}</span>
              <span className="about-stat__label">{s.label}</span>
            </div>
          ))}
        </section>

        {/* ── Values ── */}
        <section className="about-values-section">
          <p className="eyebrow">Naš pristup</p>
          <h2 className="about-values-title">Zašto nas pacijentkinje biraju</h2>
          <div className="about-values-grid">
            {values.map((v) => (
              <article className="about-value" key={v.title}>
                <div className="about-value__icon">{v.icon}</div>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ── Team ── */}
        <section className="at-section">
          <p className="eyebrow">Stručni tim</p>
          <h2 className="at-section__title">Upoznajte naš tim</h2>

          <div className="at-group">
            <h3 className="at-group__label">Osnivači</h3>
            <div className="at-grid at-grid--founders">
              {founders.map((d) => (
                <TeamCard key={d.name} {...d} accent />
              ))}
            </div>
          </div>

          <div className="at-group">
            <h3 className="at-group__label">Lekari specijalisti</h3>
            <div className="at-grid">
              {associates.map((d) => (
                <TeamCard key={d.name} {...d} />
              ))}
            </div>
          </div>

          <div className="at-group">
            <h3 className="at-group__label">Medicinsko osoblje</h3>
            <div className="at-grid">
              {staff.map((s) => (
                <TeamCard key={s.name} {...s} />
              ))}
            </div>
          </div>

          <div className="at-group">
            <h3 className="at-group__label">Stručni saradnici</h3>
            <div className="at-associates-prose">
              <p>
                Ordinacija Raović neguje dugogodišnju saradnju sa istaknutim stručnjacima
                iz različitih medicinskih disciplina. Tim stručnih saradnika obuhvata
                profesore i docente Medicinskog fakulteta u Beogradu, kao i subspecijaliste
                iz oblasti uroginekologije, citologije i hirurgije ginekoloških karcinoma.
              </p>
              <p>
                Uz ginekološki tim, pacijentkinje imaju pristup i konsultantima iz nefrologije,
                endokrinologije, kardiologije, hematologije i radiologije - čime se obezbeđuje
                sveobuhvatna, multidisciplinarna briga na jednom mestu, bez potrebe za
                upućivanjem u drugi zdravstveni centar.
              </p>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <div className="cta-band">
          <div className="cta-band__text">
            <p className="eyebrow">Zakazivanje</p>
            <h2>Zakažite pregled danas.</h2>
          </div>
          <div className="cta-band__action">
            <button className="button button--light" onClick={openBooking}>Zakažite pregled</button>
          </div>
        </div>

      </div>
    </div>
  );
}

