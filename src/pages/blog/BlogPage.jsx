import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { blogCategories, blogArticles } from "../../shared/data/blogData";
import { serviceCategories } from "../../shared/data/servicesData";
import { PostCard } from "../../shared/ui/PostCard";
import { PostDetail } from "../../shared/ui/PostDetail";

// Naslovi članaka koji zaista imaju uslugu za zakazivanje (Usluge → article/name).
// Samo ti članci prikazuju "Zakažite pregled"; ostali su čisto edukativni.
const bookableArticleTitles = new Set(
  serviceCategories.flatMap((c) => c.items.map((it) => it.article || it.name))
);

/* ── Per-category visual config ────────────────────────────── */
const catConfig = {
  ginekologija: {
    image: "/images/usluge/ginekologija.jpg",
    gradient: "linear-gradient(140deg, #50256b 0%, #7a3a96 100%)",
    desc: "Grana medicine koja se bavi proučavanjem ženskog reproduktivnog sistema, njegovim bolestima, lečenjem i prevencijom.",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="32" cy="22" r="14"/>
        <line x1="32" y1="36" x2="32" y2="56"/>
        <line x1="22" y1="48" x2="42" y2="48"/>
      </svg>
    ),
  },
  intervencije: {
    image: "/images/usluge/intervencije.webp",
    gradient: "linear-gradient(140deg, #bf1f6f 0%, #e0478e 100%)",
    desc: "Manji hirurški poduhvati koje je obično moguće uraditi u ambulantnim uslovima.",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 52L32 12l20 40"/>
        <path d="M19 38h26"/>
        <circle cx="32" cy="20" r="3" fill="white" stroke="none"/>
      </svg>
    ),
  },
  trudnoca: {
    image: "/images/usluge/trudnoca.jpg",
    gradient: "linear-gradient(140deg, #8e568f 0%, #b07ab1 100%)",
    desc: "Praćenje i kontrola trudnoće - briga kako o trudnici tako i o fetusu, kroz sve faze gestacije.",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="32" cy="36" rx="14" ry="18"/>
        <circle cx="32" cy="16" r="7"/>
        <path d="M24 42 Q32 50 40 42"/>
      </svg>
    ),
  },
  endokrinologija: {
    image: "/images/vodic/endokrinologija.jpg",
    gradient: "linear-gradient(140deg, #3a1050 0%, #7a3a96 100%)",
    desc: "Poremećaji u radu žlezda sa unutrašnjim lučenjem i oboljenja koja nastaju kao njihova posledica.",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="32" cy="32" r="10"/>
        <line x1="32" y1="6" x2="32" y2="14"/>
        <line x1="32" y1="50" x2="32" y2="58"/>
        <line x1="6" y1="32" x2="14" y2="32"/>
        <line x1="50" y1="32" x2="58" y2="32"/>
        <line x1="13.4" y1="13.4" x2="19.2" y2="19.2"/>
        <line x1="44.8" y1="44.8" x2="50.6" y2="50.6"/>
        <line x1="50.6" y1="13.4" x2="44.8" y2="19.2"/>
        <line x1="19.2" y1="44.8" x2="13.4" y2="50.6"/>
      </svg>
    ),
  },
  sterilitet: {
    gradient: "linear-gradient(140deg, #bf1f6f 0%, #8e568f 100%)",
    desc: "Sterilitet kod žena može biti primarni i sekundarni - obrada, savetovanje i lečenje parova.",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="22" cy="28" r="10"/>
        <circle cx="42" cy="28" r="10"/>
        <path d="M22 38 Q32 54 42 38"/>
      </svg>
    ),
  },
  menopauza: {
    gradient: "linear-gradient(140deg, #8e568f 0%, #bf1f6f 100%)",
    desc: "Klimaks - period značajnih hormonskih promena koji najčešće počinje između 48. i 50. godine.",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 44 Q18 28 26 44 Q34 60 42 44 Q50 28 54 38"/>
        <circle cx="32" cy="18" r="10"/>
        <line x1="32" y1="6" x2="32" y2="10"/>
        <line x1="44" y1="10" x2="41" y2="13"/>
        <line x1="20" y1="10" x2="23" y2="13"/>
      </svg>
    ),
  },
};

