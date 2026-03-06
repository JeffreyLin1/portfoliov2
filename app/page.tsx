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
    <div className="min-h-screen flex justify-center bg-white">
      <main className="flex min-h-screen w-full max-w-2xl flex-col px-6 pt-24 pb-8">
        <h1 className="text-3xl font-bold">Hi! I&apos;m Jeffrey.</h1>
        <div className="mt-2 flex gap-4 text-sm">
          <a href="https://x.com/jeeffreyLin" target="_blank" rel="noopener noreferrer" className="underline">x</a>
          <a href="https://ca.linkedin.com/in/jeffreyllin" target="_blank" rel="noopener noreferrer" className="underline">linkedin</a>
          <a href="https://github.com/JeffreyLin1" target="_blank" rel="noopener noreferrer" className="underline">github</a>
        </div>

        <p className="mt-4 text-sm leading-relaxed">
          Currently studying SYDE @ UWaterloo.
        </p>
        <h2 className="text-l font-bold mt-4">Work</h2>

        <div className="mt-2 space-y-4 text-sm">
          <div>
            <a href="https://www.fleetline.ai/" target="_blank" rel="noopener noreferrer" className="underline">Fleetline (current)</a>
            <p className="leading-relaxed">Optimization algorithms for trucking. 
              Backed by YC (S25), Bloomberg Beta, BoxGroup, and more.</p>
          </div>

          <div>
            <a href="https://www.shopify.com" target="_blank" rel="noopener noreferrer" className="underline">Shopify (2025)</a>
            <p className="leading-relaxed">Worked on Sidekick. 
              I made a synthetic feedback loop for models to learn from mistakes,
              finetuning w/ auto generated data targetted at prod errors.
            </p>
          </div>

          <div>
            <a href="https://ca.linkedin.com/company/agentnoon" target="_blank" rel="noopener noreferrer" className="underline">Agentnoon (2025)</a>
            <p className="leading-relaxed">I worked on enterprise workforce planning software. 
              Backed by YC (W22) and got acquired by DayForce.</p>
          </div>
        </div>
        <h2 className="text-l font-bold mt-8">Projects</h2>

        <div className="mt-2 space-y-4 text-sm">
          <div>
            <a href="https://jello.gg/" target="_blank" rel="noopener noreferrer" className="underline">Jello.gg</a>
            <p className="leading-relaxed">Paper.io but you bet real money via Solana.
              Blew up within the crypto community, we had
              a lot of players wagering money in real time and we were handling a lot of money.
              I launched a coin ($PLAYJELLO) for it and it made me almost $1k
              in fees.
            </p>
          </div>

          <div>
            <a href="https://brainrot.mov/" target="_blank" rel="noopener noreferrer" className="underline">Brainrot.mov</a>
            <p className="leading-relaxed">First profitable project. Website to generate reels/tiktoks of 
              Peter Griffin explaining stuff to Stewie. You&apos;ve probably seen 
              our videos, our users had 100k+ followers and generated
              millions of views. We hit $1k MRR and then sold it.            </p>
          </div>
 
          <div>
            <a href="https://www.uwsummit.ca/" target="_blank" rel="noopener noreferrer" className="underline">UWSummit</a>
            <p className="leading-relaxed">My first viral project, Hot or Not for UWaterloo students
              but instead of looks its their linkedin, &quot;Who&apos;s more cracked&quot;. This project
              taught me what RLS was (lol) and recieved a lot of attention (100k visits, 3 days). 
            </p>
          </div>
        </div>
        <h2 className="text-l font-bold mt-8">Writing</h2>
        {blogs.length === 0 ? (
          <p className="mt-2 text-sm leading-relaxed">No writing yet.</p>
        ) : (
          <ul className="mt-2 space-y-2 text-sm">
            {blogs.map((blog) => (
              <li key={blog.slug}>
                <Link href={`/blogs/${blog.slug}`} className="underline">
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
