import { useState, useRef, useLayoutEffect, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { PageHeader } from "../../shared/ui/PageHeader";
import { useBooking } from "../../app/context/BookingContext";
import { serviceCategories } from "../../shared/data/servicesData";
import { blogArticles } from "../../shared/data/blogData";

// Članci iz Vodiča po naslovu (za tizer + "Pročitaj više")
const articleByTitle = new Map(blogArticles.map((a) => [a.title, a]));

export function ServicesPage() {
  const { openBooking } = useBooking();
  const [searchParams] = useSearchParams();
  const katParam = searchParams.get("kat");
  const validKat = serviceCategories.some((c) => c.id === katParam);
  const [activeId, setActiveId] = useState(validKat ? katParam : serviceCategories[0].id);
  const active = serviceCategories.find((c) => c.id === activeId);

  // Otvori kategoriju iz URL-a (npr. dropdown u headeru: /usluge?kat=trudnoca)
  useEffect(() => {
    if (validKat) setActiveId(katParam);
  }, [katParam, validKat]);

  const tabRefs = useRef({});
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  const moveIndicator = () => {
    const el = tabRefs.current[activeId];
    if (!el) return;
    const left = el.offsetLeft;
    const width = el.offsetWidth;
    // Ne menjaj stanje ako se nije promenilo (sprečava petlju re-rendera).
    setIndicator((prev) => (prev.left === left && prev.width === width ? prev : { left, width }));
  };

  useLayoutEffect(moveIndicator, [activeId]);
  useEffect(() => {
    const onResize = () => moveIndicator();
    window.addEventListener("resize", onResize);
    // Fontovi menjaju širinu tabova nakon učitavanja - ponovo izmeri.
    let cancelled = false;
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        if (!cancelled) moveIndicator();
      });
    }
    return () => {
      cancelled = true;
      window.removeEventListener("resize", onResize);
    };
  }, [activeId]);

  return (
    <div className="inner-page">
      <PageHeader
        className="page-header--usluge"
        eyebrow="Šta nudimo"
        title="Naše usluge"
        lead="Kompletna ginekološka zaštita u svim fazama ženskog života - od preventive do složenih dijagnostičkih procedura."
      />
      <div className="site-shell inner-page__content">

        {/* Horizontalni meni kategorija */}
        <div className="services-tabs" role="tablist" aria-label="Kategorije usluga">
          {serviceCategories.map((cat) => (
            <button
              key={cat.id}
              ref={(el) => (tabRefs.current[cat.id] = el)}
              role="tab"
              aria-selected={cat.id === activeId}
              className={`services-tab ${cat.id === activeId ? "services-tab--active" : ""}`}
              onClick={() => setActiveId(cat.id)}
            >
              {cat.label}
            </button>
          ))}
          <span
            className="services-tabs__indicator"
            style={{ left: indicator.left, width: indicator.width }}
          />
        </div>

        {/* Kartice pod-usluga za izabranu kategoriju */}
        <div className="services-list">
          {active.items.map((item) => {
            const article = articleByTitle.get(item.article || item.name);
            const teaser = item.teaser || article?.desc;
            const to = item.category
              ? `/vodic?kategorija=${item.category}`
              : article
                ? `/vodic?clanak=${encodeURIComponent(article.title)}`
                : null;
            return (
              <article className="service-item" key={item.name}>
                <div className="service-item__info">
                  <h3>{item.name}</h3>
                  {item.note && <span className="service-item__note">{item.note}</span>}
                  {teaser && <p className="service-item__teaser">{teaser}</p>}
                  {item.dur && (
                    <div className="service-item__meta">
                      <span className="service-item__dur">{item.dur}</span>
                    </div>
                  )}
                  {to && (
                    <Link className="service-item__more" to={to}>
                      Pročitaj više →
                    </Link>
                  )}
                </div>
                <button className="button button--primary button--sm" onClick={openBooking}>
                  Zakažite termin
                </button>
              </article>
            );
          })}
        </div>

      </div>
    </div>
  );
}
