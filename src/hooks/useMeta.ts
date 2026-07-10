import { useEffect } from "react";
import type { Lang } from "../types";

interface MetaInput {
  lang: Lang;
  title: string;
  description: string;
}

function upsertMeta(
  attr: "name" | "property",
  key: string,
  content: string
): void {
  const selector = `meta[${attr}="${key}"]`;
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

// Keeps the document title, <html lang>, and description/OG meta in sync with
// the active language. Updates the tags injected at build time in place rather
// than duplicating them.
export function useMeta({ lang, title, description }: MetaInput): void {
  useEffect(() => {
    document.title = title;
    document.documentElement.lang = lang;
    upsertMeta("name", "description", description);
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
  }, [lang, title, description]);
}
