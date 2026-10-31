import { BrowserRouter, HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppShell } from "./layout/AppShell";
import { ScrollToTop } from "./layout/ScrollToTop";
import { HomePage } from "../pages/home/HomePage";
import { AboutPage } from "../pages/about/AboutPage";
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
      <AppShell>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/o-nama" element={<AboutPage />} />
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
