"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  DEFAULT_LANG,
  dictionary,
  HTML_LANG,
  LANG_COOKIE,
  type Dictionary,
  type Lang,
} from "../lib/i18n";

type LanguageContextValue = {
  lang: Lang;
  toggleLang: () => void;
  t: Dictionary;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

/** Slightly longer than the fade-out class below, so the swap lands unseen. */
const FADE_OUT_MS = 180;

const FADE_OUT_CLASS =
  "opacity-0 transition-opacity duration-150 ease-out motion-reduce:transition-none";
const FADE_IN_CLASS =
  "opacity-100 transition-opacity duration-200 ease-out motion-reduce:transition-none";

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function LanguageProvider({
  initialLang,
  children,
}: {
  initialLang: Lang;
  children: React.ReactNode;
}) {
  const [lang, setLang] = useState<Lang>(initialLang);
  // Non-null while the page is fading out, holding the language to swap in.
  const [pendingLang, setPendingLang] = useState<Lang | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    },
    [],
  );

  const toggleLang = useCallback(() => {
    // Flip from the pending language so a double click during a fade still lands right.
    const next: Lang = (pendingLang ?? lang) === "en" ? "zh" : "en";

    document.documentElement.lang = HTML_LANG[next];
    // Persisted so the server renders the right language on the next request.
    document.cookie = `${LANG_COOKIE}=${next}; path=/; max-age=${ONE_YEAR_SECONDS}; samesite=lax`;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (prefersReducedMotion()) {
      setPendingLang(null);
      setLang(next);
      return;
    }

    setPendingLang(next);
    timeoutRef.current = setTimeout(() => {
      timeoutRef.current = null;
      // Batched, so the new copy is committed and revealed in one paint.
      setPendingLang(null);
      setLang(next);
    }, FADE_OUT_MS);
  }, [lang, pendingLang]);

  const value = useMemo(
    () => ({ lang, toggleLang, t: dictionary[lang] }),
    [lang, toggleLang],
  );

  return (
    <LanguageContext.Provider value={value}>
      <div className={pendingLang ? FADE_OUT_CLASS : FADE_IN_CLASS}>{children}</div>
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    // Only reachable if a component renders outside the provider in the layout.
    return { lang: DEFAULT_LANG, toggleLang: () => {}, t: dictionary[DEFAULT_LANG] };
  }
  return context;
}
