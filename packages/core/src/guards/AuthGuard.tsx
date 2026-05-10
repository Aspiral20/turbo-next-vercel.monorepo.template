'use client'
import React, { FC } from 'react';
import { useSession } from "next-auth/react";
import { redirect, usePathname } from "@/i18n/navigation";
import { useIsInRoute } from "shared/src/hooks";
import { InRouteType } from "shared/src/_types/hooks/is_in_route.types";
import { routes } from "@/routes";
import { useLocale } from 'next-intl';

// Routes where authenticated + verified users are redirected to the dashboard
const secureLogin: Array<InRouteType> = [
  { routeType: 'regexp', route: new RegExp(/\/login.*/) },
  { routeType: 'regexp', route: new RegExp(/\/forgot-password.*/) },
  { routeType: 'regexp', route: new RegExp(/\/sign-up.*/) },
]

// Routes accessible without authentication (no redirect to /login)
const openRoutes: Array<InRouteType> = [
  { routeType: 'regexp', route: new RegExp(/\/verify-email.*/) },
  { routeType: 'string', route: routes.i18n.self },
  { routeType: 'string', route: routes.i18n.termsAndConditions },
  { routeType: 'string', route: routes.i18n.privacyPolicy },
]

// Dashboard routes that require email verification
const dashboardRoutes: Array<InRouteType> = [
  { routeType: 'regexp', route: new RegExp(/\/dashboard.*/) },
]

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: FC<AuthGuardProps> = ({ children }) => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const isLogin = useIsInRoute(secureLogin, pathname);
  const isOpen = useIsInRoute(openRoutes, pathname);
  const isDashboard = useIsInRoute(dashboardRoutes, pathname);
  const locale = useLocale();

  // Unauthenticated on a protected route → sign in
  if (!session?.authenticated && !isLogin && !isOpen) {
    redirect({ href: routes.i18n.login, locale });
  }

  // Authenticated + verified on auth pages → dashboard
  if (session?.authenticated && session.user?.emailVerified && isLogin) {
    redirect({ href: routes.i18n.dashboard.self, locale });
  }

  // Authenticated + NOT verified on auth pages → check email
  if (session?.authenticated && !session.user?.emailVerified && isLogin) {
    redirect({ href: routes.i18n.verifyEmail.self, locale });
  }

  // Authenticated + NOT verified on dashboard → check email
  if (session?.authenticated && !session.user?.emailVerified && isDashboard) {
    redirect({ href: routes.i18n.verifyEmail.self, locale });
  }

  // Authenticated + verified on verify-email → dashboard
  if (session?.authenticated && session.user?.emailVerified && isOpen) {
    redirect({ href: routes.i18n.dashboard.self, locale });
  }

  return children;
};

export default AuthGuard;
