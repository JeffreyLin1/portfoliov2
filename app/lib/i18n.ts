export type Lang = "en" | "zh";

export const LANGS: Lang[] = ["en", "zh"];
export const DEFAULT_LANG: Lang = "en";
export const LANG_COOKIE = "lang";

/** `html[lang]` value for each language. */
export const HTML_LANG: Record<Lang, string> = {
  en: "en",
  zh: "zh-Hans",
};

export function isLang(value: unknown): value is Lang {
  return value === "en" || value === "zh";
}

/** A run of text in a sentence, optionally wrapped in a link. */
export type Part = { text: string; href?: string };

const fleetline = "https://www.fleetline.ai/";
const uwsummit = "https://uwsummit-git-main-jeffreylin1s-projects.vercel.app/";
const brainrot = "https://brainrot.mov/";
const shopify = "https://www.shopify.com";
const agentnoon = "https://www.agentnoon.com";
const github = "https://github.com/JeffreyLin1";

const en = {
  langToggle: {
    // Names the language you switch *to*.
    label: "中文",
    ariaLabel: "切换到中文",
  },
  titles: {
    projects: "Projects — Jeffrey Lin",
    work: "Work — Jeffrey Lin",
    writing: "Writing — Jeffrey Lin",
  },
  home: {
    name: "Jeffrey Lin",
    intro: [
      [
        {
          text: "I study Systems Design Engineering at the University of Waterloo. I was most recently a founding engineer at ",
        },
        { text: "Fleetline", href: fleetline },
        { text: " (YC S25) building optimization algorithms for trucking routes." },
      ],
      [
        { text: "Previously, I built and sold a " },
        { text: "viral website", href: uwsummit },
        { text: ", then I took " },
        { text: "another one", href: brainrot },
        { text: " to $1k in monthly revenue and sold that one too. I also interned at " },
        { text: "Shopify", href: shopify },
        { text: " and " },
        { text: "Agentnoon", href: agentnoon },
        { text: " (YC W22)." },
      ],
    ] as Part[][],
  },
  projects: {
    more: [
      { text: "Check out my " },
      { text: "github", href: github },
      { text: " for more." },
    ] as Part[],
  },
  writing: {
    empty: "No writing yet.",
  },
  blog: {
    back: "← back",
  },
  footer: {
    x: "x",
    linkedin: "linkedin",
    github: "github",
    email: "email",
  },
};

/** Same shape as `en`, so a missing translation is a type error. */
const zh: typeof en = {
  langToggle: {
    label: "EN",
    ariaLabel: "Switch to English",
  },
  titles: {
    projects: "项目 — Jeffrey Lin",
    work: "工作 — Jeffrey Lin",
    writing: "文章 — Jeffrey Lin",
  },
  home: {
    name: "Jeffrey Lin",
    intro: [
      [
        { text: "我在滑铁卢大学攻读系统设计工程。我最近在 " },
        { text: "Fleetline", href: fleetline },
        { text: "（YC S25）担任创始工程师，为货运路线开发优化算法。" },
      ],
      [
        { text: "在这之前，我做了一个 " },
        { text: "爆火的网站", href: uwsummit },
        { text: " 并把它卖掉了，之后又把 " },
        { text: "另一个网站", href: brainrot },
        { text: " 做到每月一千美元的收入，同样卖了出去。我还在 " },
        { text: "Shopify", href: shopify },
        { text: " 和 " },
        { text: "Agentnoon", href: agentnoon },
        { text: "（YC W22）实习过。" },
      ],
    ],
  },
  projects: {
    more: [
      { text: "更多项目请看我的 " },
      { text: "GitHub", href: github },
      { text: "。" },
    ],
  },
  writing: {
    empty: "还没有文章。",
  },
  blog: {
    back: "← 返回",
  },
  footer: {
    x: "x",
    linkedin: "领英",
    github: "github",
    email: "邮箱",
  },
};

export const dictionary = { en, zh } as const;

export type Dictionary = typeof en;
