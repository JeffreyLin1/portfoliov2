export default function Footer() {
  const links = [
    { href: "https://x.com/jeeffreyLin", label: "x" },
    { href: "https://ca.linkedin.com/in/jeffreyllin", label: "linkedin" },
    { href: "https://github.com/JeffreyLin1", label: "github" },
    { href: "mailto:j457lin@uwaterloo.ca", label: "email" },
  ];

  return (
    <footer className="mt-6 flex gap-4 text-sm text-[var(--foreground-muted)]">
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target={link.href.startsWith("mailto:") ? undefined : "_blank"}
          rel="noopener noreferrer"
          className="underline decoration-gray-300 hover:decoration-gray-500 transition-colors"
        >
          {link.label}
        </a>
      ))}
    </footer>
  );
}
