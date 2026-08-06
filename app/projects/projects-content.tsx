"use client";

import Image from "next/image";
import { useLanguage } from "../components/language-provider";
import RichText from "../components/rich-text";
import type { Lang } from "../lib/i18n";

type Localized<T> = Record<Lang, T>;

const projects: {
  href: string;
  name: string;
  image: string;
  date: string;
  tags: Localized<string[]>;
  description: Localized<string>;
}[] = [
  {
    href: "https://jello.gg/",
    name: "Jello.gg",
    image: "/jellopre-game.png",
    date: "2026",
    tags: {
      en: ["Web3", "Multiplayer", "AWS", "Redis", "Real users"],
      zh: ["Web3", "多人对战", "AWS", "Redis", "真实用户"],
    },
    description: {
      en: "Paper.io but you bet real money via Solana. At our peak we had 100+ concurrent players. I launched $PLAYJELLO on Bags and made almost $1k in fees",
      zh: "类似 Paper.io，但玩家通过 Solana 押上真钱。高峰期同时在线玩家超过 100 人。我在 Bags 上发行了 $PLAYJELLO，赚了将近一千美元的手续费",
    },
  },
  {
    href: "https://brainrot.mov/",
    name: "Brainrot.mov",
    image: "/brainrot.webp",
    date: "2025",
    tags: {
      en: ["AI", "AWS", "SaaS", "Real revenue", "Real users", "Acquired"],
      zh: ["AI", "AWS", "SaaS", "真实收入", "真实用户", "已被收购"],
    },
    description: {
      en: "First profitable project. At the time we sold the website, we were making around $1k MRR. Our app uses AI to generate short form content, like Peter Griffin talking to Stewie. Plently of our users gathered millions of views using brainrot",
      zh: "我的第一个盈利项目。卖掉网站时，月经常性收入大约一千美元。这个产品用 AI 生成短视频内容，比如 Peter Griffin 和 Stewie 的对话。不少用户靠它做出了上百万播放量的视频",
    },
  },
  {
    href: "https://uwsummit-git-main-jeffreylin1s-projects.vercel.app/",
    name: "UWSummit",
    image: "/summit.webp",
    date: "2025",
    tags: {
      en: ["Social", "Real users", "Supabase", "Acquired"],
      zh: ["社交", "真实用户", "Supabase", "已被收购"],
    },
    description: {
      en: "First viral project. Hot or Not but for UWaterloo linkedin profiles. It got 100k visits in 3 days then we sold it to Clado (YC X25) because we kept getting botted",
      zh: "我的第一个爆火项目。类似 Hot or Not，但比的是滑铁卢大学学生的领英主页。三天内获得十万访问量，后来因为不断被机器人刷量，我们把它卖给了 Clado（YC X25）",
    },
  },
];

export default function ProjectsContent() {
  const { lang, t } = useLanguage();

  return (
    <div>
      <div className="mt-3 grid grid-cols-1 gap-4">
        {projects.map((item, idx) => (
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
                <div className="flex items-baseline gap-2 flex-wrap">
                  <h2 className="font-medium text-[var(--foreground-strong)]">{item.name}</h2>
                  <div className="flex flex-wrap gap-1">
                    {item.tags[lang].map((tag) => (
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
                {item.description[lang]}
              </p>
            </div>
          </a>
        ))}
      </div>
      <p className="mt-4 text-sm text-[var(--foreground-muted)]">
        <RichText parts={t.projects.more} />
      </p>
    </div>
  );
}
