# SyncLead — Claude Instructions

## Routing rules (always follow these)

### 1. Register every new route in `routes.ts`
When adding a new page under `packages/core/src/app/[locale]/...`, you **must** also add the corresponding path to:

```
packages/core/src/routes.ts
```

Add it in **both** places inside that file:
- `routes.next['[locale]'](locale).dashboard.*` — the locale-prefixed version
- `routes.i18n.dashboard.*` — the bare i18n version

Example — adding a new "reports" page:
```ts
// routes.next
dashboard: {
  ...
  reports: `/${locale}/dashboard/reports`,
}

// routes.i18n
dashboard: {
  ...
  reports: '/dashboard/reports',
}
```

### 2. Always use `Link` from `@/i18n/navigation`
Never use Next.js's built-in `<Link>` from `next/link`. Import from the i18n wrapper:

```ts
import { Link } from '@/i18n/navigation';
```

### 3. Always source `href` from `routes`
Never hardcode path strings. Always pull the href from `routes.i18n.*`:

```ts
import { routes } from '@/routes';

<Link href={routes.i18n.dashboard.settings}>Settings</Link>
```

---

## Component reuse rule

If the same JSX/logic appears in 2 or more places in the codebase, extract it into a component in `_components/` and replace both usages with that component, passing the varying parts as props. Never duplicate markup — the second time you write the same structure is the moment to componentise it.

---

## Internal API call rules (always follow these)

### 1. Register every new internal endpoint in `lib/axios.ts`
All Next.js internal API route paths live in the `endpoints.intern.axiosNextInstance` object inside `src/lib/axios.ts`. Add new endpoints there grouped by domain:

```ts
// lib/axios.ts
const endpoints: EndpointsType = {
  intern: {
    axiosNextInstance: {
      auth: {
        forgotPassword: '/auth/forgot-password',
        // add new auth endpoints here
      },
      // add new domain groups here
    },
  },
};
```

### 2. Always call internal APIs via `apiInterceptor` + `endpoints`
Never use raw `fetch` or hardcoded URL strings for internal Next.js API routes. Always use:

```ts
import { apiInterceptor, endpoints } from '@/lib/axios';

const api = apiInterceptor();

// GET
const data = await api.getApiData(endpoints.intern.axiosNextInstance.auth.someEndpoint);

// POST
await api.postApiData(endpoints.intern.axiosNextInstance.auth.someEndpoint, { body });

// PUT
await api.putApiData(endpoints.intern.axiosNextInstance.auth.someEndpoint, { body });

// DELETE
await api.deleteApiData(endpoints.intern.axiosNextInstance.auth.someEndpoint);
```

---

## Email rules (always follow these)

