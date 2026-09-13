-- Content leaves the migration history.
--
-- 20260906190614_seed_content.sql inserted placeholder rows so the UI had
-- something to render. Real content is now loaded by `pnpm seed`
-- (scripts/seed/), which is the single source of copy — deliberately not a
-- migration, so editing a sentence doesn't mean writing schema history.
--
-- This clears the placeholders so a fresh `supabase db reset` produces empty
-- content tables rather than TODO text that the seed then has to overwrite.
-- `contact_messages` is untouched: it holds real submissions, not content.
delete from public.profile;
delete from public.social_links;
delete from public.skills;
delete from public.process_steps;
delete from public.experiences;
delete from public.projects;

-- The one convention the whole content layer depends on, recorded where the
-- schema can be read: prose columns carry inline markdown links.
comment on column public.profile.about_text is
  'Prose supporting inline markdown links: [label](https://example.com). The app renders these as new-tab anchors. Links live inside the text rather than in a sidecar table so the copy stays editable as one string and a link can never drift from the sentence it belongs to. Applies equally to experiences.highlights and education.activities.';
