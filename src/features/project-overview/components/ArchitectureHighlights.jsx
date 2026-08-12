import { architectureLayers } from "../data/architectureLayers";

export function ArchitectureHighlights() {
  return (
    <section className="feature-grid">
      {architectureLayers.map((layer) => (
        <article className="feature-card" key={layer.title}>
          <p className="eyebrow">{layer.label}</p>
          <h3>{layer.title}</h3>
          <p>{layer.description}</p>
        </article>
      ))}
    </section>
  );
}
