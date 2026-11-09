// Naslov, opis i adresa svake stranice. Koristi ih PageMeta (u browseru)
// i scripts/prerender.mjs (pravi gotov HTML za svaku stranicu, za Google).
import { serviceCategories } from "../shared/data/servicesData";
import { articleRoutes, findArticle, findCategory } from "../shared/serviceRoutes";

export const SITE_URL = "https://www.raovic.rs";
export const SITE_NAME = "Ginekološka ordinacija Raović";

export const PAGES = {
  "/": {
    title: `${SITE_NAME} - Vračar, Beograd`,
    description:
      "Specijalistička ginekološko-akušerska ordinacija Raović na Vračaru, od 2004. godine. Ginekološki pregledi, ultrazvuk, kontrola trudnoće, intervencije i lečenje steriliteta.",
  },
  "/usluge": {
    title: `Usluge i cenovnik | ${SITE_NAME}`,
    description:
      "Ginekološki pregledi, ultrazvuk, kontrola trudnoće, intervencije, sterilitet i konsultativni pregledi specijalista. Pogledajte usluge i cene i zakažite termin.",
  },
  "/tim": {
    title: `Naš tim lekara | ${SITE_NAME}`,
    description:
      "Upoznajte tim ordinacije Raović: specijaliste ginekologije i akušerstva, profesore i docente Medicinskog fakulteta u Beogradu i medicinsko osoblje.",
  },
  "/blog": {
    title: `Blog | ${SITE_NAME}`,
    description: "Saveti, stručni članci i novosti iz ginekološke ordinacije Raović.",
  },
  "/kontakt": {
    title: `Kontakt i zakazivanje | ${SITE_NAME}`,
    description:
      "Zakažite pregled u ordinaciji Raović: Golsvordijeva 6, Vračar, Beograd. Tel. 011 244 77 63. Radno vreme pon-pet 08-20h, subota 08-14h.",
  },
};

// ── Stranice usluga (svaka kategorija i svaki članak) ─────────────

const CATEGORY_TITLES = {
  ginekologija: "Ginekološki pregledi i ultrazvuk u Beogradu",
  trudnoca: "Kontrola trudnoće i ultrazvuk u trudnoći u Beogradu",
  intervencije: "Ginekološke intervencije u Beogradu",
  sterilitet: "Lečenje steriliteta u Beogradu",
  konsultativni: "Konsultativni pregledi - endokrinolog, hematolog, nefrolog",
};

const shorten = (text, max = 160) =>
  text.length <= max ? text : `${text.slice(0, max - 1).replace(/\s+\S*$/, "")}…`;

function categoryMeta(cat) {
  const services = cat.items.slice(0, 5).map((it) => it.name).join(", ");
  const intro = cat.description ? `${cat.description} ` : "";
  return {
    title: `${CATEGORY_TITLES[cat.id] || cat.label} | Ordinacija Raović`,
    description: shorten(`${intro}${services}. Ordinacija Raović, Vračar.`),
  };
}

function articleMeta(article) {
  return {
    title: `${article.title} - Beograd, Vračar | Ordinacija Raović`,
    description: shorten(article.desc || article.title),
  };
}

// Naslov i opis za bilo koju adresu sajta (nepoznata adresa -> početna).
export function getPageMeta(pathname) {
  if (PAGES[pathname]) return { path: pathname, kind: "page", ...PAGES[pathname] };
  const [, section, katId, slug] = pathname.split("/");
  const cat = section === "usluge" ? findCategory(katId) : null;
  if (cat && !slug) return { path: pathname, kind: "category", category: cat, ...categoryMeta(cat) };
  const article = cat && slug ? findArticle(slug) : null;
  if (article) return { path: pathname, kind: "article", category: cat, article, ...articleMeta(article) };
  return { path: "/", kind: "page", ...PAGES["/"] };
}

// Sve adrese za koje se pravi gotov HTML i koje idu u sitemap.xml.
export const PRERENDER_ROUTES = [
  ...Object.keys(PAGES),
  ...serviceCategories.map((c) => `/usluge/${c.id}`),
  ...articleRoutes.map((r) => r.path),
];
