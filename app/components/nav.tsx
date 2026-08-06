"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LanguageToggle from "./language-toggle";
import { useLanguage } from "./language-provider";
import ThemeToggle from "./theme-toggle";

const links = [
  { href: "/", key: "home" },
  { href: "/projects", key: "projects" },
  { href: "/work", key: "work" },
  { href: "/writing", key: "writing" },
] as const;

export default function Nav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    <nav className="flex items-center gap-6 text-base">
      {links.map((link) => {
        const isActive =
          link.href === "/"
            ? pathname === "/"
            : pathname === link.href || pathname.startsWith(`${link.href}/`);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={
              isActive
                ? "text-[var(--link)]"
                : "text-[var(--foreground-muted)] hover:text-[var(--foreground-strong)] transition-colors"
            }
          >
            {t.nav[link.key]}
          </Link>
        );
      })}
      <div className="ml-auto flex items-center gap-3">
        <LanguageToggle />
        <ThemeToggle />
      </div>
    </nav>
  );
}
