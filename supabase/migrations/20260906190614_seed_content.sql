-- Placeholder content so the UI has real rows to render against.
-- Edit these in place (or via a fresh migration) with actual copy —
-- this is throwaway text, not a content deliverable.

insert into public.profile (id, name, tagline, about_text, resume_url, seo_title, seo_description)
values (
  true,
  'Hamza Siddiqui',
  'TODO: one-line tagline goes here',
  'TODO: About section copy goes here. Replace with real bio text.',
  '/resume.pdf',
  'Hamza Siddiqui',
  'TODO: SEO description goes here.'
)
on conflict (id) do nothing;

insert into public.social_links (platform, url, icon_name, display_order) values
  ('linkedin', 'https://linkedin.com/in/TODO', 'linkedin-logo', 0),
  ('github', 'https://github.com/TODO', 'github-logo', 1),
  ('iXperience', 'https://TODO.example.com', 'globe', 2),
  ('email', 'mailto:TODO@example.com', 'envelope-simple', 3);

insert into public.skills (name, category, level, icon_name, display_order) values
  ('TypeScript', 'Languages', 4, 'code', 0),
  ('Python', 'Languages', 3, 'code', 1),
  ('React', 'Frameworks', 4, 'atom', 0),
  ('Next.js', 'Frameworks', 4, 'atom', 1),
  ('PostgreSQL', 'Tools', 3, 'database', 0),
  ('Supabase', 'Tools', 3, 'database', 1);

insert into public.process_steps (title, description, icon_name, display_order) values
  ('TODO Step One', 'TODO: describe the first step of your process.', 'lightbulb', 0),
  ('TODO Step Two', 'TODO: describe the second step of your process.', 'pencil-simple', 1),
  ('TODO Step Three', 'TODO: describe the third step of your process.', 'rocket-launch', 2);

insert into public.experiences (company, role, description, location, start_date, end_date, is_current, display_order) values
  ('TODO Company', 'TODO Role', 'TODO: describe what you did here.', 'TODO City', '2024-01-01', null, true, 0),
  ('TODO Previous Company', 'TODO Previous Role', 'TODO: describe what you did here.', 'TODO City', '2022-06-01', '2023-12-31', false, 1);

insert into public.projects (title, description, url, repo_url, image_url, tags, featured, display_order) values
  ('TODO Project One', 'TODO: describe this project.', null, null, null, array['TODO'], true, 0),
  ('TODO Project Two', 'TODO: describe this project.', null, null, null, array['TODO'], false, 1);
