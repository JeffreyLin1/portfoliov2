import Image from "next/image";
import HalftoneVideo from "./components/halftone-video";

export default function Home() {
  return (
    <div>
      <h1 className="text-3xl font-semibold text-[var(--foreground-strong)]">Jeffrey Lin</h1>
      <div className="pt-4">
        <HalftoneVideo src="/white.mp4" srcDark="/jellyfish.mp4" gridSizeDark={8} dotRadiusDark={7} />
      </div>
      <p className="mt-5 leading-relaxed">
        I study Systems Design Engineering at the University of Waterloo. I was most recently a founding engineer at <a href="https://www.fleetline.ai/" target="_blank" rel="noopener noreferrer" className="font-semibold text-[var(--link)] underline decoration-[var(--link)]/40 hover:text-[var(--link-hover)] hover:decoration-[var(--link-hover)] transition-colors">Fleetline</a> (YC S25)
        building optimization algorithms for trucking routes.
      </p>
      <p className="mt-3 leading-relaxed">
        Previously, I built and sold a <a href="https://uwsummit-git-main-jeffreylin1s-projects.vercel.app/" target="_blank" rel="noopener noreferrer" className="font-semibold text-[var(--link)] underline decoration-[var(--link)]/40 hover:text-[var(--link-hover)] hover:decoration-[var(--link-hover)] transition-colors">viral website</a>, then I took <a href="https://brainrot.mov/" target="_blank" rel="noopener noreferrer" className="font-semibold text-[var(--link)] underline decoration-[var(--link)]/40 hover:text-[var(--link-hover)] hover:decoration-[var(--link-hover)] transition-colors">another one</a> to $1k in monthly revenue and sold that one too. I also interned at <a href="https://www.shopify.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-[var(--link)] underline decoration-[var(--link)]/40 hover:text-[var(--link-hover)] hover:decoration-[var(--link-hover)] transition-colors">Shopify</a> and <a href="https://www.agentnoon.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-[var(--link)] underline decoration-[var(--link)]/40 hover:text-[var(--link-hover)] hover:decoration-[var(--link-hover)] transition-colors">Agentnoon</a> (YC W22).
      </p>

    </div>
  );
}
