import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./app/App";
import { PAGES } from "./app/pageMeta";
import "./app/styles/global.css";

const root = document.getElementById("root");
const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Stranice stižu već iscrtane (scripts/prerender.mjs), pa ih React samo „oživi“.
// Kad gotov HTML ne odgovara adresi (?kat=..., /o-nama, nepostojeća adresa), crta se iz početka.
const path = window.location.pathname.replace(/(.)\/$/, "$1");
const matchesPrerender = path in PAGES && !window.location.search;

if (root.hasChildNodes() && matchesPrerender) {
  ReactDOM.hydrateRoot(root, app);
} else {
  ReactDOM.createRoot(root).render(app);
}
