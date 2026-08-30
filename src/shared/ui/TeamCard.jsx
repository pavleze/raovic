export function TeamCard({ name, role, initials, accent, photo, photoFocus, photoZoom }) {
  return (
    <article
      className={`at-card${accent ? " at-card--accent" : ""}${photo ? " at-card--photo" : ""}`}
    >
      <div className={`at-card__avatar${photo ? " at-card__avatar--photo" : ""}`}>
        {photo ? (
          <img
            src={photo}
            alt={name}
            loading="lazy"
            style={{
              objectPosition: photoFocus,
              transform: photoZoom ? `scale(${photoZoom})` : undefined,
            }}
          />
        ) : (
          <span>{initials}</span>
        )}
      </div>
      <div className="at-card__body">
        <h4 className="at-card__name">{name}</h4>
        <p className="at-card__role">{role}</p>
      </div>
    </article>
  );
}
