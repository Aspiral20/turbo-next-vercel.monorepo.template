# 📡 0. What Google returns

Google profile → NextAuth user contains:

```ts
{
  name: string;
  email: string;
  image: string;
}
```

You can customize this using callbacks.jwt and callbacks.session.

# ✅ 1. Create Google OAuth Credentials

Go to:

**Google Cloud Console → APIs & Services → Credentials**  
https://console.cloud.google.com/apis/credentials

Create:

### OAuth 2.0 Client ID

Use:

- Application type → Web application
- Authorized JavaScript origins:
  `http://localhost:3000`

- Authorized redirect URI:
  `http://localhost:3000/api/auth/callback/google`

You will get:

- Client ID
- Client Secret

# 🔐 2. Add ENV variables

`.env`

```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-long-random-secret
```

# ⚙️ 3. Backend — Add Google Provider to NextAuth

`/app/api/auth/[...nextauth]/route.ts`

```ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

This is all you need — Google OAuth is now active.

# 🖥 4. Frontend — Login & Logout Buttons

`/components/AuthButtons.tsx`

```tsx
"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthButtons() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div>
        <p>Signed in as {session.user?.email}</p>
        <button onClick={() => signOut()}>Logout</button>
      </div>
    );
  }

  return (
    <button onClick={() => signIn("google")}>
      Login with Google
    </button>
  );
}
```

Use it anywhere:

```tsx
<AuthButtons/>
```

# 🧩 5. Add <SessionProvider> in layout

`/app/layout.tsx`

```tsx
import { SessionProvider } from "next-auth/react";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
    <body>
    <SessionProvider>
      {children}
    </SessionProvider>
    </body>
    </html>
  );
}
```

# 🔎 6. Client-Side Auth State Example

```tsx
"use client";

import { useSession } from "next-auth/react";

export default function Page() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading...</p>;
  if (!session) return <p>You are not logged in.</p>;

  return (
    <div>
      <h1>Welcome {session.user?.name}</h1>
      <img src={session.user?.image ?? ""} width={50}/>
    </div>
  );
}
```

# 🛡 7. Server Protected Route (App Router)

```tsx
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) return <p>Not authorized</p>;

  return <pre>{JSON.stringify(session, null, 2)}</pre>;
}
```
