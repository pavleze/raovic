export function PageHeader({ eyebrow, title, lead }) {
  return (
    <div className="page-header">
      <div className="site-shell page-header__inner">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {lead && <p className="page-header__lead">{lead}</p>}
      </div>
    </div>
  );
}
