import { DEFAULT_LANG, type Lang } from "./i18n";

/**
 * Language for the current request. Pinned to English now that the toggle is
 * gone, so an old `lang=zh` cookie can't strand a visitor in Chinese.
 */
export async function getLang(): Promise<Lang> {
  return DEFAULT_LANG;
}
