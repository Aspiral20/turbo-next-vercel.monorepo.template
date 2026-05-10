import type { MetadataRoute } from 'next'
import { PROJECT_NAME } from "@/config";

const MICRO_FRONTEND_NAME = `${PROJECT_NAME.platform} ${PROJECT_NAME.microFrontend}`;

/** SEO: Provide information about website for the browser. **/
export default function manifest(): MetadataRoute.Manifest {
  return {
    /// Example SEO - manifest.
    name: MICRO_FRONTEND_NAME,
    short_name: MICRO_FRONTEND_NAME,
    description: `${MICRO_FRONTEND_NAME} is a smart, multi-language onboarding flow that captures full data through a guided questionnaire, fully integrated with the ${PROJECT_NAME.platform} platform.`,
    start_url: '/',
    display: 'standalone',
    icons: [
      {
        src: '/icon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/apple-icon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}