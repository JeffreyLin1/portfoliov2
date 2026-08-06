"use client";

import Image from "next/image";
import { useLanguage } from "../components/language-provider";
import type { Lang } from "../lib/i18n";

const work: {
  href: string;
  name: string;
  image: string;
  date: string;
  description: Record<Lang, string>;
}[] = [
  {
    href: "https://www.fleetline.ai/",
    name: "Fleetline",
    image: "/fleet.webp",
    date: "2026",
    description: {
      en: "Founding engineer - Optimization algorithms for trucking. YC S25.",
      zh: "创始工程师 —— 货运路线优化算法。YC S25。",
    },
  },
  {
    href: "https://www.shopify.com",
    name: "Shopify",
    image: "/shoppreview.webp",
    date: "2025",
    description: {
      en: "Engineering intern - worked on Sidekick. I built a synthetic feedback loop to finetune models on prod errors.",
      zh: "软件工程实习生 —— 参与 Sidekick 项目。我搭建了一套合成反馈流程，用生产环境中的错误来微调模型。",
    },
  },
  {
    href: "https://ca.linkedin.com/company/agentnoon",
    name: "Agentnoon",
    image: "/agen2.webp",
    date: "2025",
    description: {
      en: "Engineering intern - Enterprise workforce planning software. I built efficient tree traversal algorithms to handle gargantuan sizes of hierarchical data. YC W22.",
      zh: "软件工程实习生 —— 企业人力规划软件。我实现了高效的树遍历算法，用来处理超大规模的层级数据。YC W22。",
    },
  },
];

export default function WorkContent() {
  const { lang } = useLanguage();

  return (
    <div>
      <div className="mt-3 grid grid-cols-1 gap-4">
        {work.map((item, idx) => (
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
                sizes="(max-width: 768px) 100vw, 640px"
                priority={idx === 0}
                loading={idx === 0 ? "eager" : "lazy"}
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
                {item.description[lang]}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
