"use client"

import { FC } from 'react';
import { useTranslations } from "use-intl";
import { routes } from "@/routes";
import { Link } from "@/i18n/navigation";
import Image from "next/image";

interface ErrorProps {
  code: number
  messageKey?: string
  descriptionKey?: string
  reset?: () => void
}

const ErrorPageLayout: FC<ErrorProps> = ({
  code = 404,
  messageKey = 'layout.error.message', //A error occurred.
  descriptionKey = 'layout.error.description', //A error occurred.
  reset,
}) => {
  const t = useTranslations();

  return (
    <div
      className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <div className="font-mono flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h3 className="text-[70px] font-bold m-auto leading-[.8]">{code}</h3>
        <div className=" list-inside list-decimal text-sm/6 text-center sm:text-left">
          <p className="mb-2 tracking-[-.01em] text-center">{t(messageKey)}</p>
          <p className="mb-2 tracking-[-.01em] text-center">{t(descriptionKey)}</p>
        </div>
        <div className="flex gap-4 items-center justify-center flex-col sm:flex-row w-full">
          {reset && (
            <button
              className="cursor-pointer rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
              rel="noopener noreferrer"
              onClick={() => reset()}
            >
              <Image
                className="dark:invert"
                src="/vercel.svg"
                alt="Vercel logomark"
                width={20}
                height={20}
              />
              {t('layout.error.tryAgain')}
            </button>
          )}
        </div>
      </div>
      <div className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <Link
          href={routes.i18n.self}
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          {t('pages.home')}
        </Link>
      </div>
    </div>
  );
};

export default ErrorPageLayout;