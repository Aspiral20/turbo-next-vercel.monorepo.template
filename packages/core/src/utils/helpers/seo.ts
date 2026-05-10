/** Resolved lazily at call time to avoid circular imports with config.ts. */
const getFrontUrl = (): string =>
  process.env.NEXT_PUBLIC_FRONT_URL ?? '';

/** Generate hreflang alternate language URLs for a given page path. */
export const genAlternatesLanguages = (page: string = ''): Record<string, string> => {
  const base = getFrontUrl();
  return {
    en: `${base}/en${page}`,
    ro: `${base}/ro${page}`,
    ru: `${base}/ru${page}`,
  };
};

type OgImage = { url: string; width: number; height: number; alt: string };

/** Generate Open Graph image array for metadata. */
export const genOgImages = (
  path: string,
  alt: string,
  width = 1200,
  height = 630
): OgImage[] => {
  const base = getFrontUrl();
  const url = path.startsWith('http') ? path : `${base}${path}`;
  return [{ url, width, height, alt }];
};