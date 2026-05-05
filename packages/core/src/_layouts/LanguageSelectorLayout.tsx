'use client'
import React, { FC } from 'react';
import { routing } from "@/i18n/routing";
import { useLocale } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { usePathname } from "@/i18n/navigation";
import { useIsInRoute } from "@/hooks";
import { InRouteType } from "@/_types/hooks/is_in_route.types";
import { routes } from "@/routes";

/**
 * Language selector will not be displayed on these routes:
 *
 * /second/...
 * /third
 *
 **/
const notDisplayed: Array<InRouteType> = [
  // Similar with: { routeType: 'regexp', route: new RegExp(/\/second\/.*/) } - without external variable.
  { routeType: 'regexp', route: new RegExp(`${routes.i18n.third.self}/.*`) },
  { routeType: 'string', route: routes.i18n.second },
]

interface LanguageSelectorLayoutProps {
}

const LanguageSelectorLayout: FC<LanguageSelectorLayoutProps> = ({}) => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const isNotDisplayed = useIsInRoute(notDisplayed);

  if (isNotDisplayed) {
    return null;
  }

  return (
    <div
      className="z-100 absolute top-8 right-4 flex items-center gap-2 bg-transparent backdrop-blur-md rounded-full px-2 py-2 border border-white/20">
      {(routing.locales).map((lang) => (
        <button
          key={lang}
          onClick={() => router.replace(pathname, { locale: lang })}
          className={`p-0 cursor-pointer rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground gap-2 font-medium text-sm sm:text-base h-8 sm:h-10 px-3 sm:px-4 sm:w-auto ${
            locale === lang
              ? 'hover:bg-[#383838] dark:hover:bg-[#ccc] text-background'
              : 'border-black/[.08] bg-transparent text-[#f2f2f2] dark:border-white/[.145] hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent'
          }`}
        >
          {lang.toUpperCase()}
        </button>
      ))}
    </div>
  );
};

export default LanguageSelectorLayout;