import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { AppRoutes } from "./app/App";

export { PAGES, SITE_URL } from "./app/pageMeta";

// Pravi HTML stranice za datu adresu (koristi ga scripts/prerender.mjs pri build-u).
export function render(url) {
  return renderToString(
    <StaticRouter location={url}>
      <AppRoutes />
    </StaticRouter>
  );
}
