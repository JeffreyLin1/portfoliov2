import Image from "next/image";

export const metadata = {
  title: "Projects — Jeffrey Lin",
};

const projects = [
  {
    href: "https://jello.gg/",
    name: "Jello.gg",
    image: "/jellopre-game.png",
    date: "2026",
    tags: ["Web3", "Multiplayer", "AWS", "Redis", "Real users"],
    description:
      "Paper.io but you bet real money via Solana. At our peak we had 100+ concurrent players. I launched $PLAYJELLO on Bags and made almost $1k in fees",
  },
  {
    href: "https://brainrot.mov/",
    name: "Brainrot.mov",
    image: "/brainrot.webp",
    date: "2025",
    tags: ["AI", "AWS", "SaaS", "Real revenue", "Real users", "Acquired"],
    description:
      "First profitable project. At the time we sold the website, we were making around $1k MRR. Our app uses AI to generate short form content, like Peter Griffin talking to Stewie. Plently of our users gathered millions of views using brainrot",
  },
  {
    href: "https://uwsummit-git-main-jeffreylin1s-projects.vercel.app/",
    name: "UWSummit",
    image: "/summit.webp",
    date: "2025",
    tags: ["Social", "Real users", "Supabase", "Acquired"],
    description:
      "First viral project. Hot or Not but for UWaterloo linkedin profiles. It got 100k visits in 3 days then we sold it to Clado (YC X25) because we kept getting botted",
  },
];

export default function ProjectsPage() {
  return (
    <div>
      <div className="mt-3 grid grid-cols-1 gap-4">
        {projects.map((item) => (
          <a
            key={item.name}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
          >
            <div className="relative aspect-video w-full overflow-hidden bg-gray-100 dark:bg-gray-900">
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="(max-width: 768px) 50vw, 300px"
                className="object-cover scale-105 transition-transform duration-500 ease-out group-hover:scale-100"
              />
            </div>
            <div className="px-4 pb-4">
              <div className="mt-3 flex items-baseline justify-between gap-2">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <h2 className="font-medium text-[var(--foreground-strong)]">{item.name}</h2>
                  <div className="flex flex-wrap gap-1">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-[var(--foreground-muted)] rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="text-sm text-[var(--foreground-muted)]">
                  <span className="group-hover:hidden">{item.date}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="hidden group-hover:inline-block align-middle"
                  >
                    <path d="M15 3h6v6" />
                    <path d="M10 14 21 3" />
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  </svg>
                </span>
              </div>
              <p className="mt-1 text-sm text-[var(--foreground-muted)] leading-relaxed">
                {item.description}
              </p>
            </div>
          </a>
        ))}
      </div>
      <p className="mt-4 text-sm text-[var(--foreground-muted)]">
        Check out my <a href="https://github.com/JeffreyLin1" target="_blank" rel="noopener noreferrer" className="font-semibold text-[var(--link)] underline decoration-[var(--link)]/40 hover:text-[var(--link-hover)] hover:decoration-[var(--link-hover)] transition-colors">github</a> for more.
      </p>
    </div>
  );
}
