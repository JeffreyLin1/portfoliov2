"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/writing", label: "Writing" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-6 text-base">
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
                ? "font-semibold text-[var(--foreground-strong)]"
                : "text-[var(--foreground-muted)] hover:text-[var(--foreground-strong)] transition-colors"
            }
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
