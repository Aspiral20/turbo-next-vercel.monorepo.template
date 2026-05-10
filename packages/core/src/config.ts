import { EnvsConfigChildrenType, LocalConfigType, MetadataConfigType } from '@/_types/config.types';
import { EnvironmentEnum } from '@/_types/node_env.types';
import { localHostNames } from 'shared/src/utils/constants/local_host_names'
import { genI18nMetadata } from '@/utils/helpers/i18n-seo';
import { genAlternatesLanguages, genOgImages } from '@/utils/helpers/seo';

export const PROJECT_NAME = {
  platform: 'FitIQ',
  microFrontend: 'Core',
};

const commonEnvs: Omit<EnvsConfigChildrenType, 'ENV'> = {
  FRONT_URL: process.env.NEXT_PUBLIC_FRONT_URL ?? 'NEXT_PUBLIC_FRONT_URL',
  API_URL: process.env.NEXT_PUBLIC_API_URL ?? 'NEXT_PUBLIC_API_URL',
}

/**
 * Config
 **/
const envs: LocalConfigType<EnvsConfigChildrenType> = {
  /** Only server **/
  server: {
    ENV: process.env.NEXT_PUBLIC_NEXT_ENV ?? 'NEXT_PUBLIC_NEXT_ENV',
    GITHUB_ID: process.env.GITHUB_ID ?? 'GITHUB_ID',
    GITHUB_SECRET: process.env.GITHUB_SECRET ?? 'GITHUB_SECRET',
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ?? 'GOOGLE_CLIENT_ID',
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ?? 'GOOGLE_CLIENT_SECRET',
    NEXT_AUTH_SECRET: process.env.NEXT_AUTH_SECRET ?? 'NEXT_AUTH_SECRET',
    SMTP_HOST: process.env.SMTP_HOST ?? 'SMTP_HOST',
    SMTP_PORT: process.env.SMTP_PORT ?? 'SMTP_PORT',
    SMTP_SECURE: process.env.SMTP_SECURE ?? 'SMTP_SECURE',
    SMTP_PASS: process.env.SMTP_PASS ?? 'SMTP_PASS',
    SMTP_NOREPLY_USER: process.env.SMTP_NOREPLY_USER ?? 'SMTP_NOREPLY_USER',
    SMTP_NOREPLY_FROM: process.env.SMTP_NOREPLY_FROM ?? 'SMTP_NOREPLY_FROM',
    SUPABASE_URL: process.env.SUPABASE_URL ?? 'SUPABASE_URL',
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ?? 'SUPABASE_SERVICE_ROLE_KEY',
    ...commonEnvs,
  },
  /** Only client **/
  local: {
    ENV: EnvironmentEnum.local,
    ...commonEnvs,
  },
  production: {
    ENV: EnvironmentEnum.production,
    ...commonEnvs,
  },
};

const processConfig = (config: LocalConfigType<EnvsConfigChildrenType>) => {
  if (typeof window !== 'undefined') {
    const NEXT_PUBLIC_NEXT_ENV = process.env.NEXT_PUBLIC_NEXT_ENV;
    const { hostname } = window.location;
    if (NEXT_PUBLIC_NEXT_ENV === EnvironmentEnum.production) {
      return config.production;
    }
    if (localHostNames.indexOf(hostname) >= 0) {
      return config.local;
    }
  }

  return config.server;
};

const getConfig = () => processConfig(envs);

const config: EnvsConfigChildrenType = getConfig();

/**
 * Metadata
 **/
// const SITE_NAME = PROJECT_NAME.platform;
// const mainTitle = `${PROJECT_NAME.words.first} ${PROJECT_NAME.words.second}`;

// const description = `${mainTitle} description`;

const SITE_NAME = PROJECT_NAME.platform;
const AUTHORS = [{ name: SITE_NAME, url: config.FRONT_URL }];
const PUBLISHER = SITE_NAME;

/**
 * Keywords — defined per-page, reused across locales
 **/
