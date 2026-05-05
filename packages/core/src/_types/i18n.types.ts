export enum LanguagesEnum {
  en = 'en',
  ru = 'ru',
  ch = 'ch',
  jp = 'jp',
}

export type TranslationPropType = Promise<{ locale: string | LanguagesEnum }>;