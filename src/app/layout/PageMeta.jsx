import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SITE_URL = "https://www.raovic.rs";
const SITE_NAME = "Ginekološka ordinacija Raović";

// Naslov i opis koje Google prikazuje za svaku stranicu.
const PAGES = {
  "/": {
    title: `${SITE_NAME} – Vračar, Beograd`,
    description:
      "Specijalistička ginekološko-akušerska ordinacija Raović na Vračaru, od 2004. godine. Ginekološki pregledi, ultrazvuk, kontrola trudnoće, intervencije i lečenje steriliteta.",
  },
  "/o-nama": {
    title: `O nama | ${SITE_NAME}`,
    description:
      "Ginekološko-akušerska ordinacija Raović u srcu Vračara brine o zdravlju žena od 2004. godine. Upoznajte našu priču, prostor i način rada.",
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
      "Zakažite pregled u ordinaciji Raović: Golsvordijeva 6, Vračar, Beograd. Tel. 011 244 77 63. Radno vreme pon–pet 08–20h, subota 08–14h.",
  },
};

function setMeta(selector, attr, value) {
  const el = document.head.querySelector(selector);
  if (el) el.setAttribute(attr, value);
}

export function PageMeta() {
  const { pathname } = useLocation();

  useEffect(() => {
    const page = PAGES[pathname] ?? PAGES["/"];
    const url = SITE_URL + (PAGES[pathname] ? pathname : "/");

    document.title = page.title;
    setMeta('meta[name="description"]', "content", page.description);
    setMeta('link[rel="canonical"]', "href", url);
    setMeta('meta[property="og:title"]', "content", page.title);
    setMeta('meta[property="og:description"]', "content", page.description);
    setMeta('meta[property="og:url"]', "content", url);
  }, [pathname]);

  return null;
}
