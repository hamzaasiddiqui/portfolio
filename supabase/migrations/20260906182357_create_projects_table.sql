-- Portfolio projects shown in the Projects section.
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  url text,
  repo_url text,
  image_url text,
  tags text[] not null default '{}',
  featured boolean not null default false,
  display_order smallint not null default 0,
  created_at timestamptz not null default now()
);

comment on table public.projects is 'Portfolio projects shown in the Projects section.';

alter table public.projects enable row level security;

create policy "Public can read projects"
  on public.projects for select
  to anon, authenticated
  using (true);

create index projects_display_order_idx on public.projects (display_order);
create index projects_featured_idx on public.projects (featured);
