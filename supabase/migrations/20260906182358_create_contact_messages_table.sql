-- Messages submitted through the Connect section's contact form.
-- Insert-only from the public: visitors can submit but never read back any message.
create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

comment on table public.contact_messages is 'Contact form submissions from the Connect section. Insert-only for anonymous visitors.';

alter table public.contact_messages enable row level security;

create policy "Public can submit contact messages"
  on public.contact_messages for insert
  to anon, authenticated
  with check (true);
