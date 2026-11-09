import { useEffect } from "react";
import { Link, Navigate, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { serviceCategories } from "../../shared/data/servicesData";
import { blogCategories } from "../../shared/data/blogData";
import { PostDetail } from "../../shared/ui/PostDetail";
import mamaHero from "../../assets/beba-i-mama-hero.webp";
import heroNova from "../../assets/hero-nova.webp";
import drugoPitanje from "../../assets/drugo-pitanje.webp";
import trecePitanje from "../../assets/3pitanje.webp";

import {
  articleRoutes,
  articleCategoryId,
  articlePath,
  categoryPath,
  findArticle,
  findCategory,
  serviceItemArticle,
} from "../../shared/serviceRoutes";

const blogCatLabel = new Map(blogCategories.map((c) => [c.id, c.label]));

const PHONE_HREF = "tel:+381112447763";

function serviceArticleHref(item) {
  const article = serviceItemArticle(item);
  return article ? articlePath(article) : null;
}

const CATEGORY_ICONS = {
  ginekologija: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="5" />
      <line x1="12" y1="13" x2="12" y2="21" />
      <line x1="9" y1="18" x2="15" y2="18" />
    </svg>
  ),
  trudnoca: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  ),
  intervencije: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
      <line x1="11" y1="8" x2="11" y2="14" />
      <line x1="8" y1="11" x2="14" y2="11" />
    </svg>
  ),
  sterilitet: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  konsultativni: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  ),
};

