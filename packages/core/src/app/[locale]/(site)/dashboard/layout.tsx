import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import PageError from './error';
import React from "react";
import { AppLayout } from "@/_layouts";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ErrorBoundary errorComponent={PageError}>
      <AppLayout>
        {children}
      </AppLayout>
    </ErrorBoundary>
  );
}
