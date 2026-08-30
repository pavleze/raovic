import { useState, useRef } from "react";

const SWIPE_THRESHOLD = 40;

export function ImageCarousel({ images, className = "" }) {
  const [active, setActive] = useState(0);
  const touchStartX = useRef(null);

  if (!images?.length) return null;

  const last = images.length - 1;
  const go = (i) => setActive(i < 0 ? last : i > last ? 0 : i);

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > SWIPE_THRESHOLD) go(active + (delta < 0 ? 1 : -1));
    touchStartX.current = null;
  };

  const single = images.length === 1;

  return (
    <div
      className={`gallery ${className}`}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") go(active - 1);
        if (e.key === "ArrowRight") go(active + 1);
      }}
      tabIndex={single ? -1 : 0}
      role="group"
      aria-roledescription="galerija"
      aria-label="Slike ordinacije"
    >
      <div className="gallery__viewport">
        <div
          className="gallery__track"
          style={{ transform: `translateX(-${active * 100}%)` }}
        >
          {images.map((img, i) => (
            <img
              key={img.src}
              className="gallery__img"
              src={img.src}
              alt={img.alt}
              loading={i === 0 ? "eager" : "lazy"}
              draggable={false}
            />
          ))}
        </div>
      </div>

      {!single && (
        <>
          <button
            type="button"
            className="gallery__nav gallery__nav--prev"
            onClick={() => go(active - 1)}
            aria-label="Prethodna slika"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            type="button"
            className="gallery__nav gallery__nav--next"
            onClick={() => go(active + 1)}
            aria-label="Sledeća slika"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          <div className="gallery__dots">
            {images.map((img, i) => (
              <button
                type="button"
                key={img.src}
                className={`gallery__dot${i === active ? " gallery__dot--active" : ""}`}
                onClick={() => go(i)}
                aria-label={`Slika ${i + 1}`}
                aria-current={i === active}
              />
            ))}
          </div>

          <div className="gallery__counter">
            {active + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  );
}