const keywords = {
  main: [
    // SITE_NAME, 'keyword1', 'keyword2',
  ],
};

/**
 * Metadata
 **/
const buildMetadata = (isProd: boolean): MetadataConfigType => ({
  /** Home 
   * 
   * Below is an example based on FitIQ project. Do not use for this project, only look at structure, so you might create seo for your project.
   * 
   * **/
  // main: genI18nMetadata(({ t }) => ({
  //   title: {
  //     default: t('metadata.main.title') + (!isProd ? ` [${config.ENV}]` : ''),
  //     template: `%s | ${SITE_NAME}`,
  //   },
  //   description: t('metadata.main.description'),
  //   keywords: keywords.main,
  //   authors: AUTHORS,
  //   publisher: PUBLISHER,
  //   robots: { index: isProd, follow: isProd },
  //   alternates: {
  //     canonical: config.FRONT_URL,
  //     languages: genAlternatesLanguages(),
  //   },
  //   openGraph: {
  //     type: 'website',
  //     siteName: SITE_NAME,
  //     title: t('metadata.main.title'),
  //     description: t('metadata.main.description'),
  //     url: config.FRONT_URL,
  //     images: genOgImages('/images/progress-phone.png', `${SITE_NAME} — AI-Powered Fitness Coach`),
  //   },
  //   twitter: {
  //     card: 'summary_large_image',
  //     title: t('metadata.main.title'),
  //     description: t('metadata.main.description'),
  //     images: [`${config.FRONT_URL}/images/progress-phone.png`],
  //   },
  // })),

  /** Blog list **/
  // blog: {
  //   self: genI18nMetadata(({ t }) => ({
  //     title: t('metadata.blog.title'),
  //     description: t('metadata.blog.description'),
  //     keywords: keywords.blog,
  //     authors: AUTHORS,
  //     robots: { index: isProd, follow: isProd },
  //     alternates: {
  //       canonical: `${config.FRONT_URL}/blog`,
  //       languages: genAlternatesLanguages('/blog'),
  //     },
  //     openGraph: {
  //       type: 'website',
  //       siteName: SITE_NAME,
  //       title: `${t('metadata.blog.title')} | ${SITE_NAME}`,
  //       description: t('metadata.blog.description'),
  //       url: `${config.FRONT_URL}/blog`,
  //       images: genOgImages('/images/logo-only.png', `${SITE_NAME} Blog`),
  //     },
  //     twitter: {
  //       card: 'summary_large_image',
  //       title: `${t('metadata.blog.title')} | ${SITE_NAME}`,
  //       description: t('metadata.blog.description'),
  //       images: [`${config.FRONT_URL}/images/logo-only.png`],
  //     },
  //   })),

  //   /** Individual blog post — receives post data from DB **/
  //   post: (post: BlogPostType, locale: string) => {
  //     const translation = post.translations?.[locale] ?? post.translations?.['en'];
  //     const title = translation?.title ?? SITE_NAME;
  //     const description = translation?.seoDescription || translation?.excerpt || '';
  //     const imageUrl = post.imageUrl ?? `${config.FRONT_URL}/images/logo-only.png`;

  //     return {
  //       title,
  //       description,
  //       keywords: post.tags ?? [],
  //       authors: [{ name: post.author }],
  //       robots: { index: isProd && post.status === 'published', follow: isProd },
  //       alternates: {
  //         canonical: `${config.FRONT_URL}/blog/${post.id}`,
  //         languages: genAlternatesLanguages(`/blog/${post.id}`),
  //       },
  //       openGraph: {
  //         type: 'article',
  //         siteName: SITE_NAME,
  //         title,
  //         description,
  //         url: `${config.FRONT_URL}/blog/${post.id}`,
  //         images: [{ url: imageUrl, alt: title }],
  //         publishedTime: post.createdAt ? String(post.createdAt) : undefined,
  //         modifiedTime: post.updatedAt ? String(post.updatedAt) : undefined,
  //         authors: [post.author],
  //         section: post.category,
  //         tags: post.tags,
  //       },
  //       twitter: {
  //         card: 'summary_large_image',
  //         title,
  //         description,
  //         images: [imageUrl],
  //       },
  //     };
  //   },
  // },

  // /** Contact **/
  // contact: genI18nMetadata(({ t }) => ({
  //   title: t('metadata.contact.title'),
  //   description: t('metadata.contact.description'),
  //   keywords: keywords.contact,
  //   authors: AUTHORS,
  //   robots: { index: isProd, follow: isProd },
  //   alternates: {
  //     canonical: `${config.FRONT_URL}/contact`,
  //     languages: genAlternatesLanguages('/contact'),
  //   },
  //   openGraph: {
  //     type: 'website',
  //     siteName: SITE_NAME,
  //     title: `${t('metadata.contact.title')} | ${SITE_NAME}`,
  //     description: t('metadata.contact.description'),
  //     url: `${config.FRONT_URL}/contact`,
  //     images: genOgImages('/images/logo-only.png', `Contact ${SITE_NAME}`),
  //   },
  //   twitter: {
  //     card: 'summary',
  //     title: `${t('metadata.contact.title')} | ${SITE_NAME}`,
  //     description: t('metadata.contact.description'),
  //   },
  // })),

  // /** FAQ **/
  // faq: genI18nMetadata(({ t }) => ({
  //   title: t('metadata.faq.title'),
  //   description: t('metadata.faq.description'),
  //   keywords: keywords.faq,
  //   authors: AUTHORS,
  //   robots: { index: isProd, follow: isProd },
  //   alternates: {
  //     canonical: `${config.FRONT_URL}/faq`,
  //     languages: genAlternatesLanguages('/faq'),
  //   },
  //   openGraph: {
  //     type: 'website',
  //     siteName: SITE_NAME,
  //     title: `${t('metadata.faq.title')} | ${SITE_NAME}`,
  //     description: t('metadata.faq.description'),
  //     url: `${config.FRONT_URL}/faq`,
  //     images: genOgImages('/images/logo-only.png', `${SITE_NAME} FAQ`),
  //   },
  //   twitter: {
  //     card: 'summary',
  //     title: `${t('metadata.faq.title')} | ${SITE_NAME}`,
  //     description: t('metadata.faq.description'),
  //   },
  // })),

  // /** Privacy Policy **/
  // privacy: genI18nMetadata(({ t }) => ({
  //   title: t('metadata.privacy.title'),
  //   description: t('metadata.privacy.description'),
  //   keywords: keywords.privacy,
  //   authors: AUTHORS,
  //   robots: { index: isProd, follow: false },
  //   alternates: {
  //     canonical: `${config.FRONT_URL}/privacy`,
  //     languages: genAlternatesLanguages('/privacy'),
  //   },
  //   openGraph: {
  //     type: 'website',
  //     siteName: SITE_NAME,
  //     title: `${t('metadata.privacy.title')} | ${SITE_NAME}`,
  //     description: t('metadata.privacy.description'),
  //     url: `${config.FRONT_URL}/privacy`,
  //   },
  // })),

  // /** Terms of Service **/
  // term: genI18nMetadata(({ t }) => ({
  //   title: t('metadata.term.title'),
  //   description: t('metadata.term.description'),
  //   keywords: keywords.term,
  //   authors: AUTHORS,
  //   robots: { index: isProd, follow: false },
  //   alternates: {
  //     canonical: `${config.FRONT_URL}/term`,
  //     languages: genAlternatesLanguages('/term'),
  //   },
  //   openGraph: {
  //     type: 'website',
  //     siteName: SITE_NAME,
  //     title: `${t('metadata.term.title')} | ${SITE_NAME}`,
  //     description: t('metadata.term.description'),
  //     url: `${config.FRONT_URL}/term`,
  //   },
  // })),

  // /** Download **/
  // download: genI18nMetadata(({ t }) => ({
  //   title: t('metadata.download.title'),
  //   description: t('metadata.download.description'),
  //   keywords: keywords.download,
  //   authors: AUTHORS,
  //   robots: { index: isProd, follow: isProd },
  //   alternates: {
  //     canonical: `${config.FRONT_URL}/download`,
  //     languages: genAlternatesLanguages('/download'),
  //   },
  //   openGraph: {
  //     type: 'website',
  //     siteName: SITE_NAME,
  //     title: `${t('metadata.download.title')} | ${SITE_NAME}`,
  //     description: t('metadata.download.description'),
  //     url: `${config.FRONT_URL}/download`,
  //     images: genOgImages('/images/progress-phone.png', `Download ${SITE_NAME}`),
  //   },
  //   twitter: {
  //     card: 'summary_large_image',
  //     title: `${t('metadata.download.title')} | ${SITE_NAME}`,
  //     description: t('metadata.download.description'),
  //     images: [`${config.FRONT_URL}/images/progress-phone.png`],
  //   },
  // })),

  // /** Support list **/
  // support: {
  //   self: genI18nMetadata(({ t }) => ({
  //     title: t('metadata.support.title'),
  //     description: t('metadata.support.description'),
  //     keywords: keywords.support,
  //     authors: AUTHORS,
  //     robots: { index: isProd, follow: isProd },
  //     alternates: {
  //       canonical: `${config.FRONT_URL}/support`,
  //       languages: genAlternatesLanguages('/support'),
  //     },
  //     openGraph: {
  //       type: 'website',
  //       siteName: SITE_NAME,
  //       title: `${t('metadata.support.title')} | ${SITE_NAME}`,
  //       description: t('metadata.support.description'),
  //       url: `${config.FRONT_URL}/support`,
  //       images: genOgImages('/images/logo-only.png', `${SITE_NAME} Support`),
  //     },
  //     twitter: {
  //       card: 'summary',
  //       title: `${t('metadata.support.title')} | ${SITE_NAME}`,
  //       description: t('metadata.support.description'),
  //     },
  //   })),

  //   /** Individual support doc — receives doc data from DB **/
  //   doc: (doc: SupportDocType, locale: string) => {
  //     const translation = doc.translations?.[locale] ?? doc.translations?.['en'];
  //     const title = translation?.title ?? SITE_NAME;
  //     const description = translation?.seoDescription || translation?.excerpt || '';

  //     return {
  //       title,
  //       description,
  //       keywords: doc.tags ?? [],
  //       robots: { index: isProd && doc.status === 'published', follow: isProd },
  //       alternates: {
  //         canonical: `${config.FRONT_URL}/support/${doc.slug}`,
  //         languages: genAlternatesLanguages(`/support/${doc.slug}`),
  //       },
  //       openGraph: {
  //         type: 'article',
  //         siteName: SITE_NAME,
  //         title,
  //         description,
  //         url: `${config.FRONT_URL}/support/${doc.slug}`,
  //         images: genOgImages('/images/logo-only.png', title),
  //         section: doc.category,
  //         tags: doc.tags,
  //       },
  //       twitter: {
  //         card: 'summary',
  //         title,
  //         description,
  //       },
  //     };
  //   },
  // },
});

const metadata: LocalConfigType<MetadataConfigType> = {
  server: buildMetadata(process.env.NEXT_PUBLIC_NEXT_ENV === EnvironmentEnum.production),
  local: buildMetadata(false),
  production: buildMetadata(true),
};

const getMetadata = () => {
  const NEXT_PUBLIC_NEXT_ENV = process.env.NEXT_PUBLIC_NEXT_ENV;
  if (NEXT_PUBLIC_NEXT_ENV === EnvironmentEnum.production) {
    return metadata.production;
  }

  return metadata.local;
};

const nextMetadata: MetadataConfigType = getMetadata();

export { config, nextMetadata };
