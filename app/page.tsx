import { promises as fs } from "node:fs";
import path from "node:path";
import Image from "next/image";
import Link from "next/link";

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
      <main className="flex min-h-screen w-full max-w-2xl flex-col px-6 pt-8 pb-8">
        <div className="relative">
          <div>

            <h1 className="text-3xl font-semibold text-[var(--foreground-strong)]">Jeffrey Lin</h1>
            <div className="mt-3 flex gap-4 text-sm text-[var(--foreground-muted)]">
              <a href="https://x.com/jeeffreyLin" target="_blank" rel="noopener noreferrer" className="underline decoration-gray-300 hover:decoration-gray-500 transition-colors">x</a>
              <a href="https://ca.linkedin.com/in/jeffreyllin" target="_blank" rel="noopener noreferrer" className="underline decoration-gray-300 hover:decoration-gray-500 transition-colors">linkedin</a>
              <a href="https://github.com/JeffreyLin1" target="_blank" rel="noopener noreferrer" className="underline decoration-gray-300 hover:decoration-gray-500 transition-colors">github</a>
            </div>
            <p className="mt-5 leading-relaxed">
             I'm currently in my second year studying Systems Design Engineering at UWaterloo. I've been coding since I was 8, starting with HTML and games in Turing.
             I love challenges and forcing myself into weird situations, like spending 30 days biking across the rockies or building an online gambling game.
            <br></br><br></br>I live to be free and to help others. 
            </p>
          </div>
          
        </div>
        <h2 className="text-lg font-semibold text-[var(--foreground-strong)] mt-5">Work</h2>

        <div className="mt-3 space-y-3">
          <div>
            <a href="https://www.fleetline.ai/" target="_blank" rel="noopener noreferrer" className="font-medium text-[var(--foreground-strong)] underline decoration-gray-300 hover:decoration-gray-500 transition-colors">Fleetline (current)</a>
            <p className="mt-1 text-[var(--foreground-muted)] leading-relaxed">2nd Engineering hire - Optimization algorithms for trucking. YC S25.</p>
          </div>

          <div>
            <a href="https://www.shopify.com" target="_blank" rel="noopener noreferrer" className="font-medium text-[var(--foreground-strong)] underline decoration-gray-300 hover:decoration-gray-500 transition-colors">Shopify (2025)</a>
            <p className="mt-1 text-[var(--foreground-muted)] leading-relaxed">Engineering intern - worked on Sidekick. I built a synthetic feedback loop to finetune models on prod errors.</p>
          </div>

          <div>
            <a href="https://ca.linkedin.com/company/agentnoon" target="_blank" rel="noopener noreferrer" className="font-medium text-[var(--foreground-strong)] underline decoration-gray-300 hover:decoration-gray-500 transition-colors">Agentnoon (2025)</a>
            <p className="mt-1 text-[var(--foreground-muted)] leading-relaxed">Enginereing intern - Enterprise workforce planning software. I built efficient tree traversal algorithms to handle gargantuan sizes of hierarchical data.
              YC W22.</p>
          </div>
        </div>
        <h2 className="text-lg font-semibold text-[var(--foreground-strong)] mt-6">Projects</h2>

        <div className="mt-3 space-y-3">
          <div>
            <a href="https://jello.gg/" target="_blank" rel="noopener noreferrer" className="font-medium text-[var(--foreground-strong)] underline decoration-gray-300 hover:decoration-gray-500 transition-colors">Jello.gg</a>
            <p className="mt-1 text-[var(--foreground-muted)] leading-relaxed">Paper.io but you bet real money via Solana. We had 100+ concurrent players at it's peak. I launched $PLAYJELLO on Bags and made almost $1k in fees.</p>
          </div>

          <div>
            <a href="https://brainrot.mov/" target="_blank" rel="noopener noreferrer" className="font-medium text-[var(--foreground-strong)] underline decoration-gray-300 hover:decoration-gray-500 transition-colors">Brainrot.mov</a>
            <p className="mt-1 text-[var(--foreground-muted)] leading-relaxed">First profitable project ($1k+ MRR). Our app uses AI to generate short form content, like Peter Griffin talking to Stewie. Our users generated millions of views and we eventually sold the website.</p>
          </div>

          <div>
            <a href="https://www.uwsummit.ca/" target="_blank" rel="noopener noreferrer" className="font-medium text-[var(--foreground-strong)] underline decoration-gray-300 hover:decoration-gray-500 transition-colors">UWSummit</a>
            <p className="mt-1 text-[var(--foreground-muted)] leading-relaxed">First viral project. Hot or Not but for UWaterloo linkedin profiles. It got 100k visits in 3 days then we sold it to Clado (YC X25) because we kept getting botted.</p>
          </div>
        </div>
        <h2 className="text-lg font-semibold text-[var(--foreground-strong)] mt-6">Writing</h2>
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
      </main>
    </div>
  );
}
