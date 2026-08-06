"use client";

import { useLanguage } from "./language-provider";

export default function LanguageToggle() {
  const { toggleLang, t } = useLanguage();

  return (
    <button
      onClick={toggleLang}
      aria-label={t.langToggle.ariaLabel}
      title={t.langToggle.ariaLabel}
      className="text-sm leading-none text-[var(--foreground-muted)] hover:text-[var(--foreground-strong)] transition-colors"
    >
      {t.langToggle.label}
    </button>
  );
}
