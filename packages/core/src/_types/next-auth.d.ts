import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    authenticated: boolean;
    provider: {
      type: string;
      provider: string;
    };
    user: {
      id: string;
      role: string;
      emailVerified: boolean;
      onboardingCompleted: boolean;
      country?: string;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
    emailVerified: boolean;
    onboardingCompleted: boolean;
    country?: string;
    provider: {
      type: string;
      provider: string;
    };
  }
}
