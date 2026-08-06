import type { Metadata } from "next";
import { dictionary } from "../lib/i18n";
import { getLang } from "../lib/lang-server";
import ProjectsContent from "./projects-content";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  return { title: dictionary[lang].titles.projects };
}

export default function ProjectsPage() {
  return <ProjectsContent />;
}
