import { getTranslations } from "next-intl/server";
import { Metadata } from "next";

export type MetadataConfigPropsType = { locale: string };

export type GenI18nMetadataPropsType = { t: any };

export type DefaultCellMetadataConfigType = (props: MetadataConfigPropsType) => Promise<Metadata>;

/**
 * Wraps a metadata factory with automatic i18n translation injection.
 *
 * Usage in config.ts:
 *   genI18nMetadata(({ t }) => ({
 *     title: t('metadata.main.title'),
 *     description: t('metadata.main.description'),
 *     ...
 *   }))
 *
 * Usage in generateMetadata:
 *   export const generateMetadata = ({ params }) => nextMetadata.main({ locale });
 */
export const genI18nMetadata = (
  func: (props: GenI18nMetadataPropsType) => Metadata
): DefaultCellMetadataConfigType => {
  return async ({ locale }: MetadataConfigPropsType) => {
    const t = await getTranslations({ locale });
    return func({ t });
  };
};