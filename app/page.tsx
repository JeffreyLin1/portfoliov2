import { promises as fs } from "node:fs";
import path from "node:path";
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
        <h1 className="text-3xl font-semibold text-[var(--foreground-strong)]">Hi! I&apos;m Jeffrey.</h1>
        <div className="mt-3 flex gap-4 text-sm text-[var(--foreground-muted)]">
          <a href="https://x.com/jeeffreyLin" target="_blank" rel="noopener noreferrer" className="underline decoration-gray-300 hover:decoration-gray-500 transition-colors">x</a>
          <a href="https://ca.linkedin.com/in/jeffreyllin" target="_blank" rel="noopener noreferrer" className="underline decoration-gray-300 hover:decoration-gray-500 transition-colors">linkedin</a>
          <a href="https://github.com/JeffreyLin1" target="_blank" rel="noopener noreferrer" className="underline decoration-gray-300 hover:decoration-gray-500 transition-colors">github</a>
        </div>

        <p className="mt-5 leading-relaxed">
          2nd year SYDE @ UWaterloo.
        </p>
        <h2 className="text-lg font-semibold text-[var(--foreground-strong)] mt-8">Work</h2>

        <div className="mt-3 space-y-5">
          <div>
            <a href="https://www.fleetline.ai/" target="_blank" rel="noopener noreferrer" className="font-medium text-[var(--foreground-strong)] underline decoration-gray-300 hover:decoration-gray-500 transition-colors">Fleetline (current)</a>
            <p className="mt-1 text-[var(--foreground-muted)] leading-relaxed">Optimization algorithms for trucking.
              Backed by YC (S25), Bloomberg Beta, BoxGroup, and more.</p>
          </div>

          <div>
            <a href="https://www.shopify.com" target="_blank" rel="noopener noreferrer" className="font-medium text-[var(--foreground-strong)] underline decoration-gray-300 hover:decoration-gray-500 transition-colors">Shopify (2025)</a>
            <p className="mt-1 text-[var(--foreground-muted)] leading-relaxed">Worked on Sidekick.
              I made a synthetic feedback loop for models to learn from mistakes,
              finetuning w/ auto generated data targetted at prod errors.
            </p>
          </div>

          <div>
            <a href="https://ca.linkedin.com/company/agentnoon" target="_blank" rel="noopener noreferrer" className="font-medium text-[var(--foreground-strong)] underline decoration-gray-300 hover:decoration-gray-500 transition-colors">Agentnoon (2025)</a>
            <p className="mt-1 text-[var(--foreground-muted)] leading-relaxed">I worked on enterprise workforce planning software.
              Backed by YC (W22) and got acquired by DayForce.</p>
          </div>
        </div>
        <h2 className="text-lg font-semibold text-[var(--foreground-strong)] mt-10">Projects</h2>

        <div className="mt-3 space-y-5">
          <div>
            <a href="https://jello.gg/" target="_blank" rel="noopener noreferrer" className="font-medium text-[var(--foreground-strong)] underline decoration-gray-300 hover:decoration-gray-500 transition-colors">Jello.gg</a>
            <p className="mt-1 text-[var(--foreground-muted)] leading-relaxed">Paper.io but you bet real money via Solana.
              At it's peak we were handling money in the thousands.
              I launched a coin ($PLAYJELLO) for it and it made me almost $1k
              in fees.
            </p>
          </div>

          <div>
            <a href="https://brainrot.mov/" target="_blank" rel="noopener noreferrer" className="font-medium text-[var(--foreground-strong)] underline decoration-gray-300 hover:decoration-gray-500 transition-colors">Brainrot.mov</a>
            <p className="mt-1 text-[var(--foreground-muted)] leading-relaxed">First profitable project, a website to generate videos of
              Peter Griffin explaining stuff to Stewie. Our users had 100k+ followers and generated
              millions of views. We hit $1k MRR and then sold it.</p>
          </div>

          <div>
            <a href="https://www.uwsummit.ca/" target="_blank" rel="noopener noreferrer" className="font-medium text-[var(--foreground-strong)] underline decoration-gray-300 hover:decoration-gray-500 transition-colors">UWSummit</a>
            <p className="mt-1 text-[var(--foreground-muted)] leading-relaxed">My first viral project, Hot or Not for UWaterloo students
              but instead of looks its their linkedin, &quot;Who&apos;s more cracked&quot;. 100k visits, 3 days, sold it to Clado (YC X25).
            </p>
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
