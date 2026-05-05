'use client';

import React, { FC } from 'react';
import { LangValidationGuard } from "@/guards";
import { LanguagesEnum } from "@/_types/i18n.types";
import { AbstractIntlMessages, NextIntlClientProvider } from "next-intl";
import { Analytics } from "@vercel/analytics/next";

interface ProvidersProps {
  locale: string | LanguagesEnum;
  messages: AbstractIntlMessages;
  children: React.ReactNode;
}

const Providers: FC<ProvidersProps> = ({
  messages,
  locale,
  children
}) => {
  return (
    <>
      <NextIntlClientProvider locale={locale} timeZone={"UTC"} messages={messages}>
        <LangValidationGuard locale={locale}>
          {children}
        </LangValidationGuard>
      </NextIntlClientProvider>
      <Analytics/>
    </>
  );
};

export default Providers;
