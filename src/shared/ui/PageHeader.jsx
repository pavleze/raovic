export function PageHeader({ eyebrow, title, lead, className = "" }) {
  return (
    <div className={`page-header ${className}`}>
      <div className="site-shell page-header__inner">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {lead && <p className="page-header__lead">{lead}</p>}
      </div>
    </div>
  );
}
