# SyncLead — User Onboarding Flow

## Overview

New users go through a 4-stage funnel before reaching the live dashboard:

```
Sign Up (4 fields)
    ↓
Email Verification (link in inbox)
    ↓
Onboarding Modal — Step 1: Role (5 seconds)
    ↓
Onboarding Modal — Step 2: Workspace setup (30 seconds)
    ↓
Dashboard — "Connect your first source" CTA
```

The goal is to collect **minimum viable information at sign-up**, then gather
context and workspace details immediately after — before the user touches any
real feature.

---

## Stage 1: Sign Up

**Route:** `/sign-up`  
**File:** `src/app/[locale]/(site)/(auth)/sign-up/page.tsx`  
**API:** `POST /api/auth/sign-up`

### Fields

| Field            | Required | Validation                     |
|------------------|----------|--------------------------------|
| Full Name        | ✅       | min 2 characters               |
| Email            | ✅       | valid email format             |
| Password         | ✅       | min 8 characters               |
| Confirm Password | ✅       | must match Password            |

### What happens

1. `POST /api/auth/sign-up` creates the user in PostgreSQL:
   - Password hashed with **bcrypt (cost 10)**
   - `email_verified = false`, `onboarding_completed = false`
2. A 32-byte hex verification token is generated and stored in `email_verification_tokens` (expires in **24 hours**)
3. Verification email is sent (non-blocking — sign-up still succeeds if mail fails)
4. User is auto-signed in via `signIn('credentials', ...)`
5. Redirect → `/verify-email` (check inbox page)

### Data stored

```sql
-- users table
name, email, password (hashed), role = 'user',
email_verified = false, onboarding_completed = false,
created_at, updated_at
```

---

## Stage 2: Email Verification

**Route:** `/verify-email` — check inbox page  
**Route:** `/verify-email/[token]` — auto-processes the link  
**Files:**
- `src/app/[locale]/(site)/(auth)/verify-email/page.tsx`
- `src/app/[locale]/(site)/(auth)/verify-email/[token]/page.tsx`
- `src/app/api/auth/verify-email/route.ts` — `POST`: consumes token, marks `email_verified = true`
- `src/app/api/auth/resend-verification/route.ts` — `POST`: resends email

### What happens

1. User opens their email and clicks "Verify Email Address"
2. `/verify-email/[token]` page loads and calls `POST /api/auth/verify-email` with the token
3. API atomically deletes the token (consumed) and marks `email_verified = true` for the user
4. Page calls `update({ emailVerified: true })` to refresh the JWT in-place
5. Redirect → `/dashboard` (AuthGuard now allows access)

### Edge cases

- **Expired token (> 24 h):** API returns 400, page shows "link expired" with option to resend
- **Already verified:** clicking old link does nothing harmful (token already consumed)
- **Not signed in when clicking link:** JWT refresh is still called; on next login the DB value `email_verified = true` is picked up fresh in `authorize()`
- **Resend:** `POST /api/auth/resend-verification` (requires active session, rate-limited by your email provider)

### Token storage

```sql
-- email_verification_tokens
token     TEXT PRIMARY KEY,      -- 32-byte hex (64 chars)
email     TEXT NOT NULL,
expires_at TIMESTAMPTZ NOT NULL, -- now() + 24 hours
created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
```

---

## Stage 3 + 4: Onboarding Modal

**Triggered by:** `OnboardingGuard` component inside the dashboard layout  
**Shown when:** `session.user.emailVerified = true` AND `session.user.onboardingCompleted = false`  
**Files:**
- `src/_components/onboarding/OnboardingModal.tsx`
- `src/_components/onboarding/OnboardingGuard.tsx`
- `src/app/api/onboarding/route.ts` — `POST`: saves both steps

The modal is **uncloseable** — the user must complete it to proceed. It overlays the dashboard so they can see the product behind it.

### Step 1 — Tell us about yourself (~5 seconds)

Single-select card list. Options:

| Value        | Label               |
|--------------|---------------------|
| freelancer   | Freelancer          |
| agency       | Marketing Agency    |
| sales_team   | Sales Team          |
| founder      | Startup Founder     |
| other        | Other               |

Selection enables the "Continue" button.

### Step 2 — Set up your workspace (~30 seconds)

