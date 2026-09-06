-- Work/education history shown in the Experience section.
create table public.experiences (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  role text not null,
  description text,
  location text,
  start_date date not null,
  end_date date,
  is_current boolean not null default false,
  display_order smallint not null default 0,
  created_at timestamptz not null default now(),
  constraint experiences_end_date_check check (end_date is null or end_date >= start_date)
);

comment on table public.experiences is 'Work/education history entries shown in the Experience section.';

alter table public.experiences enable row level security;

create policy "Public can read experiences"
  on public.experiences for select
  to anon, authenticated
  using (true);

create index experiences_display_order_idx on public.experiences (display_order);
