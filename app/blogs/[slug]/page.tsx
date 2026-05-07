import { promises as fs } from "node:fs";
import path from "node:path";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

type BlogFile = {
  title: string;
  content: string;
};

function toSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function getBlogFileBySlug(slug: string): Promise<BlogFile | null> {
  const blogsDir = path.join(process.cwd(), "content", "blogs");
  try {
    const entries = await fs.readdir(blogsDir, { withFileTypes: true });
    const files = entries.filter((entry) => entry.isFile());

    for (const file of files) {
      const baseName = file.name.replace(/\.[^.]+$/, "");
      if (toSlug(baseName) !== slug) {
        continue;
      }

      const blogPath = path.join(blogsDir, file.name);
      const content = await fs.readFile(blogPath, "utf8");
      return {
        title: baseName.replace(/[-_]+/g, " ").trim(),
        content,
      };
    }
  } catch {
    return null;
  }

  return null;
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blogFile = await getBlogFileBySlug(slug);

  if (!blogFile) {
    notFound();
  }

  return (
    <div>
      <Link
        href="/writing"
        className="text-sm text-[var(--foreground-muted)] underline decoration-gray-300 hover:decoration-gray-500 transition-colors"
      >
        ← back
      </Link>
      <article className="mt-2 leading-relaxed text-[var(--foreground)]">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug, rehypeHighlight]}
        components={{
          a: ({ ...props }) => <a {...props} className="underline decoration-gray-300 hover:decoration-gray-500 transition-colors" />,
          h1: ({ ...props }) => <h1 {...props} className="mt-6 text-3xl font-semibold text-[var(--foreground-strong)]" />,
          h2: ({ ...props }) => <h2 {...props} className="mt-5 text-2xl font-semibold text-[var(--foreground-strong)]" />,
          h3: ({ ...props }) => <h3 {...props} className="mt-4 text-xl font-semibold text-[var(--foreground-strong)]" />,
          p: ({ ...props }) => <p {...props} className="mt-3" />,
          ul: ({ ...props }) => (
            <ul {...props} className="mt-3 list-disc pl-5 [&_ul]:mt-1 [&_ol]:mt-1" />
          ),
          ol: ({ ...props }) => (
            <ol {...props} className="mt-3 list-decimal pl-5 [&_ul]:mt-1 [&_ol]:mt-1" />
          ),
          li: ({ ...props }) => <li {...props} className="mt-1 [&>p]:mt-0" />,
          code: ({ className, ...props }) =>
            className?.includes("language-") ? (
              <code {...props} className={className} />
            ) : (
              <code
                {...props}
                className="rounded bg-black/5 px-1 py-0.5 font-mono text-[0.95em]"
              />
            ),
          pre: ({ ...props }) => (
            <pre
              {...props}
              className="mt-3 overflow-x-auto p-0 text-[0.95em]"
            />
          ),
          blockquote: ({ ...props }) => (
            <blockquote {...props} className="mt-3 border-l-2 border-gray-300 pl-3 text-[var(--foreground-muted)]" />
          ),
        }}
      >
        {blogFile.content}
      </ReactMarkdown>
    </article>
    </div>
  );
}
