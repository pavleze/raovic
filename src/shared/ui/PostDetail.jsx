import { Link } from "react-router-dom";
import { articlePath, findArticle } from "../serviceRoutes";

function renderContent(content) {
  return content.map((block, i) => {
    if (block.startsWith("## ")) return <h3 key={i}>{block.slice(3)}</h3>;
    if (block.includes("\n")) {
      return (
        <ul key={i}>
          {block.split("\n").filter(Boolean).map((item, j) => (
            <li key={j}>{item.replace(/^[•\-]\s*/, "")}</li>
          ))}
        </ul>
      );
    }
    return <p key={i}>{block}</p>;
  });
}

export function PostDetail({ article, catLabel, hasBooking, onBack }) {
  const related = (article.related || [])
    .map(findArticle)
    .filter(Boolean)
    .map((r) => ({ article: r, path: articlePath(r) }));

  return (
    <div className="post-detail">
      <div className="site-shell post-detail__shell">
        <button className="post-detail__back" type="button" onClick={onBack}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          {catLabel || "Nazad"}
        </button>

        <div className="post-detail__layout">
          <article className="post-detail__content">
            <p className="post-detail__eyebrow">{catLabel}</p>
            <h1 className="post-detail__title">{article.title}</h1>
            {article.desc && <p className="post-detail__lead">{article.desc}</p>}
            <div className="post-detail__body">
              {renderContent(article.content)}
            </div>
            {related.length > 0 && (
              <div className="post-detail__related">
                <h3>Teme iz ove oblasti</h3>
                <ul>
                  {related.map((r) => (
                    <li key={r.path}>
                      <Link to={r.path}>{r.article.title}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {/* Druga imena pod kojima se usluga traži (HSG, spirala...), diskretno na dnu */}
            {article.aka?.length > 0 && (
              <p className="post-detail__aka">Drugi nazivi: {article.aka.join(", ")}</p>
            )}
          </article>

          <aside className="post-detail__aside">
            {hasBooking && (
              <div className="post-detail__cta-card">
                <h4>Zakažite pregled</h4>
                <p>Imate pitanja ili brige? Naš tim je tu za vas - pozovite nas.</p>
                <a className="post-detail__phone" href="tel:+381112447763">
                  011 244 77 63
                </a>
                <a className="post-detail__phone" href="tel:+38163687889">
                  063 687 889
                </a>
              </div>
            )}
            <div className="post-detail__why-card">
              <h4>Zašto izabrati ordinaciju Raović?</h4>
              <ul>
                <li>Više od 20 godina iskustva u ginekologiji i akušerstvu</li>
                <li>Savremena ultrazvučna dijagnostika najnovije generacije</li>
                <li>Individualan pristup - puna pažnja i plan prilagođen vama</li>
                <li>Privatnost i diskrecija u svakoj poseti</li>
                <li>Saradnja sa specijalistima kada je potrebna šira podrška</li>
              </ul>
            </div>
            <p className="post-detail__disclaimer">
              Tekstovi su informativnog karaktera i ne zamenjuju lekarsku konsultaciju.
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
}
