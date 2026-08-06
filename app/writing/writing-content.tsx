"use client";

import Link from "next/link";
import { useLanguage } from "../components/language-provider";
import type { BlogItem } from "../lib/blogs";

export default function WritingContent({ blogs }: { blogs: BlogItem[] }) {
  const { lang, t } = useLanguage();

  if (blogs.length === 0) {
    return (
      <div>
        <p className="mt-5 text-[var(--foreground-muted)] leading-relaxed">{t.writing.empty}</p>
      </div>
    );
  }

  return (
    <div>
      <ul className="mt-3 space-y-2">
        {blogs.map((blog) => (
          <li key={blog.slug}>
            <Link
              href={`/blogs/${blog.slug}`}
              className="underline decoration-gray-300 hover:decoration-gray-500 transition-colors"
            >
              {blog.title[lang]}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
