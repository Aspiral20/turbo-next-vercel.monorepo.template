# Database Migrations

## Quick reference

```bash
# First time only (per developer)
npx supabase login
npx supabase link --project-ref cyjyvjmkmomxrpibqgtv

# Create a new migration
yarn db:migration:new your_change_name
# → edit supabase/migrations/<timestamp>_your_change_name.sql

# Apply pending migrations to the remote DB
yarn db:push
```

---

We use the **Supabase CLI** (installed as a devDependency) for schema migrations.  
Migrations are plain SQL files tracked in `supabase/migrations/` and committed to git.  
The remote DB records which migrations have already run in its `supabase_migrations` table — so `db:push` only applies the ones that are new.

---

## One-time setup (per developer)

Run these once after cloning the repo:

```bash
# 1. Authenticate with Supabase (opens browser)
npx supabase login

# 2. Link your local workspace to the remote project
npx supabase link --project-ref cyjyvjmkmomxrpibqgtv
```

---

## Creating a migration

```bash
yarn db:migration:new <descriptive_name>
```

This creates an empty timestamped file:

```
supabase/migrations/YYYYMMDDHHMMSS_descriptive_name.sql
```

Open that file and write your SQL — `ALTER TABLE`, `CREATE INDEX`, `DROP COLUMN`, etc.  
Commit the file so the whole team gets it.

**Example:**

```bash
yarn db:migration:new add_company_to_users
```

```sql
-- supabase/migrations/20260507140000_add_company_to_users.sql
ALTER TABLE users ADD COLUMN company text;
```

---

## Applying migrations

```bash
yarn db:push
```

This pushes every migration in `supabase/migrations/` that hasn't been applied yet to the remote DB.

---

## Seeding

Seeds are one-time bootstrap data (e.g. initial users). Run after the first migration:

```bash
yarn db:seed
```

The seed script lives at `supabase/seed.ts`.

---

## Full workflow for a new schema change

```bash
# 1. Create the migration file
yarn db:migration:new your_change_name

# 2. Write the SQL in supabase/migrations/<timestamp>_your_change_name.sql

# 3. Apply it to the remote DB
yarn db:push

# 4. Commit the migration file
git add supabase/migrations/
git commit -m "db: add <your_change_name> migration"
```

---

## Initial schema

The initial tables (`users`, `reset_tokens`) were created via `supabase/migration.sql`.  
That file was applied manually through the Supabase SQL editor and is kept as a reference.  
All future changes must go through the migration workflow above.
