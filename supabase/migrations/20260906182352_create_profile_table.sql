-- Singleton table holding the site owner's profile/hero content.
-- Enforced to a single row via a fixed-value check constraint on `id`.
create table public.profile (
  id boolean primary key default true,
  name text not null,
  tagline text,
  about_text text,
  resume_url text,
  avatar_url text,
  seo_title text,
  seo_description text,
  updated_at timestamptz not null default now(),
  constraint profile_singleton check (id)
);

comment on table public.profile is 'Singleton row: site owner profile/about content shown in the About section and page metadata.';

alter table public.profile enable row level security;

create policy "Public can read profile"
  on public.profile for select
  to anon, authenticated
  using (true);
