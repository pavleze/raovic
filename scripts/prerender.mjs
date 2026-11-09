// Posle build-a pravi gotov HTML za svaku stranicu (naslov, opis, adresa i ceo sadržaj),
// da Google i društvene mreže odmah vide pravu stranicu, a ne prazan okvir koji popunjava JavaScript.
// /usluge -> dist/usluge.html, / -> dist/index.html. .htaccess i vercel.json ih služe na čistim adresama.
import { readFile, writeFile, rm } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";

const DIST = fileURLToPath(new URL("../dist/", import.meta.url));
const SSR = fileURLToPath(new URL("../dist-ssr/", import.meta.url));

const { render, PAGES, SITE_URL } = await import(pathToFileURL(SSR + "entry-server.js").href);
const template = await readFile(DIST + "index.html", "utf8");

const escapeAttr = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const escapeText = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

function setAttr(html, pattern, value) {
  if (!pattern.test(html)) throw new Error(`Nije pronađen tag: ${pattern}`);
  return html.replace(pattern, (_, before) => `${before}"${escapeAttr(value)}"`);
}

for (const [route, page] of Object.entries(PAGES)) {
  const url = SITE_URL + route;
  let html = template.replace(/<title>[^<]*<\/title>/, `<title>${escapeText(page.title)}</title>`);
  html = setAttr(html, /(<meta name="description" content=)"[^"]*"/, page.description);
  html = setAttr(html, /(<link rel="canonical" href=)"[^"]*"/, url);
  html = setAttr(html, /(<meta property="og:title" content=)"[^"]*"/, page.title);
  html = setAttr(html, /(<meta property="og:description" content=)"[^"]*"/, page.description);
  html = setAttr(html, /(<meta property="og:url" content=)"[^"]*"/, url);

  const body = render(route);
  if (!html.includes('<div id="root"></div>')) throw new Error("Nije pronađen <div id=\"root\">");
  html = html.replace('<div id="root"></div>', `<div id="root">${body}</div>`);

  const file = route === "/" ? "index.html" : `${route.slice(1)}.html`;
  await writeFile(DIST + file, html);
  console.log(`Prerender: ${route} -> dist/${file} (${Math.round(html.length / 1024)} KB)`);
}

await rm(SSR, { recursive: true, force: true });
