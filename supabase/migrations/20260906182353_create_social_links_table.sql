-- Social/external links shown as icons in the sidebar (LinkedIn, GitHub, email, etc.)
-- that expand into labeled pills on hover.
create table public.social_links (
  id uuid primary key default gen_random_uuid(),
  platform text not null,
  url text not null,
  icon_name text not null,
  display_order smallint not null default 0,
  created_at timestamptz not null default now()
);

comment on table public.social_links is 'External links (LinkedIn, GitHub, email, etc.) rendered as hover-expanding icon pills.';

alter table public.social_links enable row level security;

create policy "Public can read social links"
  on public.social_links for select
  to anon, authenticated
  using (true);

create index social_links_display_order_idx on public.social_links (display_order);
