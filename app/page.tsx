"use client";

import HalftoneVideo from "./components/halftone-video";
import { useLanguage } from "./components/language-provider";
import RichText from "./components/rich-text";

export default function Home() {
  const { t } = useLanguage();

  return (
    <div>
      <div className="pt-1">
        <HalftoneVideo src="/white.mp4" srcDark="/jellyfish.mp4" gridSizeDark={4} dotRadiusDark={3.5} />
      </div>
      {t.home.intro.map((paragraph, idx) => (
        <p key={idx} className={idx === 0 ? "mt-5 leading-relaxed" : "mt-3 leading-relaxed"}>
          <RichText parts={paragraph} />
        </p>
      ))}
    </div>
  );
}
