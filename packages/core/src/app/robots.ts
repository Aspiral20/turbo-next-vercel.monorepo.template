import type { MetadataRoute } from 'next'
import { siteName } from "./sitemap";

/** SEO: Tell search engine crawlers which URLs they can access or not for website **/
/** See all user-agents: https://deviceandbrowserinfo.com/data/user_agents **/
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${siteName}/sitemap.xml`,
  }
}