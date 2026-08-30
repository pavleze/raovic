import { HashRouter, Routes, Route } from "react-router-dom";
import { AppShell } from "./layout/AppShell";
import { ScrollToTop } from "./layout/ScrollToTop";
import { BookingProvider } from "./context/BookingContext";
import { HomePage } from "../pages/home/HomePage";
import { AboutPage } from "../pages/about/AboutPage";
import { ServicesPage } from "../pages/services/ServicesPage";
import { TeamPage } from "../pages/team/TeamPage";
import { ContactPage } from "../pages/contact/ContactPage";
import { BlogPage } from "../pages/blog/BlogPage";

export function App() {
  return (
    <HashRouter>
      <BookingProvider>
      <ScrollToTop />
      <AppShell>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/o-nama" element={<AboutPage />} />
          <Route path="/usluge" element={<ServicesPage />} />
          <Route path="/tim" element={<TeamPage />} />
          <Route path="/kontakt" element={<ContactPage />} />
          <Route path="/vodic" element={<BlogPage />} />
        </Routes>
      </AppShell>
      </BookingProvider>
    </HashRouter>
  );
}
