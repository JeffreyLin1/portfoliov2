export const metadata = {
  title: "Work — Jeffrey Lin",
};

const work = [
  {
    href: "https://www.fleetline.ai/",
    name: "Fleetline (current)",
    description: "3rd Engineering hire - Optimization algorithms for trucking. YC S25.",
  },
  {
    href: "https://www.shopify.com",
    name: "Shopify (2025)",
    description:
      "Engineering intern - worked on Sidekick. I built a synthetic feedback loop to finetune models on prod errors.",
  },
  {
    href: "https://ca.linkedin.com/company/agentnoon",
    name: "Agentnoon (2025)",
    description:
      "Engineering intern - Enterprise workforce planning software. I built efficient tree traversal algorithms to handle gargantuan sizes of hierarchical data. YC W22.",
  },
];

export default function WorkPage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold text-[var(--foreground-strong)]">Work</h1>
      <div className="mt-5 space-y-4">
        {work.map((item) => (
          <div key={item.name}>
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[var(--foreground-strong)] underline decoration-gray-300 hover:decoration-gray-500 transition-colors"
            >
              {item.name}
            </a>
            <p className="mt-1 text-[var(--foreground-muted)] leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
