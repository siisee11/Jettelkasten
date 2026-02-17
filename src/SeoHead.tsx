import { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";

type PageSeo = {
  slug: string;
  tags: string[];
};

const STATIC_ROUTES = new Set(["/", "/about", "/posts", "/keywords", "/graph"]);
const SITE_BASE = "https://namjaeyoun.com";
const PRIMARY_HOST = "namjaeyoun.com";

const normalizePathname = (pathname: string) => {
  const clean = pathname.split("?")[0].split("#")[0];
  if (!clean || clean === "/") return "/";
  return clean.endsWith("/") ? clean.slice(0, -1) : clean;
};

const toAbsoluteUrl = (base: string, pathname: string) => {
  const normalizedPath = pathname === "/" ? "/" : `/${pathname.replace(/^\/+/, "")}`;
  return `${base}${normalizedPath}`;
};

const upsertCanonical = (href: string) => {
  let link = document.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", href);
};

const upsertRobots = (content: string) => {
  let meta = document.querySelector('meta[name="robots"]');
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("name", "robots");
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", content);
};

export default function SeoHead({ pages }: { pages: PageSeo[] }) {
  const location = useLocation();

  const pathname = useMemo(() => normalizePathname(location.pathname), [location.pathname]);

  const page = useMemo(() => {
    if (pathname === "/") return pages.find((p) => p.slug === "index") ?? null;
    const slug = decodeURIComponent(pathname.slice(1));
    return pages.find((p) => p.slug === slug) ?? null;
  }, [pages, pathname]);

  const shouldNoindex = useMemo(() => {
    if (window.location.host !== PRIMARY_HOST) return true;
    if (page) return page.tags.includes("private");
    return !STATIC_ROUTES.has(pathname);
  }, [page, pathname]);

  useEffect(() => {
    upsertCanonical(toAbsoluteUrl(SITE_BASE, pathname));
    upsertRobots(shouldNoindex ? "noindex, nofollow" : "index, follow");
  }, [pathname, shouldNoindex]);

  return null;
}