/* ── Main page ──────────────────────────────────────────────── */
export function BlogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const clanak = searchParams.get("clanak");
  const kategorija = searchParams.get("kategorija");

  // Stanje se u potpunosti izvodi iz URL-a (da "Vodič" u meniju uvek vrati na galeriju)
  const selectedArticle = clanak
    ? blogArticles.find((a) => a.title === clanak) || null
    : null;
  const selectedCategory = selectedArticle
    ? selectedArticle.category
    : kategorija && blogCategories.some((c) => c.id === kategorija)
      ? kategorija
      : null;

  const displayCategories = blogCategories.filter((c) => c.id !== "sve");
  const currentCat = displayCategories.find((c) => c.id === selectedCategory);
  const articles = selectedCategory
    ? blogArticles.filter((a) => a.category === selectedCategory)
    : [];

  const openCategory = (id) => setSearchParams({ kategorija: id });
  const closeCategory = () => setSearchParams({});
  const openArticle = (article) => setSearchParams({ clanak: article.title });
  const closeArticle = () =>
    setSearchParams(selectedCategory ? { kategorija: selectedCategory } : {});

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [clanak, kategorija]);

  return (
    <div className="edu-page">

      {selectedCategory === null ? (
        /* ── Category gallery ──────────────────────────── */
        <>
          <div className="edu-hero">
            <div className="site-shell">
              <p className="eyebrow">Edukativni sadržaj</p>
              <h1>Vodič</h1>
              <p className="edu-hero__lead">
                Stručni tekstovi o ginekologiji, trudnoći, endokrinologiji i svim
                aspektima ženskog zdravlja. Odaberite oblast koja vas zanima.
              </p>
            </div>
          </div>

          <section className="edu-categories">
            <div className="site-shell">
              <div className="edu-cat-grid">
                {displayCategories.map((cat) => {
                  const cfg = catConfig[cat.id];
                  const count = blogArticles.filter((a) => a.category === cat.id).length;
                  return (
                    <button
                      key={cat.id}
                      className="edu-cat-card"
                      onClick={() => openCategory(cat.id)}
                    >
                      <div className="edu-cat-card__image" style={{ background: cfg.gradient }}>
                        {cfg.image && (
                          <img className="edu-cat-card__img" src={cfg.image} alt="" loading="lazy" />
                        )}
                      </div>
                      <div className="edu-cat-card__body">
                        <span className="edu-cat-card__name">{cat.label}</span>
                        {cfg.desc && <p className="edu-cat-card__desc">{cfg.desc}</p>}
                        <span className="edu-cat-card__count">{count} članaka</span>
                        <span className="edu-cat-card__cta">Pogledaj →</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        </>

      ) : selectedArticle ? (
        /* ── Article detail (blog post view) ──────────── */
        <PostDetail
          article={selectedArticle}
          catLabel={currentCat?.label}
          catGradient={catConfig[selectedCategory]?.gradient}
          catIcon={catConfig[selectedCategory]?.icon}
          hasBooking={bookableArticleTitles.has(selectedArticle.title)}
          onBack={closeArticle}
        />

      ) : (
        /* ── Article list (blog post cards) ───────────── */
        <>
          <div
            className="edu-cat-hero"
            style={
              catConfig[selectedCategory]?.image
                ? {
                    backgroundImage: `linear-gradient(105deg, rgba(80,37,107,0.8) 0%, rgba(176,156,214,0.45) 100%), url(${catConfig[selectedCategory].image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }
                : { background: catConfig[selectedCategory]?.gradient }
            }
          >
            <div className="site-shell">
              <button className="edu-back" onClick={closeCategory}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
                Vodič
              </button>
              <h1 className="edu-cat-hero__title">{currentCat?.label}</h1>
              <p className="edu-cat-hero__count">{articles.length} stručnih tekstova</p>
            </div>
          </div>

          <section className="edu-articles">
            <div className="site-shell">
              <div className="post-card-grid">
                {articles.map((article) => (
                  <PostCard
                    key={article.title}
                    article={article}
                    catGradient={catConfig[selectedCategory]?.gradient}
                    catIcon={catConfig[selectedCategory]?.icon}
                    catLabel={currentCat?.label}
                    onClick={() => openArticle(article)}
                  />
                ))}
              </div>
            </div>
          </section>
        </>
      )}

    </div>
  );
}
