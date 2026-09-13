-- Skills are a flat, icon-led list, not a self-assessment.
--
-- 1. `level` goes away. A 1-5 proficiency score on your own skills is a claim
--    no reader can check and the owner didn't want to make.
-- 2. `icon_name` becomes `icon_slug` and is now required. Every skill renders
--    with a brand mark, so an iconless skill is a broken cell, not a variant.
--    The rename is deliberate: `icon_name` elsewhere in this schema
--    (`social_links`, `process_steps`) holds a Phosphor icon name, whereas
--    these are Simple Icons slugs. Same-named columns pointing at different
--    icon sets would be a trap; different names make the namespace explicit.
alter table public.skills drop column level;

alter table public.skills rename column icon_name to icon_slug;

-- Backfill before the not-null: existing rows carry Phosphor names that are
-- meaningless as Simple Icons slugs, and the seed script replaces them all
-- anyway. Anything left over gets a slug that at least resolves.
update public.skills set icon_slug = 'simpleicons' where icon_slug is null or icon_slug = '';

alter table public.skills alter column icon_slug set not null;

comment on table public.skills is 'Skills grouped by category. `display_order` is global (not per-category) so it fixes both the category order and the order within each one.';
comment on column public.skills.icon_slug is 'Simple Icons slug (https://simpleicons.org), e.g. "typescript", "nextdotjs". Resolved to path data by the app''s icon map, which also supplies the handful of marks Simple Icons does not carry.';
comment on column public.skills.display_order is 'Global ordering across all skills. Categories are emitted in the order their first member appears, so this single column controls both levels.';

-- The old index was (category, display_order), which only helps if the read
-- sorts by category first. It doesn't: ordering by category alphabetises the
-- groups, and the intended group order isn't alphabetical.
drop index if exists public.skills_category_display_order_idx;
create index skills_display_order_idx on public.skills (display_order);
