// Jedini izvor istine za usluge (ono što se zakazuje).
// `article` (opciono) povezuje uslugu sa člankom u Vodiču — tada se prikazuje
// mali tizer (iz opisa članka) i "Pročitaj više →". Bez article-a: samo naziv.

export const serviceCategories = [
  {
    id: "ginekologija",
    label: "Ginekologija",
    description:
      "Ginekologija je grana medicine koja se bavi proučavanjem ženskog reproduktivnog sistema, njegovim bolestima i načinima lečenja, kao i prevencijom.",
    items: [
      { name: "Ginekološki pregled", article: "Ginekološki pregled", dur: "15 min", price: "4.000 RSD" },
      { name: "Osnovni sistematski pregled", article: "Ginekološki pregled", dur: "30 min", price: "od 14.000 RSD" },
      { name: "Ultrazvuk i ginekološki pregled", article: "Ginekološki ultrazvuk", dur: "30 min", price: "10.000 RSD" },
      { name: "Kolposkopija i papa test", article: "Kolposkopija", dur: "15 min", price: "7.000 RSD", note: "U okviru ginekološkog pregleda i trudnoće" },
      { name: "Kolposkopija – Papa test – Ultrazvuk", article: "Kolposkopija", dur: "30 min", price: "12.000 RSD" },
      { name: "Ultrazvuk dojki", article: "Ultrazvuk dojki", dur: "30 min", price: "6.000 RSD" },
      { name: "Ultrazvučni pregled vaginalnom sondom", article: "Ginekološki ultrazvuk", dur: "30 min", price: "9.000 RSD" },
      { name: "Uklanjanje kondiloma", article: "Uklanjanje kondiloma", dur: "15 min", price: "11.000 RSD", note: "Izvodi se u lokalnoj anesteziji" },
      { name: "Vaginalni bris", article: "Bakteriološke i mikološke analize", dur: "15 min", price: "1.000 RSD", note: "U okviru ginekološkog pregleda i trudnoće" },
      { name: "Cervikalni bris (ginekološki pregled)", article: "PAPA test", dur: "15 min", price: "1.000 RSD", note: "U okviru ginekološkog pregleda i trudnoće" },
      { name: "Aplikacija spirale", article: "Kontracepcija", dur: "15 min", price: "6.500 RSD" },
      { name: "Folikulometrija", article: "Folikulometrija", dur: "15 min", price: "3.000 RSD" },
      { name: "SIS – ultrazvučno dokazivanje polipa", article: "Endometrijalni polipi", dur: "30 min", price: "8.600 RSD" },
      { name: "Biopsija horionskih čupica", article: "Biopsija horionskih čupica", dur: "15 min", price: "61.000 RSD" },
      { name: "Kolposkopija – Papa test – Dr A. Pikula", article: "Kolposkopija", dur: "30 min", price: "14.500 RSD" },
    ],
  },
  {
    id: "trudnoca",
    label: "Trudnoća",
    description:
      "Praćenje i kontrola trudnoće podrazumevaju brigu kako o trudnici tako i o fetusu, kroz redovne preglede tokom svih 40 nedelja gestacije.",
    items: [
      { name: "Ultrazvučni pregled trudnice", article: "Ultrazvuk u trudnoći", dur: "30 min", price: "9.000 RSD" },
      { name: "Ekspertski ultrazvuk", article: "Ultrazvuk u trudnoći", dur: "30 min", price: "10.000 RSD" },
      { name: "3D ultrazvuk", article: "Ultrazvuk u trudnoći", dur: "30 min", price: "10.000 RSD" },
      { name: "4D ultrazvuk", article: "Ultrazvuk u trudnoći", dur: "30 min", price: "10.000 RSD" },
      { name: "CTG", article: "CTG pregled u trudnoći", dur: "15 min", price: "4.000 RSD" },
      { name: "Cervikalni bris u trudnoći", article: "Laboratorijske analize u trudnoći", dur: "15 min", price: "1.000 RSD", note: "U okviru ginekološkog pregleda i trudnoće" },
      { name: "Amniocenteza", article: "Amniocenteza", dur: "15 min", price: "61.000 RSD" },
      { name: "Dabl test", article: "Prenatalni test", dur: "30 min", price: "3.000 RSD" },
      { name: "Tripl test", article: "Prenatalni test", dur: "30 min", price: "4.000 RSD" },
      { name: "Kvadripl test", article: "Prenatalni test", dur: "30 min", price: "5.000 RSD" },
      { name: "Ultrazvučni pregled prof. Filimonović", article: "Ultrazvuk u trudnoći", dur: "30 min", price: "16.000 RSD" },
    ],
  },
  {
    id: "intervencije",
    label: "Intervencije",
    description:
      "Ginekološke intervencije su manji hirurški poduhvati koje je obično moguće uraditi u ambulantnim uslovima.",
    items: [
      { name: "Biopsija", article: "Biopsija grlića materice", dur: "15 min", price: "27.000 RSD" },
      { name: "Prekid trudnoće (abortus)", article: "Prekid trudnoće", dur: "45 min", price: "38.000 RSD" },
      { name: "Eksplorativna kiretaža", article: "Eksplorativna kiretaža", dur: "45 min", price: "38.000 RSD" },
      { name: "Biopsija grlića sa kiretažom kanala", article: "Biopsija grlića materice", dur: "30 min", price: "30.000 RSD" },
      { name: "Frakcionirana kiretaža", article: "Eksplorativna kiretaža", dur: "45 min", price: "38.000 RSD" },
      { name: "Polipektomija i kiretman", article: "Endometrijalni polipi", dur: "30 min", price: "20.000 RSD" },
      { name: "Biopsija vulve", dur: "45 min", price: "30.000 RSD" },
      { name: "Incizija Bartolinijeve žlezde", article: "Incizija Bartolinijeve žlezde", dur: "15 min", price: "15.000 RSD", note: "U okviru ginekološkog pregleda i trudnoće" },
      { name: "Revaporizacija", dur: "15 min", price: "7.000 RSD" },
      { name: "Incizija himena", dur: "45 min", price: "36.000 RSD" },
      { name: "Konizacija", article: "Konizacija", dur: "45 min", price: "52.000 RSD" },
      { name: "Histeroskopija terapijska", article: "Histeroskopija", dur: "45 min", price: "77.000 RSD" },
      { name: "Histeroskopija dijagnostička", article: "Histeroskopija", dur: "45 min", price: "od 45.000 RSD" },
      { name: "Indiba tretman", article: "INDIBA® – Deep Care", dur: "30 min", price: "15.000 RSD" },
      { name: "Biopsija horionskih čupica (intervencija)", article: "Biopsija horionskih čupica", dur: "15 min", price: "55.000 RSD" },
      { name: "Amniocenteza (intervencija)", article: "Amniocenteza", dur: "15 min", price: "55.000 RSD" },
    ],
  },
  {
    id: "sterilitet",
    label: "Sterilitet",
    description:
      "Sterilitet kod žena može biti primarni i sekundarni. Primarni sterilitet se javlja kod žena koje nikada nisu zatrudnele.",
    items: [
      { name: "Sterilitet – inicijalni pregled", article: "Sterilitet kod žena", dur: "30 min", note: "Inicijalni pregled se ne naplaćuje." },
      { name: "HSG", article: "Ultrazvučno snimanje prohodnosti jajovoda (HSSG)", dur: "45 min", price: "40.000 RSD" },
      { name: "Inseminacija", article: "Inseminacija", dur: "45 min", price: "36.000 RSD" },
    ],
  },
  {
    id: "konsultativni",
    label: "Konsultativni pregledi",
    items: [
      {
        name: "Endokrinologija – dr Ljiljana Marina",
        teaser: "Endokrinologija se bavi poremećajima u radu žlezda sa unutrašnjim lučenjem, kao i oboljenjima koja nastaju kao posledica tih poremećaja.",
        category: "endokrinologija",
        dur: "30 min",
        price: "10.000 RSD",
      },
      { name: "Hematologija", dur: "30 min", price: "9.000 RSD" },
      { name: "Radiologija", dur: "30 min", price: "8.000 RSD" },
      {
        name: "Endokrinologija – dr Milina Tančić Gajić",
        teaser: "Endokrinologija se bavi poremećajima u radu žlezda sa unutrašnjim lučenjem, kao i oboljenjima koja nastaju kao posledica tih poremećaja.",
        category: "endokrinologija",
        dur: "30 min",
        price: "9.000 RSD",
      },
      { name: "Ultrazvuk i pregled – Prof. dr R. Naumović", dur: "30 min", price: "16.000 RSD" },
    ],
  },
];
