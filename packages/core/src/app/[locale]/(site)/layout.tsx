import React from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import NextTopLoader from "nextjs-toploader";
import type { Metadata } from "next";
import PageError from "./error";
import { NavBarLayout, LanguageSelectorLayout, BackNavButtonLayout } from "@/_layouts";

export const metadata: Metadata = {
  title: "App metadata",
  description: "App description",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ErrorBoundary errorComponent={PageError}>
      <LanguageSelectorLayout/>
      <NavBarLayout/>
      <BackNavButtonLayout/>
      <NextTopLoader
        color="#ccc"
        showSpinner={false}
        speed={500}
      />
      {children}
    </ErrorBoundary>
  );
}
