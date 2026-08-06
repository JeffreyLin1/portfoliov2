"use client";

import Link from "next/link";
import { useLanguage } from "../../components/language-provider";

/**
 * Both language versions are rendered to markup on the server and handed over
 * as nodes, so the markdown pipeline never ships to the browser.
 */
export default function BlogView({
  en,
  zh,
}: {
  en: React.ReactNode;
  zh: React.ReactNode;
}) {
  const { lang, t } = useLanguage();

  return (
    <div>
      <Link
        href="/writing"
        className="text-sm text-[var(--foreground-muted)] underline decoration-gray-300 hover:decoration-gray-500 transition-colors"
      >
        {t.blog.back}
      </Link>
      {lang === "zh" ? zh : en}
    </div>
  );
}
