// Posle build-a pravi gotov HTML za svaku stranicu (naslov, opis, adresa i ceo sadržaj),
// da Google i društvene mreže odmah vide pravu stranicu, a ne prazan okvir koji popunjava JavaScript.
// /usluge -> dist/usluge.html, /usluge/intervencije -> dist/usluge/intervencije.html, / -> dist/index.html.
// .htaccess i vercel.json ih služe na čistim adresama. Pravi i dist/sitemap.xml sa svim stranicama.
import { mkdir, readFile, writeFile, rm } from "node:fs/promises";
import { dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const DIST = fileURLToPath(new URL("../dist/", import.meta.url));
const SSR = fileURLToPath(new URL("../dist-ssr/", import.meta.url));

const {
  render,
  getPageMeta,
  PRERENDER_ROUTES,
  SITE_URL,
  articleRoutes,
  articlePath,
  categoryPath,
  serviceCategories,
  serviceItemArticle,
  slugify,
  founders,
  associates,
  staff,
} = await import(pathToFileURL(SSR + "entry-server.js").href);
const template = await readFile(DIST + "index.html", "utf8");

const escapeAttr = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const escapeText = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

function setAttr(html, pattern, value) {
  if (!pattern.test(html)) throw new Error(`Nije pronađen tag: ${pattern}`);
  return html.replace(pattern, (_, before) => `${before}"${escapeAttr(value)}"`);
}

// Strukturirani podaci (schema.org) za Google: putanja (breadcrumbs), stranica usluge/članka, tim.
const CLINIC = { "@id": `${SITE_URL}/#ordinacija` };
const crumb = (items) => ({
  "@type": "BreadcrumbList",
  itemListElement: items.map(([name, path], i) => ({
    "@type": "ListItem",
    position: i + 1,
    name,
    item: SITE_URL + path,
  })),
});

function structuredData(page) {
  const url = SITE_URL + page.path;
  if (page.kind === "category") {
    return [
      crumb([["Početna", "/"], ["Usluge", "/usluge"], [page.category.label, page.path]]),
      {
        "@type": "MedicalWebPage",
        url,
        name: page.title,
        description: page.description,
        inLanguage: "sr",
        specialty: "Gynecologic",
        publisher: CLINIC,
      },
    ];
  }
  if (page.kind === "article") {
    return [
      crumb([
        ["Početna", "/"],
        ["Usluge", "/usluge"],
        [page.category.label, categoryPath(page.category.id)],
        [page.article.title, page.path],
      ]),
      {
        "@type": "MedicalWebPage",
        url,
        name: page.article.title,
        headline: page.article.title,
        description: page.description,
        inLanguage: "sr",
        specialty: "Gynecologic",
        publisher: CLINIC,
        about: { "@type": "MedicalEntity", name: page.article.title },
      },
    ];
  }
  if (page.path === "/tim") {
    const people = [...founders, ...associates, ...staff].map((p) => ({
      "@type": "Person",
      name: p.name,
      jobTitle: p.role.replace(/\s*\n\s*/g, ", "),
      worksFor: CLINIC,
    }));
    return [crumb([["Početna", "/"], ["Tim", "/tim"]]), { "@type": "ItemList", itemListElement: people.map((item, i) => ({ "@type": "ListItem", position: i + 1, item })) }];
  }
  if (page.path !== "/") {
    return [crumb([["Početna", "/"], [page.title.split(" | ")[0], page.path]])];
  }
  // Početna: sve usluge ordinacije (Google i AI pretraga znaju šta se tačno radi)
  return [
    {
      ...CLINIC,
      "@type": "MedicalClinic",
      availableService: articleRoutes.map(({ article, path }) => ({
        "@type": "MedicalProcedure",
        name: article.seoTitle || article.title,
        ...(article.aka?.length ? { alternateName: article.aka } : {}),
        url: SITE_URL + path,
      })),
    },
  ];
}

const jsonLdTag = (data) =>
  `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": data }).replace(/</g, "\\u003c")}</script>`;

for (const route of PRERENDER_ROUTES) {
  const page = getPageMeta(route);
  if (page.path !== route) throw new Error(`Nema podataka za stranicu ${route}`);
  const url = SITE_URL + route;
  let html = template.replace(/<title>[^<]*<\/title>/, `<title>${escapeText(page.title)}</title>`);
  html = setAttr(html, /(<meta name="description" content=)"[^"]*"/, page.description);
  html = setAttr(html, /(<link rel="canonical" href=)"[^"]*"/, url);
  html = setAttr(html, /(<meta property="og:title" content=)"[^"]*"/, page.title);
  html = setAttr(html, /(<meta property="og:description" content=)"[^"]*"/, page.description);
  html = setAttr(html, /(<meta property="og:url" content=)"[^"]*"/, url);

  const schema = structuredData(page);
  if (schema.length) html = html.replace("</head>", `    ${jsonLdTag(schema)}\n  </head>`);

  const body = render(route);
  if (!html.includes('<div id="root"></div>')) throw new Error("Nije pronađen <div id=\"root\">");
  html = html.replace('<div id="root"></div>', `<div id="root">${body}</div>`);

  const file = route === "/" ? "index.html" : `${route.slice(1)}.html`;
  await mkdir(dirname(DIST + file), { recursive: true });
  await writeFile(DIST + file, html);
}
console.log(`Prerender: ${PRERENDER_ROUTES.length} stranica`);

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...PRERENDER_ROUTES.map((route) => `  <url><loc>${SITE_URL}${route}</loc></url>`),
  "</urlset>",
  "",
].join("\n");
await writeFile(DIST + "sitemap.xml", sitemap);
console.log(`sitemap.xml: ${PRERENDER_ROUTES.length} adresa`);

