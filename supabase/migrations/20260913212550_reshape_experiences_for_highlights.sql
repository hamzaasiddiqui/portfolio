-- A role is a list of accomplishments, not a paragraph.
--
-- The real copy for every role is 4-6 bullets, so `description` (one prose
-- blob) was always going to be null. `highlights` replaces it: an ordered
-- text[] matching the `projects.tags` convention already in this schema.
--
-- Rejected alternative: an `experience_highlights` child table. Bullets have
-- no attributes of their own beyond their text and their order, so a table
-- buys nothing and costs every read a join.
alter table public.experiences drop column description;

alter table public.experiences add column highlights text[] not null default '{}';

-- Every company in the real copy links out to its site.
alter table public.experiences add column company_url text;

comment on column public.experiences.highlights is 'Ordered accomplishment bullets. Each entry may contain inline markdown links — see the note on profile.about_text.';
comment on column public.experiences.company_url is 'Company website. Rendered as a new-tab link on the company name.';
