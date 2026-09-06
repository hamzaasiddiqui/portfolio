@AGENTS.md

# Portfolio project — working notes

Personal portfolio site (Hamza Siddiqui). Layout/interactions are specified in
`wireframe.excalidraw` at the repo root — read it before touching layout/UX,
it's the source of truth for the sidebar, sections, and hover behaviors.

## Stack

- Next.js 16.3.4 (App Router) — see `node_modules/next/dist/docs/` per AGENTS.md
  before writing Next.js-specific code, this version has breaking changes vs. training data.
- React 19.2, Tailwind v4, shadcn/radix-ui, @phosphor-icons/react.
- **Supabase** (Postgres + PostgREST) is the *only* backend. No static JSON
  content files — every piece of site content (profile, skills, experience,
  projects, process steps, social links) is a Supabase table read via
  `@supabase/supabase-js` / `@supabase/ssr`. Contact form writes to
  `contact_messages`.

## Supabase protocol — read before touching the database

**Every schema change is a migration file. No exceptions, no dashboard SQL editor edits.**

1. `supabase migration new <descriptive_name>` to create the file.
2. Write plain SQL by hand in `supabase/migrations/<timestamp>_<name>.sql`.
   Every table gets `alter table ... enable row level security;` plus explicit
   policies in the same migration — never ship a table without RLS.
3. Push with `supabase db push --db-url "$DATABASE_URL"` (this project is not
   `supabase link`-ed to a managed org — the CLI account used in this
   environment doesn't have API access to this project, only direct Postgres
   access works. Always pass `--db-url` explicitly rather than `--linked`).
   Run `--dry-run` first when unsure what will apply.
4. After any schema change, regenerate types:
   `supabase gen types typescript --db-url "$DATABASE_URL" > lib/supabase/database.types.ts`
   (requires Docker running — it spins up a local postgres-meta container).
5. Never hand-edit `lib/supabase/database.types.ts` — it's generated output.
6. Table/column naming: snake_case, plural table names, `display_order`
   (smallint) for manually-orderable content, `created_at timestamptz default now()`
   on every table.

### Current schema (public)

- `profile` — singleton (id boolean, constrained to `true`), site owner's
  name/tagline/about/resume/avatar/SEO fields.
- `social_links` — platform, url, icon_name, display_order.
- `skills` — name, category, level (1-5, nullable), icon_name, display_order.
- `process_steps` — title, description, icon_name, display_order.
- `experiences` — company, role, description, location, start/end dates, is_current, display_order.
- `projects` — title, description, url, repo_url, image_url, tags[], featured, display_order.
- `contact_messages` — name, email, message, created_at. Insert-only for `anon`;
  no public select policy (submissions aren't publicly readable).

All content tables: public `select` policy for `anon`/`authenticated`, no
public write access — content is managed by editing rows directly (via
migrations/seed data or, later, an authenticated admin path), not from the
public site.

### Client usage

- Server Components / Server Actions: `import { createClient } from "@/lib/supabase/server"` (async, cookie-aware).
- Client Components: `import { createClient } from "@/lib/supabase/client"`.
- Both are typed against `Database` from `lib/supabase/database.types.ts` —
  always import and use that type, don't query with an untyped client.
- Env vars live in `.env.local` (gitignored): `NEXT_PUBLIC_SUPABASE_URL`,
  `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY`. Never commit
  real keys; never log the DB connection string or password.
- **Never prefix the service role key with `NEXT_PUBLIC_`.** That prefix makes
  Next.js bundle the var into client JS, which would expose an RLS-bypassing
  key to every visitor. It must stay `SUPABASE_SERVICE_ROLE_KEY` and only be
  read in server-only code (Server Actions/Route Handlers), never in a
  Client Component.

## Conventions

- Package manager is **pnpm** (`pnpm-workspace.yaml` present) — don't use npm/yarn.
- Icons: prefer `@phosphor-icons/react` over inline SVG for UI icons (nav,
  socials, collapse/theme toggles) to match what's already installed.
- Dark mode is the default (per wireframe) — build with dark-first styling.
- This file is intentionally gitignored — it's local working context, not
  checked into the repo.
