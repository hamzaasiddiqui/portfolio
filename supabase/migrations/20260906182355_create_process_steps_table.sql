-- Steps describing the owner's working process/methodology, shown in the Process section.
create table public.process_steps (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  icon_name text,
  display_order smallint not null default 0,
  created_at timestamptz not null default now()
);

comment on table public.process_steps is 'Ordered steps describing the owner''s work process, shown in the Process section.';

alter table public.process_steps enable row level security;

create policy "Public can read process steps"
  on public.process_steps for select
  to anon, authenticated
  using (true);

create index process_steps_display_order_idx on public.process_steps (display_order);
