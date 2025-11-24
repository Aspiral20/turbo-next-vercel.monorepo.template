# How to add Next-Auth to Next.js ? (steps)

## 1. Install next-auth

```bash
yarn add next-auth
```

## 2. Configure next-auth

Create an api route `src/app/api/auth/[...nextauth]/route.ts` with the following content:

```ts
import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
```

## 3. Create a new file in `src/lib/auth.ts`.

A simple example of auth config file with static authentication (no db data): (remove unnecessary code)

```ts
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { config } from '@/config';
import { AUTH_EXPIRE_TIME } from '@/utils/constants/auth';
import GithubProvider from "next-auth/providers/github";
import { users } from "@/_data/users";

/**
 * 
 * 
 * Credentials Roadmap: (request + credentials) => (authorize) => (jwt) => (session) => (frontend)
 *
 * Called at every front-change: (session) => (frontend) => (session) => (frontend) => ... => (logout)
 *
 * session - reupdated at every request, but jwt only at login.
 **/
export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    /** Duration of tokens **/
    // updateAge: AUTH_EXPIRE_TIME.access.format.jwt.number,
    // maxAge: AUTH_EXPIRE_TIME.refresh.format.jwt.number,
  },
  providers: [
    GithubProvider({
      clientId: config.GITHUB_ID ?? "GITHUB_ID",
      clientSecret: config.GITHUB_SECRET ?? "GITHUB_SECRET",
    }),
    CredentialsProvider({
      type: 'credentials',
      /** Requested Data from frontend **/
      credentials: {
        email: { type: 'text' },
        password: { type: 'text' },
      },
      /** Step 1 (after signIn() function on front) **/
      async authorize(credentials) {
        if (!credentials || !credentials.password || !credentials.email) {
          return null;
        }

        const foundUser = users.find((user) => user.email === credentials.email && user.password === credentials.password)

        if (!foundUser) {
          return null;
        }

        return {
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
          role: foundUser.role,
        };
      },
    }),
  ],
  callbacks: {
    /**
     * Step 2 (jwt function is called ONCE after authorize() function)
     * data which will be stored in TOKEN after return.
     * token(jwt) returns: iat, exp, sub, jti
     **/
    async jwt({ token, user, trigger, session }) {
      if (user) {
        return {
          ...token,
          id: user.id,
          role: user.role,
        };
      }

      return token;
    },
    /**
     * Step 3 (you get from token the data for the session every time is called session method)
     * the session used on frontend.
     **/
    async session({ session, token }) {
      if (!session.user?.email) {
        return {
          ...session,
          authenticated: false,
          user: {},
        };
      }
      return {
        ...session,
        authenticated: !!session.user,
        user: {
          ...session.user,
          id: token?.id,
          role: token?.role,
        },
      };
    },
  },
  secret: config.NEXT_AUTH_SECRET,
  pages: {
    signIn: '<route to sign in>',
  },
};
```


# 4. Add SessionProvider to app.

```tsx
import { authOptions } from "@/lib/auth";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en">
    <body>
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
    </body>
    </html>
  );
}
```

# 5. Rewrite types for Session, JWT, User, AdapterUser. (TypeScript)

`src/_types/modules/next.auth.d.ts`
```ts
import { SessionType, JWTType, AdapterUserType, SessionUserType } from '@/_types/auth.types';

declare module 'next-auth' {
  /** Session - used by next-auth for Session type. **/
  interface Session extends SessionType {
  }

  /**
   * The shape of the returned object in the OAuth providers' profile callback, available in the jwt and session callbacks, or the second parameter of the session callback, when using a database.
   * User - used by next-auth for "User" type.
   **/
  interface User extends SessionUserType {
  }
}

declare module 'next-auth/jwt' {
  /** JWT - used by next-auth for JWT type. DefaultJWT - by next-auth default **/
  interface JWT extends JWTType {
  }
}

declare module 'next-auth/adapters' {
  /** AdapterUser - used by next-auth for AdapterUser type. **/
  interface AdapterUser extends AdapterUserType {
  }
}
```