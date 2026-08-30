import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Router pamti poziciju skrola, pa nova strana krece odakle je prethodna stala.
export function ScrollToTop() {
  const { pathname, search, state } = useLocation();

  useEffect(() => {
    // Kad link cilja sekciju, stranica sama skroluje do nje.
    if (state?.scrollTo) return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, search, state]);

  return null;
}
