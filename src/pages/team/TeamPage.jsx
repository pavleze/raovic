import { TeamCard } from "../../shared/ui/TeamCard";
import { founders, associates, staff } from "../../shared/data/teamData";
import servicesBandBg from "../../assets/usluge-bg-soft.png";
import dnaPattern from "../../assets/dna-helix-pattern.svg";

export function TeamPage() {
  return (
    <div
      className="inner-page inner-page--tim"
      style={{
        "--doctor-card-bg": `url(${servicesBandBg})`,
        "--doctor-dna": `url(${dnaPattern})`,
      }}
    >
      <div className="site-shell inner-page__content">

        <section className="at-section">

          <div className="at-group">
            <h3 className="at-group__label">Osnivači</h3>
            <div className="at-grid at-grid--founders">
              {founders.map((d) => (
                <TeamCard key={d.name} {...d} accent panel />
              ))}
            </div>
          </div>

          <div className="at-group">
            <h3 className="at-group__label">Lekari specijalisti</h3>
            <div className="at-grid">
              {associates.map((d) => (
                <TeamCard key={d.name} {...d} panel />
              ))}
            </div>
          </div>

          <div className="at-group">
            <h3 className="at-group__label">Medicinsko osoblje</h3>
            <div className="at-grid">
              {staff.map((s) => (
                <TeamCard key={s.name} {...s} panel />
              ))}
            </div>
          </div>

          <div className="at-group at-group--associates">
            <h3 className="at-group__label">Stručni saradnici</h3>
            <div className="at-associates-panel">
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

      </div>
    </div>
  );
}