| Field                      | Required | Notes                                           |
|----------------------------|----------|-------------------------------------------------|
| Workspace / Business Name  | ✅       | Pre-filled as `"{FirstName}'s Workspace"`       |
| Business Country           | ✅       | Where the business operates — stored in `workspaces.country`; drives lead search defaults, GDPR rules. Not the user's personal country (see `users.country` in profile settings). |
| How did you hear about us? | ❌       | Optional dropdown; stored in `workspaces.heard_from` |

### What happens on submit

1. `POST /api/onboarding` with `{ userType, workspaceName, country, heardFrom? }`
2. Server (requires active session):
   - Updates `users.user_type` and `users.onboarding_completed = true`
   - Creates a row in `workspaces` (with `owner_id` = current user)
   - Creates a row in `workspace_members` (`role = 'owner'`)
3. Page calls `update({ onboardingCompleted: true })` to refresh JWT
4. `OnboardingGuard` detects `onboardingCompleted = true` → modal unmounts
5. Toast: "Welcome to SyncLead! 🚀"

### Data stored

```sql
-- users table (updated)
user_type = 'freelancer' | 'agency' | 'sales_team' | 'founder' | 'other'
onboarding_completed = true

-- workspaces table (created)
id, name, country, heard_from, owner_id, created_at, updated_at

-- workspace_members table (created)
workspace_id, user_id, role = 'owner', joined_at
```

---

## AuthGuard Routing Logic

```
Unauthenticated + non-public route           → /login
Authenticated + verified + auth pages        → /dashboard
Authenticated + NOT verified + auth pages    → /verify-email
Authenticated + NOT verified + dashboard     → /verify-email
Authenticated + verified + verify-email      → /dashboard (handled by page)
```

Open routes (accessible without login): `/verify-email/*`

---

## Database Tables

### Migration

File: `supabase/migrations/20260508000000_add_onboarding_and_workspaces.sql`

### Schema additions

```sql
-- New columns on users
email_verified       BOOLEAN NOT NULL DEFAULT false
onboarding_completed BOOLEAN NOT NULL DEFAULT false
user_type            TEXT CHECK (IN 'freelancer','agency','sales_team','founder','other')

-- New tables
email_verification_tokens (token PK, email, expires_at, created_at)
workspaces            (id PK, name, country, heard_from, owner_id FK, created_at, updated_at)
workspace_members     (workspace_id FK, user_id FK, role, joined_at) — composite PK
```

> **Existing users:** The migration sets `email_verified = true` and `onboarding_completed = true`
> for all rows that existed before this migration runs, so they skip the flow entirely.

---

## Applying the Migration

```bash
cd packages/core
yarn db:push
```

See `docs/database/migrations.md` for the full workflow.

---

## Key Files Reference

| Concern                    | File |
|----------------------------|------|
| Sign-up page               | `src/app/[locale]/(site)/(auth)/sign-up/page.tsx` |
| Sign-up API                | `src/app/api/auth/sign-up/route.ts` |
| Verify-email check page    | `src/app/[locale]/(site)/(auth)/verify-email/page.tsx` |
| Verify-email token page    | `src/app/[locale]/(site)/(auth)/verify-email/[token]/page.tsx` |
| Verify-email API           | `src/app/api/auth/verify-email/route.ts` |
| Resend verification API    | `src/app/api/auth/resend-verification/route.ts` |
| Onboarding modal           | `src/_components/onboarding/OnboardingModal.tsx` |
| Onboarding guard           | `src/_components/onboarding/OnboardingGuard.tsx` |
| Onboarding API             | `src/app/api/onboarding/route.ts` |
| Email verification tokens  | `src/lib/emailVerification.ts` |
| Verification email template| `src/_components/mails/verify_email.tsx` |
| Workspace service          | `src/http/services/workspaces.ts` |
| User service additions     | `src/http/services/users.ts` (`markEmailVerified`, `completeOnboarding`) |
| Auth JWT/session           | `src/lib/auth.ts` |
| Session types              | `src/_types/next-auth.d.ts` |
| Route guard                | `src/guards/AuthGuard.tsx` |
| Migration                  | `supabase/migrations/20260508000000_add_onboarding_and_workspaces.sql` |
