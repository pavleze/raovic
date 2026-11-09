// Adrese stranica usluga: svaka kategorija i svaki članak ima svoju stranicu,
// da bi ih Google prikazivao za konkretne pretrage (npr. „konizacija Beograd“).
//   /usluge/intervencije              -> lista usluga kategorije
//   /usluge/intervencije/konizacija   -> članak
import { serviceCategories } from "./data/servicesData";
import { blogArticles } from "./data/blogData";

// "Ultrazvučno snimanje ... (HSSG)" -> "ultrazvucno-snimanje-...-hssg"
export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/đ/g, "dj")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// Teme članaka koje nemaju svoju kategoriju usluga.
const BLOG_CATEGORY_TO_KAT = {
  endokrinologija: "konsultativni",
  menopauza: "konsultativni",
};

const articleBySlug = new Map(blogArticles.map((a) => [slugify(a.title), a]));
const articleByTitle = new Map(blogArticles.map((a) => [a.title, a]));

export function findCategory(katId) {
  return serviceCategories.find((c) => c.id === katId) || null;
}

// Prihvata i kratak oblik (konizacija) i pun naslov (stari linkovi ?clanak=Konizacija).
export function findArticle(param) {
  if (!param) return null;
  return articleBySlug.get(param) || articleByTitle.get(param) || articleBySlug.get(slugify(param)) || null;
}

// Kategorija usluga u kojoj se članak prikazuje: prvo tema članka, pa usluga koja ga koristi.
export function articleCategoryId(article) {
  if (findCategory(article.category)) return article.category;
  const byItem = serviceCategories.find((c) =>
    c.items.some((it) => it.article === article.title || it.name === article.title || it.category === article.category)
  );
  if (byItem) return byItem.id;
  return BLOG_CATEGORY_TO_KAT[article.category] || "ginekologija";
}

export function categoryPath(katId) {
  return `/usluge/${katId}`;
}

export function articlePath(article) {
  return `/usluge/${articleCategoryId(article)}/${slugify(article.title)}`;
}

// Članak na koji vodi „Pročitaj više“ kod usluge (ili null ako ga nema).
export function serviceItemArticle(item) {
  const direct = articleByTitle.get(item.article || item.name);
  if (direct) return direct;
  if (item.category) return blogArticles.find((a) => a.category === item.category) || null;
  return null;
}

// Svi članci koji imaju svoju stranicu (svaki samo jednom).
export const articleRoutes = blogArticles.map((article) => ({ article, path: articlePath(article) }));
