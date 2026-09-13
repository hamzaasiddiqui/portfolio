-- Education gets its own table rather than sharing `experiences`.
--
-- The two look similar but diverge on every field that matters: a degree has
-- a graduating class rather than a date range, carries honours and societies,
-- and has no notion of "is_current" or accomplishment bullets. Folding them
-- together would mean a `kind` column plus half the columns null on every row.
create table public.education (
  id uuid primary key default gen_random_uuid(),
  institution text not null,
  institution_url text,
  degree text not null,
  graduation_year smallint,
  honors text[] not null default '{}',
  activities text[] not null default '{}',
  display_order smallint not null default 0,
  created_at timestamptz not null default now(),
  constraint education_graduation_year_check
    check (graduation_year is null or graduation_year between 1900 and 2200)
);

comment on table public.education is 'Degrees shown in the Education section.';
comment on column public.education.graduation_year is 'Graduating class year. A plain year, not a date range: that is how the credential is actually described ("Class of 2024").';
comment on column public.education.honors is 'Academic distinctions, e.g. "Dean''s Honor Roll".';
comment on column public.education.activities is 'Societies and roles held while enrolled. Each entry may contain inline markdown links — see the note on profile.about_text.';

alter table public.education enable row level security;

create policy "Public can read education"
  on public.education for select
  to anon, authenticated
  using (true);

create index education_display_order_idx on public.education (display_order);
