export function TeamCard({
  name,
  role,
  initials,
  accent,
  photo,
  photoFocus,
  photoZoom,
  photoShift,
  photoOrigin,
  cutout,
  backgroundPhoto,
  panel,
}) {
  return (
    <article
      className={`at-card${accent ? " at-card--accent" : ""}${
        photo ? " at-card--photo" : ""
      }${panel ? " at-card--panel" : ""}`}
    >
      <div
        className={`at-card__avatar${photo ? " at-card__avatar--photo" : ""}${
          cutout ? " at-card__avatar--cutout" : ""
        }${backgroundPhoto ? " at-card__avatar--bg" : ""}`}
        style={
          backgroundPhoto
            ? {
                backgroundImage: `url(${backgroundPhoto})`,
                backgroundSize: "cover",
                backgroundPosition: photoFocus || "center 22%",
              }
            : undefined
        }
      >
        {photo ? (
          <img
            src={photo}
            alt={name}
            loading="lazy"
            style={{
              objectPosition: cutout ? undefined : photoFocus,
              transformOrigin: photoOrigin || (cutout ? "center bottom" : "center center"),
              "--photo-zoom": photoZoom ?? 1,
              "--photo-shift": photoShift || "0%",
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
