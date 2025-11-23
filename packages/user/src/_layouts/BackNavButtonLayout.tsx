'use client'
import React, { FC } from 'react';
import { Link } from "@/i18n/navigation";
import { useParentPath } from "@/hooks";

interface BackNavButtonLayoutProps {
}

const BackNavButtonLayout: FC<BackNavButtonLayoutProps> = ({}) => {
  const { parentPath, pathname } = useParentPath();
  return pathname !== '/' ? (
    <div
      className="z-100 absolute top-8 left-8 flex items-center gap-2 bg-transparent backdrop-blur-md rounded-full px-2 py-2 border border-white/20"
    >
      <Link
        href={parentPath}
        className={`p-0 cursor-pointer rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground gap-2 font-medium text-sm sm:text-base h-8 sm:h-10 px-3 sm:px-4 sm:w-auto ${
          'border-black/[.08] bg-transparent text-[#f2f2f2] dark:border-white/[.145] hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent'
        }`}
      >
        Back
      </Link>
    </div>
  ) : null;
};

export default BackNavButtonLayout;