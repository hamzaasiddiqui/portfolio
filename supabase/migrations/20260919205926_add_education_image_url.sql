-- A photo of the institution for the Education section.
--
-- Same contract as projects.image_url: a path the app can render directly —
-- either a file under /public or a Supabase Storage URL. Nullable, because
-- an entry without a picture is still a complete entry and the layout
-- already accounts for its absence.
alter table public.education add column image_url text;

comment on column public.education.image_url is 'Campus / institution photo. A /public path or a Supabase Storage URL; null when there is no picture.';
