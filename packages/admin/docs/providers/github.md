# 📡 0. What GitHub Returns

GitHub returns:

```json
{
  "id": "12345",
  "name": "John Doe",
  "login": "johndoe",
  "email": "john@example.com",
  "avatar_url": "https://github.com/avatar.png"
}
```

NextAuth maps it to:

```ts
session.user = {
  name: string,
  email: string,
  image: string,
};
```
You can extend it using callbacks if needed.

# 🚀 1. Enable GitHub OAuth in GitHub Developer Settings

Go to:

```
https://github.com/settings/developers
```

### Create a New OAuth App:

- Homepage URL: http://localhost:3000
- Authorization callback URL:
  ```
  http://localhost:3000/api/auth/callback/github
  ```

### You will get:

- Client ID
- Client Secret

Put them into your `.env`:

```env
GITHUB_ID=yourclientid
GITHUB_SECRET=yourclientsecret
NEXTAUTH_SECRET=yourrandomsecret
NEXTAUTH_URL=http://localhost:3000
```

# 🚀 2. Server: NextAuth GitHub Provider

`/app/api/auth/[...nextauth]/route.ts` (Next.js App Router)

```ts
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

That’s all you need.
GitHub login is now working.

# 🚀 3. Client: Login & Logout Buttons

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
    <button onClick={() => signIn("github")}>
      Login with GitHub
    </button>
  );
}
```

Insert anywhere in your UI:

```tsx
<AuthButtons/>
```

# 🚀 4. How to Use Session in the Client

Wrap your app in the NextAuth provider:

`/app/layout.tsx`

```tsx
import { SessionProvider } from "next-auth/react";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
    <body>
    <SessionProvider>{children}</SessionProvider>
    </body>
    </html>
  );
}
```

Now useSession() works everywhere.

# 🚀 5. Protected Page Example

```tsx
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <p>You must be logged in.</p>;
  }

  return <pre>{JSON.stringify(session, null, 2)}</pre>;
}
```

This protects the page on the server.

# 🚀 6. Frontend Redirect-to-Login Example

```tsx
"use client";

import { useSession, signIn } from "next-auth/react";

export default function ProtectedPage() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading...</p>;
  if (!session) {
    return (
      <button onClick={() => signIn("github")}>
        Login to Access This Page
      </button>
    );
  }

  return <div>Welcome, {session.user?.name}</div>;
}
```