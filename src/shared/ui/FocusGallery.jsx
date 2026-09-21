import { useState, useRef } from "react";

const SWIPE_THRESHOLD = 40;

export function FocusGallery({ images, label = "Galerija ordinacije" }) {
  const [active, setActive] = useState(0);
  const touchStartX = useRef(null);

  if (!images?.length) return null;

  const n = images.length;
  const go = (i) => setActive(((i % n) + n) % n);
  const prev = (active - 1 + n) % n;
  const next = (active + 1) % n;

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > SWIPE_THRESHOLD) go(active + (delta < 0 ? 1 : -1));
    touchStartX.current = null;
  };

  const slide = (index, role) => {
    const img = images[index];
    const isCenter = role === "center";

    const inner = (
      <img
        src={img.src}
        alt={isCenter ? img.alt : ""}
        loading={isCenter ? "eager" : "lazy"}
        draggable={false}
      />
    );

    if (isCenter) {
      return (
        <div
          key={`${role}-${img.src}`}
          className="focus-gallery__slide focus-gallery__slide--center is-active"
        >
          {inner}
        </div>
      );
    }

    return (
      <button
        key={`${role}-${img.src}`}
        type="button"
        className={`focus-gallery__slide focus-gallery__slide--${role}`}
        onClick={() => go(index)}
        aria-label={`Prikaži: ${img.alt}`}
      >
        {inner}
      </button>
    );
  };

  return (
    <div
      className="focus-gallery"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") go(active - 1);
        if (e.key === "ArrowRight") go(active + 1);
      }}
      tabIndex={0}
      role="group"
      aria-roledescription="galerija"
      aria-label={label}
    >
      <button
        type="button"
        className="focus-gallery__nav focus-gallery__nav--prev"
        onClick={() => go(active - 1)}
        aria-label="Prethodna slika"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <div className="focus-gallery__stage">
        {slide(prev, "prev")}
        {slide(active, "center")}
        {slide(next, "next")}
      </div>

      <button
        type="button"
        className="focus-gallery__nav focus-gallery__nav--next"
        onClick={() => go(active + 1)}
        aria-label="Sledeća slika"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>
  );
}
