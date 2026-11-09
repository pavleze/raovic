import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { AppRoutes } from "./app/App";

export { getPageMeta, PRERENDER_ROUTES, SITE_URL } from "./app/pageMeta";
export { articleRoutes, categoryPath, serviceItemArticle, articlePath, slugify } from "./shared/serviceRoutes";
export { serviceCategories } from "./shared/data/servicesData";

// Pravi HTML stranice za datu adresu (koristi ga scripts/prerender.mjs pri build-u).
export function render(url) {
  return renderToString(
    <StaticRouter location={url}>
      <AppRoutes />
    </StaticRouter>
  );
}
