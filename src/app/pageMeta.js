// Naslov, opis i adresa svake stranice. Koristi ih PageMeta (u browseru)
// i scripts/prerender.mjs (pravi gotov HTML za svaku stranicu, za Google).
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
