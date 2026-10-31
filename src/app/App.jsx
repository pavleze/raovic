import { BrowserRouter, HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppShell } from "./layout/AppShell";
import { ScrollToTop } from "./layout/ScrollToTop";
import { PageMeta } from "./layout/PageMeta";
import { HomePage } from "../pages/home/HomePage";
import { ServicesPage } from "../pages/services/ServicesPage";
import { TeamPage } from "../pages/team/TeamPage";
import { ContactPage } from "../pages/contact/ContactPage";
import { BlogPage } from "../pages/blog/BlogPage";
import { VodicRedirect } from "../pages/blog/VodicRedirect";

// Na pravom sajtu adrese su čiste (/kontakt) da bi ih Google indeksirao.
// Kad se build otvori direktno kao fajl (file://), čiste adrese ne rade, pa ostaje hash.
const Router = window.location.protocol === "file:" ? HashRouter : BrowserRouter;

// Stari linkovi oblika /#/tim prebacuju se na /tim.
if (Router === BrowserRouter && window.location.hash.startsWith("#/")) {
  window.history.replaceState(null, "", window.location.hash.slice(1));
}

export function App() {
  return (
    <Router>
      <ScrollToTop />
      <PageMeta />
      <AppShell>
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* O nama je deo početne strane; stari /o-nama linkovi skroluju do njega */}
          <Route path="/o-nama" element={<Navigate to="/" replace state={{ scrollTo: "o-nama" }} />} />
          <Route path="/usluge" element={<ServicesPage />} />
          <Route path="/tim" element={<TeamPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/kontakt" element={<ContactPage />} />
          <Route path="/vodic" element={<VodicRedirect />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppShell>
    </Router>
  );
}
