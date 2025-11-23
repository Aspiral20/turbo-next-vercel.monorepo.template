'use client';

import React, { FC } from 'react';
import { Analytics } from "@vercel/analytics/next";
import { SessionProvider } from 'next-auth/react';
import { Session } from "next-auth";

interface ProvidersProps {
  children: React.ReactNode;
  session: Session | null;
}

const Providers: FC<ProvidersProps> = ({
  children,
  session,
}) => {
  return (
    <>
      <SessionProvider session={session}>
        {children}
      </SessionProvider>
      <Analytics/>
    </>
  );
};

export default Providers;
