import { promises as fs } from "node:fs";
import path from "node:path";
import Image from "next/image";
import Link from "next/link";
import SocialFooter from "./components/social-footer";

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

export default async function Home() {
  const blogs = await getBlogs();

  return (
    <div className="min-h-screen flex justify-center">
      <main className="flex min-h-screen w-full max-w-2xl flex-col px-6 pt-24 pb-8">
        <div className="relative">
          <div>

            <h1 className="text-3xl font-semibold text-[var(--foreground-strong)]">Jeffrey Lin</h1>
            <div className="mt-3 flex gap-4 text-sm text-[var(--foreground-muted)]">
              <a href="https://x.com/jeeffreyLin" target="_blank" rel="noopener noreferrer" className="underline decoration-gray-300 hover:decoration-gray-500 transition-colors">x</a>
              <a href="https://ca.linkedin.com/in/jeffreyllin" target="_blank" rel="noopener noreferrer" className="underline decoration-gray-300 hover:decoration-gray-500 transition-colors">linkedin</a>
              <a href="https://github.com/JeffreyLin1" target="_blank" rel="noopener noreferrer" className="underline decoration-gray-300 hover:decoration-gray-500 transition-colors">github</a>
            </div>
            <p className="mt-5 leading-relaxed">
             Currently studying SYDE @ UWaterloo. 
            </p>
          </div>
          
        </div>
        <h2 className="text-lg font-semibold text-[var(--foreground-strong)] mt-8">Work</h2>

        <div className="mt-3 space-y-5">
          <div>
            <a href="https://www.fleetline.ai/" target="_blank" rel="noopener noreferrer" className="font-medium text-[var(--foreground-strong)] underline decoration-gray-300 hover:decoration-gray-500 transition-colors">Fleetline (current)</a>
            <p className="mt-1 text-[var(--foreground-muted)] leading-relaxed">Engineer #2. Optimization algorithms for trucking, YC (S25).</p>
          </div>

          <div>
            <a href="https://www.shopify.com" target="_blank" rel="noopener noreferrer" className="font-medium text-[var(--foreground-strong)] underline decoration-gray-300 hover:decoration-gray-500 transition-colors">Shopify (2025)</a>
            <p className="mt-1 text-[var(--foreground-muted)] leading-relaxed">Worked on Sidekick. Built a synthetic feedback loop to finetune models on prod errors.</p>
          </div>

          <div>
            <a href="https://ca.linkedin.com/company/agentnoon" target="_blank" rel="noopener noreferrer" className="font-medium text-[var(--foreground-strong)] underline decoration-gray-300 hover:decoration-gray-500 transition-colors">Agentnoon (2025)</a>
            <p className="mt-1 text-[var(--foreground-muted)] leading-relaxed">Enterprise workforce planning software,
              YC (W22) and acquired by DayForce.</p>
          </div>
        </div>
        <h2 className="text-lg font-semibold text-[var(--foreground-strong)] mt-10">Projects</h2>

        <div className="mt-3 space-y-5">
          <div>
            <a href="https://jello.gg/" target="_blank" rel="noopener noreferrer" className="font-medium text-[var(--foreground-strong)] underline decoration-gray-300 hover:decoration-gray-500 transition-colors">Jello.gg</a>
            <p className="mt-1 text-[var(--foreground-muted)] leading-relaxed">Paper.io but you bet real money via Solana. Launched $PLAYJELLO on Bags, made almost $1k in fees.</p>
          </div>

          <div>
            <a href="https://brainrot.mov/" target="_blank" rel="noopener noreferrer" className="font-medium text-[var(--foreground-strong)] underline decoration-gray-300 hover:decoration-gray-500 transition-colors">Brainrot.mov</a>
            <p className="mt-1 text-[var(--foreground-muted)] leading-relaxed">First profitable project. Generate videos of Peter Griffin explaining stuff to Stewie. Millions of views, $1k MRR, sold it.</p>
          </div>

          <div>
            <a href="https://www.uwsummit.ca/" target="_blank" rel="noopener noreferrer" className="font-medium text-[var(--foreground-strong)] underline decoration-gray-300 hover:decoration-gray-500 transition-colors">UWSummit</a>
            <p className="mt-1 text-[var(--foreground-muted)] leading-relaxed">First viral project. Hot or Not but for UWaterloo linkedin profiles. 100k visits in 3 days, sold it to Clado (YC X25).</p>
          </div>
        </div>
        <h2 className="text-lg font-semibold text-[var(--foreground-strong)] mt-10">Writing</h2>
        {blogs.length === 0 ? (
          <p className="mt-3 text-[var(--foreground-muted)] leading-relaxed">No writing yet.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {blogs.map((blog) => (
              <li key={blog.slug}>
                <Link href={`/blogs/${blog.slug}`} className="underline decoration-gray-300 hover:decoration-gray-500 transition-colors">
                  {blog.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
        <SocialFooter className="mt-auto" />
      </main>
    </div>
  );
}
