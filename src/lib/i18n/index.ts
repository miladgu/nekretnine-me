import { dictionaries, DEFAULT_LOCALE, type Dict, type Locale } from "./dictionaries";
import { me } from "./me";
import { ru } from "./ru";

export const messages: Record<Locale, Dict> = {
  en: dictionaries.en,
  me,
  ru,
};

export function getDict(locale: Locale | undefined): Dict {
  return messages[locale ?? DEFAULT_LOCALE] ?? messages[DEFAULT_LOCALE];
}

export { LOCALES, LOCALE_LABEL, DEFAULT_LOCALE } from "./dictionaries";
export type { Locale, Dict } from "./dictionaries";
