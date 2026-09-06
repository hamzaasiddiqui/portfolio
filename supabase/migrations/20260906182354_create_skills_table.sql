-- Skills shown in the Skills section, grouped by category with an optional proficiency level.
create table public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  level smallint check (level between 1 and 5),
  icon_name text,
  display_order smallint not null default 0,
  created_at timestamptz not null default now()
);

comment on table public.skills is 'Skills grouped by category (e.g. Languages, Tools) with an optional 1-5 proficiency level.';

alter table public.skills enable row level security;

create policy "Public can read skills"
  on public.skills for select
  to anon, authenticated
  using (true);

create index skills_category_display_order_idx on public.skills (category, display_order);
