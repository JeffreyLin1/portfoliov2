import type { Metadata } from "next";
import { getBlogs } from "../lib/blogs";
import { dictionary } from "../lib/i18n";
import { getLang } from "../lib/lang-server";
import WritingContent from "./writing-content";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  return { title: dictionary[lang].titles.writing };
}

export default async function WritingPage() {
  const blogs = await getBlogs();

  return <WritingContent blogs={blogs} />;
}
