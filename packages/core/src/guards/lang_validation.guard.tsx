import React, { FC } from 'react';
import { routing } from "@/i18n/routing";
import { redirect, usePathname } from '@/i18n/navigation';
import { LanguagesEnum } from "@/_types/i18n.types";
import { hasLocale } from "next-intl";

interface LangValidationGuardProps {
  locale: string | LanguagesEnum
  children: React.ReactNode
}

const LangValidationGuard: FC<LangValidationGuardProps> = ({
  locale,
  children,
}) => {
  const pathname = usePathname();

  if (!hasLocale(routing.locales, locale)) {
    return redirect({ href: pathname, locale: routing.defaultLocale });
  }

  return children;
};

export default LangValidationGuard;