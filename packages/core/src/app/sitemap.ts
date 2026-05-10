import type { MetadataRoute } from 'next'
import { config } from "@/config";
// import { genAlternatesLanguages } from "@/utils/helpers/seo";

export const siteName = config.FRONT_URL;

/** SEO: Inform search engines of all crawlable URLs and their priority. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    /// Seo example
    // {
    //   url: siteName,
    //   lastModified: new Date(),
    //   changeFrequency: 'monthly',
    //   alternates: { languages: genAlternatesLanguages() },
    //   priority: 1,
    // },
    // {
    //   url: `${siteName}/blog`,
    //   lastModified: new Date(),
    //   changeFrequency: 'weekly',
    //   alternates: { languages: genAlternatesLanguages('/blog') },
    //   priority: 0.9,
    // },
    // {
    //   url: `${siteName}/download`,
    //   lastModified: new Date(),
    //   changeFrequency: 'monthly',
    //   alternates: { languages: genAlternatesLanguages('/download') },
    //   priority: 0.9,
    // },
    // {
    //   url: `${siteName}/faq`,
    //   lastModified: new Date(),
    //   changeFrequency: 'monthly',
    //   alternates: { languages: genAlternatesLanguages('/faq') },
    //   priority: 0.7,
    // },
    // {
    //   url: `${siteName}/contact`,
    //   lastModified: new Date(),
    //   changeFrequency: 'yearly',
    //   alternates: { languages: genAlternatesLanguages('/contact') },
    //   priority: 0.6,
    // },
    // {
    //   url: `${siteName}/support`,
    //   lastModified: new Date(),
    //   changeFrequency: 'weekly',
    //   alternates: { languages: genAlternatesLanguages('/support') },
    //   priority: 0.7,
    // },
    // {
    //   url: `${siteName}/privacy`,
    //   lastModified: new Date(),
    //   changeFrequency: 'yearly',
    //   alternates: { languages: genAlternatesLanguages('/privacy') },
    //   priority: 0.3,
    // },
    // {
    //   url: `${siteName}/term`,
    //   lastModified: new Date(),
    //   changeFrequency: 'yearly',
    //   alternates: { languages: genAlternatesLanguages('/term') },
    //   priority: 0.3,
    // },
  ]
}
