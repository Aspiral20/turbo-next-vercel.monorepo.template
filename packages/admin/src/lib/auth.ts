import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { config } from '@/config';
import { AUTH_EXPIRE_TIME } from '@/utils/constants/auth';
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { users } from "@/_data/users";
import { routes } from "@/routes";

/**
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
    updateAge: AUTH_EXPIRE_TIME.access.format.jwt.number,
    maxAge: AUTH_EXPIRE_TIME.refresh.format.jwt.number,
  },
  providers: [
    GithubProvider({
      clientId: config.GITHUB_ID ?? "GITHUB_ID",
      clientSecret: config.GITHUB_SECRET ?? "GITHUB_SECRET",
    }),
    GoogleProvider({
      clientId: config.GOOGLE_CLIENT_ID ?? "GOOGLE_CLIENT_ID",
      clientSecret: config.GOOGLE_CLIENT_SECRET ?? "GOOGLE_CLIENT_SECRET",
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
    async jwt({ token, user, trigger, session, account }) {
      // console.log("server(jwt):", { token, user, account })
      // if (trigger === 'update') {
      //   return {
      //     ...token,
      //     id: user.id,
      //     role: user.role,
      //   };
      // }

      if (user && account) {
        return {
          ...token,
          id: user.id,
          role: user.role,
          provider: {
            type: account?.type,
            provider: account?.provider,
          }
        };
      }

      return token;
    },
    /**
     * Step 3 (you get from token the data for the session every time is called session method)
     * the session used on frontend.
     **/
    async session({ session, token }) {
      // console.log("server(session):", { session })
      if (!session.user?.email) {
        return {
          ...session,
          authenticated: false,
          provider: {},
          user: {},
        };
      }
      return {
        ...session,
        authenticated: !!session.user,
        provider: token.provider,
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
    signIn: routes.login,
  },
};
