import { promises as fs } from "node:fs";
import path from "node:path";
import type { Lang } from "./i18n";

const blogsDir = path.join(process.cwd(), "content", "blogs");

/**
 * Chinese posts live in `content/blogs/zh/` under the *same* filename as their
 * English counterpart, which keeps slugs (and links) identical across languages.
 * A post with no translation falls back to English.
 */
const zhDir = path.join(blogsDir, "zh");

export type BlogItem = {
  slug: string;
  title: Record<Lang, string>;
  updatedAtMs: number;
};

export type BlogPost = {
  title: Record<Lang, string>;
  content: Record<Lang, string>;
};

function toSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function titleFromFileName(fileName: string): string {
  return fileName.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim();
}

/** First `# heading` of a post, used as its title in the listing. */
function titleFromMarkdown(content: string): string | null {
  const match = content.match(/^#\s+(.+?)\s*$/m);
  return match ? match[1] : null;
}

async function readTranslation(fileName: string): Promise<string | null> {
  try {
    return await fs.readFile(path.join(zhDir, fileName), "utf8");
  } catch {
    return null;
  }
}

async function listEnglishFiles(): Promise<string[]> {
  const entries = await fs.readdir(blogsDir, { withFileTypes: true });
  return entries.filter((entry) => entry.isFile()).map((entry) => entry.name);
}

export async function getBlogs(): Promise<BlogItem[]> {
  try {
    const fileNames = await listEnglishFiles();

    const blogItems = await Promise.all(
      fileNames.map(async (fileName) => {
        const { mtimeMs } = await fs.stat(path.join(blogsDir, fileName));
        const englishTitle = titleFromFileName(fileName);
        const translation = await readTranslation(fileName);

        return {
          slug: toSlug(titleFromFileName(fileName)),
          title: {
            en: englishTitle,
            zh: (translation && titleFromMarkdown(translation)) || englishTitle,
          },
          updatedAtMs: mtimeMs,
        };
      }),
    );

    return blogItems.sort((a, b) => b.updatedAtMs - a.updatedAtMs);
  } catch {
    return [];
  }
}

export async function getBlogBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const fileNames = await listEnglishFiles();

    for (const fileName of fileNames) {
      const englishTitle = titleFromFileName(fileName);
      if (toSlug(englishTitle) !== slug) {
        continue;
      }

      const englishContent = await fs.readFile(path.join(blogsDir, fileName), "utf8");
      const translation = await readTranslation(fileName);

      return {
        title: {
          en: englishTitle,
          zh: (translation && titleFromMarkdown(translation)) || englishTitle,
        },
        content: {
          en: englishContent,
          zh: translation ?? englishContent,
        },
      };
    }
  } catch {
    return null;
  }

  return null;
}
