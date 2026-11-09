import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { PAGES, SITE_URL } from "../pageMeta";

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
