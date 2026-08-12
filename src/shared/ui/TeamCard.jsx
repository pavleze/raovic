export function TeamCard({ name, role, initials, accent }) {
  return (
    <article className={`at-card${accent ? " at-card--accent" : ""}`}>
      <div className="at-card__avatar">
        <span>{initials}</span>
      </div>
      <div className="at-card__body">
        <h4 className="at-card__name">{name}</h4>
        <p className="at-card__role">{role}</p>
        <span className="at-card__link">Saznaj više →</span>
      </div>
    </article>
  );
}