### 1. Email UI → `_components/mails/`
Every email template lives here as a React component built with `@react-email/components`.
- Use inline styles via `MailStylesType<{...}>` — no Tailwind (email clients don't support it)
- Accept typed props for dynamic content
- Export from `_components/mails/index.ts`

```tsx
// _components/mails/my_email.tsx
import { Html, Section, Container, Text } from '@react-email/components';
import { MailStylesType } from '@/_types/mail.types';

type StylesType = MailStylesType<{ section: React.CSSProperties }>;
const styles: StylesType = { section: { backgroundColor: '#ffffff' } };

interface MyEmailProps { name: string }

const MyEmail: FC<MyEmailProps> = ({ name }) => (
  <Html>
    <Section style={styles.section}>
      <Container><Text>Hello {name}</Text></Container>
    </Section>
  </Html>
);
export default MyEmail;
```

### 2. Email sending logic → `http/services/mail.ts`
All `sendMail` calls live in this single service file.
- Use `render()` from `@react-email/render` to convert the component to HTML
- Use `mailTransporter.noreply.sendMail()` from `@/lib/mail`
- Use `config.SMTP_NOREPLY_FROM` for the `from` field
- Type options as `Mail.Options & Partial<SMTPTransport.Options>`

```ts
// http/services/mail.ts
import { render } from '@react-email/render';
import { MyEmail } from '@/_components/mails';
import { mailTransporter } from '@/lib/mail';
import { config } from '@/config';

export async function sendMyEmail(name: string, to: string) {
  return mailTransporter.noreply.sendMail({
    from: config.SMTP_NOREPLY_FROM,
    to,
    subject: 'Hello',
    html: await render(MyEmail({ name }) as any),
  });
}
```

---

## Project structure (core package)

```
packages/core/src/
  app/[locale]/
    (site)/dashboard/   ← dashboard pages (one folder per route)
  _components/          ← shared components
    auth/               ← auth layout components (e.g. AuthCard)
    mails/              ← email templates (react-email, inline styles only)
      index.ts          ← re-exports all mail components
    settings/           ← settings section components
    modals/
    ui/
  http/
    services/
      mail.ts           ← all sendMail functions (nodemailer + react-email render)
  i18n/
    navigation.ts       ← exports Link, redirect, usePathname, useRouter
    routing.ts          ← locale config
  routes.ts             ← single source of truth for all route strings
```

## DB write + UI sync rules (always follow these)

### 1. Always reset form inputs from the DB response after submit
This is the general rule for every form that uses `isDirty`:

- The API route **must return the saved row** (not just `{ success: true }`)
- `onSubmit` **must call `reset()` with the response data**, not with what was submitted
- This makes `isDirty` go back to `false` instantly — so the save button disables again and the inputs show the exact DB state, with no page refresh needed

```ts
// 1. API route — always return the saved record
return NextResponse.json({ success: true, data: savedRecord });

// 2. onSubmit — reset from response, not from submitted values
const response = await api.putApiData(endpoint, payload);
reset(response.data); // ← DB truth goes straight into inputs; isDirty → false
```

Never do `reset(submittedValues)` — always `reset(response.data)`. The two may differ if the DB applied transforms (trimming, normalization, defaults, triggers, etc.).

**General rule — always guard `useEffect` + `reset()` with an `initialized` state:**
Any time a `useEffect` calls `reset()` to initialize a form from external data (session, API fetch, etc.), subsequent changes to that data (e.g. from `update()`, re-fetches, subscriptions) will re-trigger the effect and overwrite the user's in-progress or just-submitted values. Always add an `initialized` state to make `reset()` run only once on mount:

```ts
const [initialized, setInitialized] = useState(false);

useEffect(() => {
  if (externalData && !initialized) {
    reset(externalData);
    setInitialized(true); // blocks all future re-runs of this effect
  }
}, [externalData, reset]);
```

- After `setInitialized(true)`, any future changes to `externalData` won't overwrite the form
- `onSubmit` owns all resets after the initial load: `reset(response.data)`
- When the component unmounts (navigate away + back), `initialized` resets to `false` automatically, so the form re-initializes correctly on next mount

**When the saved data also lives in the session (NextAuth), sync that too:**
```ts
const response = await api.putApiData(endpoint, payload);
await update({ name: response.data.name }); // sync JWT
reset(response.data);                        // sync inputs
```

### 2. Never use `alert()` — always use `toast`
Never call `alert()`, `confirm()`, or `prompt()` anywhere in the UI. Always use `toast` from `sonner` for user feedback:

```ts
import { toast } from 'sonner';

toast.success('Saved.');           // DB write succeeded
toast.error('Something went wrong.'); // DB write failed / validation error
toast.info('Check your email.');   // neutral info
toast.warning('Cannot be undone.'); // destructive action warning
```

This applies everywhere — form submissions, DB interactions, auth flows, any user-triggered action.

### 3. Use `ButtonSync` for all save buttons that write to the DB
Never write a plain `<button>Save</button>` for a DB-write action. Always use `ButtonSync` from `@/_components/ButtonSync`:

```tsx
import { useState } from 'react';
import ButtonSync from '@/_components/ButtonSync';

// Always use a separate useState for loading — NOT isSubmitting from useForm.
// isSubmitting does not reliably cover the full async duration of onSubmit
// (API call + reset + session update), so it can drop early and leave the
// button in a wrong state mid-flight.
const [isLoading, setIsLoading] = useState(false);
const { register, handleSubmit, reset, formState: { isDirty } } = useForm<FormValues>({...});

async function onSubmit(values: FormValues) {
  setIsLoading(true);
  try {
    const response = await api.putApiData(endpoint, payload);
    reset(response.data); // isDirty → false
    toast.success('Saved.');
  } catch (err: any) {
    toast.error(err?.error ?? 'Something went wrong.');
  } finally {
    setIsLoading(false); // always release, even on error
  }
}

<ButtonSync
  type="submit"
  isLoading={isLoading}
  disabled={isLoading || !isDirty}
  displayedIcon={<Save className="h-4 w-4" />}
/>
```

**`isDirty` rule:** always pass `disabled={isLoading || !isDirty}` on forms backed by DB data. This prevents sending a request when the user hasn't changed anything. After a successful save + `reset(response.data)`, `isDirty` resets to `false` automatically, disabling the button again.

All props (all optional except `isLoading`):
- `isLoading` *(required)* — shows spinner + `loadingText` while the request is in-flight
- `disabled` — prevents double-submits; defaults to `isLoading` if not provided
- `displayedIcon` — icon in the idle state (defaults to `<Save />`)
- `loadingIcon` — icon in the loading state (defaults to `<Loader2 animate-spin />`)
- `text` — label in the idle state (defaults to `"Save Changes"`)
- `loadingText` — label in the loading state (defaults to `"Saving…"`)
- `className` — merged via `cn()` on top of the base blue button styles, so Tailwind classes override correctly

---

## Modal / popup rules (always follow these)

### 1. Always use `ModalShell` for the outer chrome
Every popup/modal must use `ModalShell` from `@/_components/ui/ModalShell` for the overlay + panel container. It handles theming (light/dark bg, border, shadow, backdrop) consistently across the app.

```tsx
import { ModalShell, modalCls } from '@/_components/ui/ModalShell';

<ModalShell isOpen={isOpen} onClose={onClose} className="max-w-lg">
  <div className={modalCls.header}>...</div>
  <div className={modalCls.body}>...</div>
  <div className={`${modalCls.footer} flex justify-end`}>...</div>
</ModalShell>
```

### 2. Always use `modalCls` tokens for inner elements
Never hardcode light-only colors inside a modal. Use the exported `modalCls` tokens:

| Token | Use for |
|-------|---------|
| `modalCls.header` | Header div (includes border-b + padding) |
| `modalCls.footer` | Footer div (includes border-t + padding) |
| `modalCls.body` | Scrollable body div |
| `modalCls.title` | Headings and primary text |
| `modalCls.label` | Form labels |
| `modalCls.subtext` | Secondary / hint text |
| `modalCls.input` | Text/number inputs |
| `modalCls.select` | Select dropdowns |
| `modalCls.card` | Inner content cards |
| `modalCls.secondary` | Muted bg sections (filter rows, review cards) |
| `modalCls.infoBox` | Blue info/hint boxes |
| `modalCls.closeBtn` | Close (X) button |
| `modalCls.backBtn` | Cancel / Back button |
| `modalCls.addBtn` | Dashed add-item buttons |
| `modalCls.templateBtn` | Small inline action buttons |
| `modalCls.timelineLine` | Vertical connector lines |
| `modalCls.stepInactive` | Stepper circle — inactive state |
| `modalCls.stepConnector` | Stepper horizontal line — inactive state |

---

## Input validation rules (always follow these)

### 1. Always validate inputs — and report the field list when done
Every form field must be explicitly marked as required or optional, with appropriate validation rules. After implementing any form, output a summary table of all inputs.

**Required fields** — use `required` with a message, not just `true`:
```ts
register('email', { required: 'Email is required.' })
register('password', {
  required: 'Password is required.',
  minLength: { value: 8, message: 'Password must be at least 8 characters.' },
})
register('confirmPassword', {
  required: 'Please confirm your password.',
  validate: (v) => v === getValues('password') || 'Passwords do not match.',
})
```

**Always show inline error messages** below each field:
```tsx
{errors.fieldName && (
  <p className="mt-1 text-xs text-red-500">{errors.fieldName.message}</p>
)}
```

**Always use `PasswordInput` for password fields** — never a plain `<input type="password">`. It includes a show/hide toggle and is already styled consistently:
```tsx
import { PasswordInput } from '@/_components/ui/PasswordInput';

<PasswordInput
  {...register('password', { required: 'Password is required.', minLength: { value: 8, message: 'Min 8 characters.' } })}
  placeholder="Enter password"
/>
```

**Mark required fields visually** with a red asterisk in the label:
```tsx
<label>Email <span className="text-red-500">*</span></label>
```

### 2. Field summary — always output this after implementing a form
After finishing any form, list every input with its validation rules:

| Field | Required | Rules |
|-------|----------|-------|
| email | ✅ | valid email format |
| password | ✅ | min 8 characters |
| confirmPassword | ✅ | must match password |
| company | ❌ | — |

---

## Token / one-time link rules (always follow these)

Whenever a user can request a new token or link (email verification, password reset, magic link, invite, etc.), issuing a new one **must invalidate all previous ones** for the same identity (email, user ID, etc.).

### Implementation pattern

Before inserting a new token, delete all existing tokens for that identity in the same table:

```ts
// lib/somethingTokens.ts
export async function storeSomethingToken(token: string, email: string): Promise<void> {
  const normalizedEmail = email.toLowerCase();

  // Invalidate all previous tokens for this email
  await supabase.from('something_tokens').delete().eq('email', normalizedEmail);

  const { error } = await supabase.from('something_tokens').insert({
    token,
    email: normalizedEmail,
    expires_at: new Date(Date.now() + TTL_MS).toISOString(),
  });
  if (error) throw new Error(error.message);
}
```

This applies to:
- Email verification tokens (`email_verification_tokens`)
- Password reset tokens (`reset_tokens`)
- Any future invite, magic-link, or one-time-use token table

### UI cooldown (resend buttons)

Whenever there is a UI button that lets the user request a new token (resend, send again, etc.), always enforce a **60-second client-side cooldown** after each send. Use a countdown `useState` + `setInterval` so the user sees exactly how long they must wait:

```tsx
const COOLDOWN_SECONDS = 60;
const [cooldown, setCooldown] = useState(0);
const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

const startCooldown = () => {
  setCooldown(COOLDOWN_SECONDS);
  timerRef.current = setInterval(() => {
    setCooldown((prev) => {
      if (prev <= 1) { clearInterval(timerRef.current!); return 0; }
      return prev - 1;
    });
  }, 1000);
};

// In the click handler, call startCooldown() on success.
// Pass to the button:
disabled={isLoading || cooldown > 0}
text={cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend'}
```

Always clean up the interval on unmount: `useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, [])`.

---

## Stack
- Next.js (App Router) + Turbopack
- TypeScript
- Tailwind CSS
- next-intl for i18n
- lucide-react for icons
- shadcn/ui components under `_components/ui/`
