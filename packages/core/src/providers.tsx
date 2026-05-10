'use client';

import React, { FC } from 'react';
import { AuthGuard, LangValidationGuard } from "@/guards";
import { LanguagesEnum } from "@/_types/i18n.types";
import { AbstractIntlMessages, NextIntlClientProvider } from "next-intl";
import { Analytics } from "@vercel/analytics/next";
import { SessionProvider } from 'next-auth/react';
import { Session } from "next-auth";
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/_components/ui/sonner';
import { StoreProvider } from '@/store/StoreProvider';

interface ProvidersProps {
  locale: string | LanguagesEnum;
  messages: AbstractIntlMessages;
  children: React.ReactNode;
  session: Session | null;
}

const Providers: FC<ProvidersProps> = ({
  messages,
  locale,
  children,
  session
}) => {
  return (
    <>
      <StoreProvider>
        <NextIntlClientProvider locale={locale} timeZone={"UTC"} messages={messages}>
          <LangValidationGuard locale={locale}>
            <SessionProvider session={session}>
              <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                <AuthGuard>
                  {children}
                </AuthGuard>
                <Toaster position="bottom-right" />
              </ThemeProvider>
            </SessionProvider>
          </LangValidationGuard>
        </NextIntlClientProvider>
      </StoreProvider>
      <Analytics />
    </>
  );
};

export default Providers;
