import { cookies } from "next/headers";
import { DEFAULT_LANG, isLang, LANG_COOKIE, type Lang } from "./i18n";

/**
 * Language for the current request, from the cookie the toggle writes.
 * Reading it makes the page dynamic, which is what lets the server render
 * the right language on first paint instead of flashing English.
 */
export async function getLang(): Promise<Lang> {
  const value = (await cookies()).get(LANG_COOKIE)?.value;
  return isLang(value) ? value : DEFAULT_LANG;
}
