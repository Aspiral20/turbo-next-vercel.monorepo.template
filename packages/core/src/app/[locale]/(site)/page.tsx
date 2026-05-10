"use client";
import { useTranslations } from "use-intl";

export default function Home() {
  // const t = useTranslations('pages.home');
  return (
    <div
      className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <div className="text-center">
        Main Marketing page.
        {/* <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t("title")}</h1> */}
        {/* <p className="text-sm text-gray-600 dark:text-gray-400">{t("description")}</p> */}
      </div>
    </div>
  );
}
