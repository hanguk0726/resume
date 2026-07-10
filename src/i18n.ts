import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import type { Lang } from "./types";

const STORAGE_KEY = "resume.lang";

// Language resolution order (per handoff §12): URL param wins, then a stored
// choice, then the browser language, defaulting to Korean.
export function resolveLang(param: string | null): Lang {
  if (param === "ko" || param === "en") return param;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "ko" || stored === "en") return stored;
  } catch {
    // localStorage may be unavailable (private mode, SSR) — ignore.
  }
  if (
    typeof navigator !== "undefined" &&
    navigator.language.toLowerCase().startsWith("en")
  ) {
    return "en";
  }
  return "ko";
}

export function useLang(): { lang: Lang; setLang: (l: Lang) => void } {
  const [searchParams, setSearchParams] = useSearchParams();
  const lang = resolveLang(searchParams.get("lang"));

  const setLang = useCallback(
    (l: Lang) => {
      try {
        localStorage.setItem(STORAGE_KEY, l);
      } catch {
        // ignore write failures
      }
      const next = new URLSearchParams(searchParams);
      next.set("lang", l);
      // Same page, only the language changes — the scroll position is kept.
      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  return { lang, setLang };
}
