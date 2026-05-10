'use client'
import React, { FC, memo } from 'react';
import { twMerge } from "tailwind-merge";

export enum LoaderEnum {
  insteadOfText = 'insteadOfText',
  button = 'button'
}

interface LoadingLayoutWrapperProps {
  children: React.ReactNode
}

/** Use: LoadingLayoutWrapper -> parent of LoadingLayout's children -> <LoadingLayout hasLayoutWrapper={true} /> **/
export const LoadingLayoutWrapper: FC<LoadingLayoutWrapperProps> = memo(({ children }) => {
  return (
    <div className={`relative`}>
      {children}
    </div>
  )
})


const ThreeDotsAnimation = memo(({ isDark, className }: {
  isDark: LoadingLayoutProps['isDark'],
  className?: string
}) => {
  return (
    <p className={twMerge(`${isDark ? 'dark ' : ''}text-loader text-center w-[30px]`, className)}/>
  )
})

interface LoadingLayoutProps {
  children?: React.ReactNode
  theme?: any
  loader?: LoaderEnum
  isDark?: boolean
  isLoading?: boolean
  hasLayoutWrapper?: boolean
}

const LoadingLayout: FC<LoadingLayoutProps> = ({
  children,
  isLoading,
  loader = LoaderEnum.button,
  isDark = false,
  hasLayoutWrapper = false,
  theme,
}) => {

  const overlay = isLoading ? (
    <div className="absolute left-0 top-0 w-full h-full inset-0 z-10 flex items-center justify-center bg-white/30 backdrop-blur-sm">
      {loader === LoaderEnum.insteadOfText ? (
        <ThreeDotsAnimation isDark={isDark}/>
      ) : (
        <div className={`${isDark ? 'dark ' : ''}${theme?.input?.label} min-h-[156px] flex items-center justify-center`}>
          <div className="flex items-end text-[16px]">
            Loading
            <ThreeDotsAnimation isDark={isDark} className="w-[20px] mb-[3px]"/>
          </div>
        </div>
      )}
    </div>
  ) : null;

  return (
    <>
      {hasLayoutWrapper ? (
        <>
          {children}
          {overlay}
        </>
      ) : (
        <div className="relative">
          {children}
          {overlay}
        </div>
      )}
    </>
  );
};


export default LoadingLayout;