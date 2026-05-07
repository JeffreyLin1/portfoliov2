import Image from "next/image";
import HalftoneVideo from "./components/halftone-video";

export default function Home() {
  return (
    <div>
      <h1 className="text-3xl font-semibold text-[var(--foreground-strong)]">Jeffrey Lin</h1>
      <div className="pt-4">
        <HalftoneVideo src="/white.mp4" />
      </div>
      <p className="mt-5 leading-relaxed">
        I study Systems Design Engineering at the University of Waterloo. Currently, I'm an engineer at <a href="https://www.fleetline.ai/" target="_blank" rel="noopener noreferrer" className="underline decoration-gray-300 hover:decoration-gray-500 transition-colors">Fleetline</a> (YC S25) 
        building optimization algorithms for trucking routes. 
      </p>
      <p className="mt-3 leading-relaxed">
        Previously, I built and sold a viral website, then I took another one to $1k in monthly revenue and sold that one too. I also interned at Shopify and Agentnoon (YC W22).
      </p>

    </div>
  );
}
