import { PageHeader } from "../../shared/ui/PageHeader";
import { TeamCard } from "../../shared/ui/TeamCard";
import { useBooking } from "../../app/context/BookingContext";
import { founders, associates, staff } from "../../shared/data/teamData";

export function TeamPage() {
  const { openBooking } = useBooking();

  return (
    <div className="inner-page">
      <PageHeader
        eyebrow="Naši stručnjaci"
        title="Naš tim"
        lead="Iskusni specijalisti posvećeni tome da svaka poseta bude profesionalna, pažljiva i prijatna."
      />
      <div className="site-shell inner-page__content">

        <section className="at-section">

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

        <div className="cta-band">
          <div className="cta-band__text">
            <p className="eyebrow">Zakazivanje</p>
            <h2>Zakažite pregled kod naših specijalista.</h2>
          </div>
          <div className="cta-band__action">
            <button className="button button--light" onClick={openBooking}>Zakažite pregled</button>
          </div>
        </div>

      </div>
    </div>
  );
}
