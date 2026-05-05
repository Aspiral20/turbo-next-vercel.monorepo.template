import { defineRouting } from 'next-intl/routing';
import { LanguagesEnum } from "@/_types/i18n.types";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: [
    LanguagesEnum.en,
    LanguagesEnum.ru,
    LanguagesEnum.ch,
    LanguagesEnum.jp,
  ],

  // Used when no locale matches
  defaultLocale: LanguagesEnum.en,
});
