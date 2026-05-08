import Image from "next/image";

export const metadata = {
  title: "Work — Jeffrey Lin",
};

const work = [
  {
    href: "https://www.fleetline.ai/",
    name: "Fleetline",
    image: "/fleet.webp",
    date: "2026",
    description: "Founding engineer - Optimization algorithms for trucking. YC S25.",
  },
  {
    href: "https://www.shopify.com",
    name: "Shopify",
    image: "/shoppreview.webp",
    date: "2025",
    description:
      "Engineering intern - worked on Sidekick. I built a synthetic feedback loop to finetune models on prod errors.",
  },
  {
    href: "https://ca.linkedin.com/company/agentnoon",
    name: "Agentnoon",
    image: "/agen2.webp",
    date: "2025",
    description:
      "Engineering intern - Enterprise workforce planning software. I built efficient tree traversal algorithms to handle gargantuan sizes of hierarchical data. YC W22.",
  },
];

export default function WorkPage() {
  return (
    <div>
      <div className="mt-3 grid grid-cols-1 gap-4">
        {work.map((item) => (
          <a
            key={item.name}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="(max-width: 768px) 100vw, 600px"
                className="object-cover scale-105 transition-transform duration-500 ease-out group-hover:scale-100"
              />
            </div>
            <div className="px-4 pb-4">
              <div className="mt-3 flex items-baseline justify-between gap-2">
                <h2 className="font-medium text-[var(--foreground-strong)]">{item.name}</h2>
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
    </div>
  );
}
