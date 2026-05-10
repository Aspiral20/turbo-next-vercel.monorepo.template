import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { config } from '@/config';
import { AUTH_EXPIRE_TIME } from '@/utils/constants/auth';
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { getUserByEmail, verifyPassword } from '@/http/services/users';

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

        const foundUser = await getUserByEmail(credentials.email);
        if (!foundUser || !foundUser.password) return null;

        const valid = await verifyPassword(credentials.password, foundUser.password);
        if (!valid) return null;

        return {
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
          role: foundUser.role,
          emailVerified: foundUser.emailVerified ?? false,
          onboardingCompleted: foundUser.onboardingCompleted ?? false,
          usertype: foundUser.userType,
          country: foundUser.country,
        } as any;
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
      if (trigger === 'update') {
        const updated = { ...token };
        if (session?.name !== undefined) updated.name = session.name;
        if (session?.emailVerified !== undefined) updated.emailVerified = session.emailVerified;
        if (session?.onboardingCompleted !== undefined) updated.onboardingCompleted = session.onboardingCompleted;
        if (session?.country !== undefined) updated.country = session.country;
        if (session?.usertype !== undefined) updated.usertype = session.usertype;
        return updated;
      }

      if (user && account) {
        const u = user as any;
        return {
          ...token,
          id: u.id,
          role: u.role,
          emailVerified: u.emailVerified ?? true, // OAuth users are implicitly verified
          onboardingCompleted: u.onboardingCompleted ?? false,
          country: u.country,
          usertype: u.usertype,
          provider: {
            type: account?.type,
            provider: account?.provider,
          },
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
          emailVerified: token?.emailVerified ?? false,
          onboardingCompleted: token?.onboardingCompleted ?? false,
          country: token?.country,
          usertype: token?.usertype,
        },
      };
    },
  },
  secret: config.NEXT_AUTH_SECRET,
  pages: {
    signIn: '/login',
  },
};