export function ServicesPage() {
  const { kat: katParam, clanak: clanakParam } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const category = katParam ? findCategory(katParam) : null;
  const active = category ?? serviceCategories[0];
  const selectedArticle = clanakParam ? findArticle(clanakParam) : null;

  // Stari linkovi /usluge?kat=...&clanak=... -> nove adrese /usluge/kategorija/clanak
  const legacyKat = searchParams.get("kat");
  const legacyArticle = findArticle(searchParams.get("clanak"));
  const legacyTarget = legacyArticle
    ? articlePath(legacyArticle)
    : findCategory(legacyKat)
      ? categoryPath(legacyKat)
      : null;

  useEffect(() => {
    if (legacyTarget) return;
    if (clanakParam) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (!katParam) return;
    const el = document.getElementById("usluge-lista");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [katParam, clanakParam, legacyTarget]);

  if (legacyTarget) return <Navigate to={legacyTarget} replace />;

  // Nepostojeća kategorija ili članak -> Usluge
  if ((katParam && !category) || (clanakParam && !selectedArticle)) {
    return <Navigate to="/usluge" replace />;
  }

  // Članak uvek na svojoj jednoj adresi (npr. ako je kategorija u linku pogrešna)
  if (selectedArticle && articleCategoryId(selectedArticle) !== katParam) {
    return <Navigate to={articlePath(selectedArticle)} replace />;
  }

  if (selectedArticle) {
    const backKat = katParam;

    return (
      <div className="inner-page inner-page--usluge">
        <div className="site-shell inner-page__content">
          <PostDetail
            article={selectedArticle}
            catLabel={blogCatLabel.get(selectedArticle.category) || active.label}
            hasBooking
            onBack={() => navigate(categoryPath(backKat))}
          />
        </div>
      </div>
    );
  }

  // Svi članci kategorije, da svaki ima link sa sajta (i za Google)
  const categoryArticles = articleRoutes.filter(({ path }) => path.startsWith(`${categoryPath(active.id)}/`));

  return (
    <div className="inner-page inner-page--usluge">
      <div className="site-shell inner-page__content">
        <div className="services-catalog">
          {serviceCategories.map((cat) => (
            <Link
              key={cat.id}
              className={`services-catalog__card${active?.id === cat.id ? " is-active" : ""}`}
              to={categoryPath(cat.id)}
            >
              <div className="services-catalog__icon" aria-hidden="true">
                {CATEGORY_ICONS[cat.id]}
              </div>
              <h2>{cat.label}</h2>
            </Link>
          ))}
        </div>

        <div className="services-layout">
          <aside className="services-sidebar">
            <div className="services-hours">
              <div className="services-hours__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" />
                  <polyline points="12 7 12 12 15.5 14" />
                </svg>
              </div>
              <h3>Radno vreme</h3>
              <ul className="services-hours__list">
                <li>Ponedeljak - Petak: 08 do 20h</li>
                <li>Subota: 08 do 14h</li>
                <li>Nedelja: zatvoreno</li>
              </ul>
              <Link className="services-hours__cta" to="/kontakt">
                Kontaktirajte nas
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="13 6 19 12 13 18" />
                </svg>
              </Link>
            </div>
            <div className="services-sidebar__photo">
              <img src={mamaHero} alt="" />
              <div className="services-sidebar__photo-text">
                <span>3 PITANJA</span>
                <p>koja najčešće dobijamo</p>
              </div>
            </div>
            <div className="services-sidebar__photo services-sidebar__photo--faq">
              <img src={heroNova} alt="" />
              <div className="services-sidebar__photo-text">
                <span>„Koliko često treba ići na ginekološki pregled?“</span>
                <p>
                  Preporučuje se i bez tegoba. Učestalost zavisi od uzrasta, zdravlja i saveta ginekologa.
                </p>
              </div>
            </div>
            <div className="services-sidebar__photo services-sidebar__photo--faq services-sidebar__photo--wide">
              <img src={drugoPitanje} alt="" />
              <div className="services-sidebar__photo-text">
                <span>„Da li je normalno imati bol tokom menstruacije?“</span>
                <p>
                  Blagi grčevi su uobičajeni, ali jak ili sve jači bol koji ometa svakodnevne aktivnosti
                  ne treba ignorisati - uzrok utvrđuje ginekološki pregled.
                </p>
              </div>
            </div>
            <div className="services-sidebar__photo services-sidebar__photo--faq services-sidebar__photo--wide">
              <img src={trecePitanje} alt="" />
              <div className="services-sidebar__photo-text">
                <span>„Kada je pravo vreme za prvi ginekološki pregled?“</span>
                <p>
                  Nije vezan samo za godine. Ide se kad ima tegoba, pitanja ili potrebe za savetom
                  o menstruaciji, kontracepciji, seksualnom zdravlju ili planiranju trudnoće.
                </p>
              </div>
            </div>
          </aside>

          <div className="services-layout__main">
            {active && (
              <section className="services-detail" id="usluge-lista" aria-label={active.label}>
                <div className="services-detail__head">
                  <h2>{active.label}</h2>
                </div>
                <div className="services-list">
                  {active.items.map((item, index) => {
                    const article = serviceItemArticle(item);
                    const teaser = item.teaser || article?.desc || "";
                    const short =
                      teaser.length > 140 ? `${teaser.slice(0, 137).trim()}…` : teaser;
                    const to = serviceArticleHref(item);
                    return (
                      <article className="service-item" key={item.name}>
                        <div className="service-item__top">
                          <span className="service-item__num" aria-hidden="true">
                            {index + 1}
                          </span>
                          <h3>{item.name}</h3>
                        </div>
                        {short && <p className="service-item__teaser">{short}</p>}
                        <div className="service-item__actions">
                          {to ? (
                            <Link className="service-item__more" to={to}>
                              Pročitaj više
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <line x1="5" y1="12" x2="19" y2="12" />
                                <polyline points="13 6 19 12 13 18" />
                              </svg>
                            </Link>
                          ) : (
                            <a className="service-item__more" href={PHONE_HREF}>
                              Zakažite termin
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <line x1="5" y1="12" x2="19" y2="12" />
                                <polyline points="13 6 19 12 13 18" />
                              </svg>
                            </a>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
                {categoryArticles.length > 0 && (
                  <div className="services-articles">
                    <h3>Članci iz oblasti: {active.label}</h3>
                    <ul>
                      {categoryArticles.map(({ article, path }) => (
                        <li key={path}>
                          <Link to={path}>{article.title}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
