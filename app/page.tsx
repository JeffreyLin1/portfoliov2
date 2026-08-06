"use client";

import HalftoneVideo from "./components/halftone-video";
import { useLanguage } from "./components/language-provider";
import RichText from "./components/rich-text";

export default function Home() {
  const { t } = useLanguage();

  return (
    <div>
      <h1 className="text-3xl font-semibold text-[var(--foreground-strong)]">{t.home.name}</h1>
      <div className="pt-4">
        <HalftoneVideo src="/white.mp4" srcDark="/jellyfish.mp4" gridSizeDark={8} dotRadiusDark={7} />
      </div>
      {t.home.intro.map((paragraph, idx) => (
        <p key={idx} className={idx === 0 ? "mt-5 leading-relaxed" : "mt-3 leading-relaxed"}>
          <RichText parts={paragraph} />
        </p>
      ))}
    </div>
  );
}
