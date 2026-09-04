"use client";

import Link from "next/link";
import LanguageToggle from "./language-toggle";
import { useLanguage } from "./language-provider";
import ThemeToggle from "./theme-toggle";

export default function Header() {
  const { t } = useLanguage();

  return (
    <header className="flex items-center justify-between">
      <Link href="/">
        <h1 className="text-3xl font-semibold text-[var(--foreground-strong)]">{t.home.name}</h1>
      </Link>
      <div className="flex items-center gap-3">
        <LanguageToggle />
        <ThemeToggle />
      </div>
    </header>
  );
}
