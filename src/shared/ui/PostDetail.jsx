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

export function PostDetail({ article, catLabel, catGradient, catIcon, hasBooking, onBack, onBooking }) {
  return (
    <div className="post-detail">
      <div className="post-detail__hero" style={{ background: "linear-gradient(135deg, #b09cd6 0%, #9c85c9 100%)" }}>
        <div className="post-detail__hero-deco" />
        <div className="site-shell">
          <button className="post-detail__back" onClick={onBack}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            {catLabel}
          </button>
          <div className="post-detail__hero-icon" aria-hidden="true">{catIcon}</div>
          <h1 className="post-detail__title">{article.title}</h1>
        </div>
      </div>

      <div className="post-detail__wrap">
        <div className="site-shell">
          <div className="post-detail__layout">
            <div className="post-detail__content">
              {renderContent(article.content)}
            </div>
            <aside className="post-detail__aside">
              {hasBooking && (
                <div className="post-detail__cta-card">
                  <h4>Zakažite pregled</h4>
                  <p>Imate pitanja ili brige? Naš tim je tu za vas - zakažite konsultaciju.</p>
                  <button className="button button--light" onClick={onBooking}>
                    Zakažite pregled
                  </button>
                </div>
              )}
              <p className="post-detail__disclaimer">
                Tekstovi su informativnog karaktera i ne zamenjuju lekarsku konsultaciju.
              </p>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
