"use client";

import { useLanguage } from "./language-provider";

const links = [
  { href: "https://x.com/jeeffreyLin", key: "x" },
  { href: "https://ca.linkedin.com/in/jeffreyllin", key: "linkedin" },
  { href: "https://github.com/JeffreyLin1", key: "github" },
  { href: "mailto:j457lin@uwaterloo.ca", key: "email" },
] as const;

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="mt-6 flex gap-4 text-sm text-[var(--foreground-muted)]">
      {links.map((link) => (
        <a
          key={link.key}
          href={link.href}
          target={link.href.startsWith("mailto:") ? undefined : "_blank"}
          rel="noopener noreferrer"
          className="underline decoration-gray-300 hover:decoration-gray-500 transition-colors"
        >
          {t.footer[link.key]}
        </a>
      ))}
    </footer>
  );
}
