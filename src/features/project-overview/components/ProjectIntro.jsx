import { projectChecklist } from "../data/projectChecklist";
import { Button } from "../../../shared/ui/Button";

export function ProjectIntro() {
  return (
    <section className="hero-grid">
      <article className="hero-card">
        <p className="eyebrow">Struktura</p>
        <h2>Projekat je spreman za dalji razvoj bez mesanja odgovornosti.</h2>
        <p>
          Osnova je postavljena tako da lako dodajes nove page-ove, feature-e i
          reusable UI bez haoticnog rasta `src` foldera.
        </p>
        <div className="cta-row">
          <Button>Dodaj sledeci feature</Button>
          <Button variant="ghost">Uvedi router</Button>
        </div>
      </article>

      <aside className="status-card">
        <p className="eyebrow">Checklist</p>
        <strong>Sta je vec postavljeno</strong>
        <ul>
          {projectChecklist.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </aside>
    </section>
  );
}
