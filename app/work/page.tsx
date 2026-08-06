import type { Metadata } from "next";
import { dictionary } from "../lib/i18n";
import { getLang } from "../lib/lang-server";
import WorkContent from "./work-content";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  return { title: dictionary[lang].titles.work };
}

export default function WorkPage() {
  return <WorkContent />;
}
