type SocialFooterProps = {
  className?: string;
};

export default function SocialFooter({ className = "" }: SocialFooterProps) {
  const links = [
    { href: "https://x.com/jeeffreyLin", label: "x" },
    { href: "https://ca.linkedin.com/in/jeffreyllin", label: "linkedin" },
    { href: "https://github.com/JeffreyLin1", label: "github" },
  ];

  return (
    <footer className={`pt-12 text-sm ${className}`.trim()}>
      <div className="flex gap-4">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            {link.label}
          </a>
        ))}
      </div>
    </footer>
  );
}