// Stari Wix linkovi usluga i članaka (/service-page/hsg, /items-2/biopsija-grlića-materice...)
// -> nova stranica te usluge. Wix je pravio adresu od naslova, sa č/ć/š/ž; pravi se i oblik bez njih.
const wixSlug = (title) =>
  title
    .toLowerCase()
    .replace(/[^\p{L}\p{N}()]+/gu, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
const regexEscape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const targets = new Map();
const addTarget = (title, path) => {
  for (const slug of [wixSlug(title), slugify(title)]) {
    if (slug && !targets.has(slug)) targets.set(slug, path);
  }
};
for (const { article, path } of articleRoutes) {
  addTarget(article.title, path);
  for (const name of article.aka || []) addTarget(name, path);
}
for (const cat of serviceCategories) {
  for (const item of cat.items) {
    // Usluga koja vodi na opštu temu (npr. endokrinologija), a ne na svoj članak -> lista kategorije
    const article = item.article || !item.category ? serviceItemArticle(item) : null;
    addTarget(item.name, article ? articlePath(article) : categoryPath(cat.id));
  }
}

const rules = [...targets].map(
  ([slug, path]) => `RewriteRule ^(?:service-page|items-[0-9]+)/${regexEscape(slug)}/?$ ${SITE_URL}${path} [L,R=301,NC]`
);
const MARKER = /^# @generisana-preusmeravanja.*$/m;
const htaccess = await readFile(DIST + ".htaccess", "utf8");
if (!MARKER.test(htaccess)) throw new Error("U .htaccess nema oznake @generisana-preusmeravanja");
await writeFile(DIST + ".htaccess", htaccess.replace(MARKER, (line) => `${line}\n${rules.join("\n")}`));
console.log(`.htaccess: ${rules.length} preusmeravanja starih linkova usluga`);

// llms.txt: kratak opis ordinacije za AI pretragu (ChatGPT, Perplexity, Google AI odgovori).
// Pravi se iz istih podataka kao sajt, pa je uvek usklađen sa njim.
const roleText = (role) => role.replace(/\s*\n\s*/g, ", ");
const llms = [
  "# Ginekološka ordinacija Raović",
  "",
  "> Specijalistička ginekološko-akušerska ordinacija na Vračaru u Beogradu, od 2004. godine. Ginekološki pregledi, ultrazvuk, kontrola trudnoće, intervencije, lečenje steriliteta i konsultativni pregledi specijalista.",
  "",
  "- Adresa: Golsvordijeva 6, 11000 Beograd (Vračar)",
  "- Telefon: 011 244 77 63, 063 687 889",
  "- E-mail: ordinacijaraovic@gmail.com",
  "- Radno vreme: ponedeljak - petak 08:00 - 20:00, subota 08:00 - 14:00",
  `- Sajt: ${SITE_URL}/`,
  `- Zakazivanje: telefonom ili preko forme ${SITE_URL}/kontakt`,
  "",
  ...serviceCategories.flatMap((cat) => {
    const articles = articleRoutes.filter(({ path }) => path.startsWith(`${categoryPath(cat.id)}/`));
    return [
      `## ${cat.label}`,
      "",
      `${cat.description ? `${cat.description} ` : ""}Sve usluge: ${SITE_URL}${categoryPath(cat.id)}`,
      "",
      ...articles.map(({ article, path }) => {
        const aka = article.aka?.length ? ` (poznato i kao: ${article.aka.join(", ")})` : "";
        return `- [${article.title}](${SITE_URL}${path})${aka}: ${article.desc || ""}`.trim();
      }),
      "",
    ];
  }),
  "## Tim",
  "",
  ...[...founders, ...associates].map((p) => `- ${p.name} - ${roleText(p.role)}${p.note ? ` (${p.note.toLowerCase()})` : ""}`),
  "",
  `Ceo tim: ${SITE_URL}/tim`,
  "",
].join("\n");
await writeFile(DIST + "llms.txt", llms);
console.log(`llms.txt: ${llms.length} znakova`);

await rm(SSR, { recursive: true, force: true });
