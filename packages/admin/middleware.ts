import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { routes } from "@/routes";

const DEFAULT_UNAUTHORIZED_REDIRECT = routes.login; // redirect unauthorized users
const DEFAULT_AUTH_REDIRECT = routes.self; // redirect logged-in users
const PUBLIC_PATHS = [DEFAULT_UNAUTHORIZED_REDIRECT]; // pages allowed without auth

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = await getToken({ req: request });

  const isPublic = PUBLIC_PATHS.includes(pathname);
  const isLoggedIn = Boolean(token);

  // 1. If user is NOT logged in & trying to access a protected page → go to /login
  if (!isLoggedIn && !isPublic) {
    return NextResponse.redirect(new URL(DEFAULT_UNAUTHORIZED_REDIRECT, request.url));
  }

  // 2. If user IS logged in & is trying to access /login → redirect to dashboard
  if (isLoggedIn && pathname === DEFAULT_UNAUTHORIZED_REDIRECT) {
    return NextResponse.redirect(new URL(DEFAULT_AUTH_REDIRECT, request.url));
  }

  // Continue normally
  return NextResponse.next();
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: [
    '/((?!api|trpc|_next|_vercel|.*\\..*).*)',

    // Match all pathnames within `{/:locale}/users` - https://next-intl.dev/docs/routing/setup
    // '/([\\w-]+)?/users/(.+)',
  ]
}