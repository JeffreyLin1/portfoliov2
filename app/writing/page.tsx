import { promises as fs } from "node:fs";
import path from "node:path";
import Link from "next/link";

export const metadata = {
  title: "Writing — Jeffrey Lin",
};

type BlogItem = {
  slug: string;
  title: string;
  updatedAtMs: number;
};

function toSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function getBlogs(): Promise<BlogItem[]> {
  const blogsDir = path.join(process.cwd(), "content", "blogs");

  try {
    const entries = await fs.readdir(blogsDir, { withFileTypes: true });
    const files = entries.filter((entry) => entry.isFile());

    const blogItems = await Promise.all(
      files.map(async (file) => {
        const absoluteFilePath = path.join(blogsDir, file.name);
        const { mtimeMs } = await fs.stat(absoluteFilePath);
        const baseName = file.name.replace(/\.[^.]+$/, "");

        return {
          slug: toSlug(baseName),
          title: baseName.replace(/[-_]+/g, " ").trim(),
          updatedAtMs: mtimeMs,
        };
      }),
    );

    return blogItems.sort((a, b) => b.updatedAtMs - a.updatedAtMs);
  } catch {
    return [];
  }
}

export default async function WritingPage() {
  const blogs = await getBlogs();

  return (
    <div>
      {blogs.length === 0 ? (
        <p className="mt-5 text-[var(--foreground-muted)] leading-relaxed">No writing yet.</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {blogs.map((blog) => (
            <li key={blog.slug}>
              <Link
                href={`/blogs/${blog.slug}`}
                className="underline decoration-gray-300 hover:decoration-gray-500 transition-colors"
              >
                {blog.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
