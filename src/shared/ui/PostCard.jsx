export function PostCard({ article, catLabel, onClick }) {
  return (
    <article className="post-card post-card--text" onClick={onClick}>
      <div className="post-card__body">
        <span className="post-card__tag post-card__tag--inline">{catLabel}</span>
        <h3 className="post-card__title">{article.title}</h3>
        <p className="post-card__excerpt">{article.desc}</p>
        <span className="post-card__cta">Čitaj dalje →</span>
      </div>
    </article>
  );
}
