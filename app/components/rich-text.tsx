import type { Part } from "../lib/i18n";

const linkClass =
  "font-semibold text-[var(--link)] underline decoration-[var(--link)]/40 hover:text-[var(--link-hover)] hover:decoration-[var(--link-hover)] transition-colors";

/** Renders a translated sentence whose links live in the dictionary. */
export default function RichText({ parts }: { parts: readonly Part[] }) {
  return (
    <>
      {parts.map((part, idx) =>
        part.href ? (
          <a
            key={idx}
            href={part.href}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            {part.text}
          </a>
        ) : (
          <span key={idx}>{part.text}</span>
        ),
      )}
    </>
  );
}
