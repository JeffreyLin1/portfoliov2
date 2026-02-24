"use client";

import { useState } from "react";
import Image from "next/image";
import HoverItem from "./HoverItem";

const details: Record<string, React.ReactNode> = {
  "SYDE @ UWaterloo": <Image src="/waterloodetail.jpg" alt="UWaterloo" width={300} height={200} className="w-full" />,
  "SWE @ Fleetline": <p></p>,
  "SWE @ Shopify": <p></p>,
  "SWE @ Agentnoon": <p></p>,
  "Jello.gg": <p></p>,
  "Brainrot.mov": <p></p>,
  "UWSummit": <p></p>,
};

export default function Home() {
  const [active, setActive] = useState<string>("SYDE @ UWaterloo");

  return (
    <div className="min-h-screen flex justify-center bg-white">
      <div className="w-full max-w-lg px-6 pt-24 flex gap-6">
        <main className="w-1/2">
          <h1 className="text-3xl">Jeffrey Lin</h1>

          <section className="mt-12">
            <h2 className="text-lg mb-2">Education</h2>
            <HoverItem label="SYDE @ UWaterloo" onHover={setActive}>
              SYDE @ UWaterloo
            </HoverItem>
          </section>

          <section className="mt-10">
            <h2 className="text-lg mb-2">Career</h2>
            <div className="flex flex-col">
              <HoverItem label="SWE @ Fleetline" onHover={setActive}>
                SWE, Fleetline
              </HoverItem>
              <HoverItem label="SWE @ Shopify" onHover={setActive}>
                SWE, Shopify
              </HoverItem>
              <HoverItem label="SWE @ Agentnoon" onHover={setActive}>
                SWE, Agentnoon
              </HoverItem>
            </div>
          </section>

          <section className="mt-10">
            <h2 className="text-lg mb-2">Projects</h2>
            <div className="flex flex-col">
              <HoverItem label="Jello.gg" onHover={setActive}>
                Jello.gg
              </HoverItem>
              <HoverItem label="Brainrot.mov" onHover={setActive}>
                Brainrot.mov
              </HoverItem>
              <HoverItem label="UWSummit" onHover={setActive}>
                UWSummit
              </HoverItem>
            </div>
          </section>
        </main>

        <aside className="w-1/2 pt-20">
          <div>
            {details[active]}
          </div>
        </aside>
      </div>
    </div>
  );
}
