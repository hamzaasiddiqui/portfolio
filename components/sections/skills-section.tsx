import { Section, SectionLabel } from "@/components/sections/section";
import { SkillIcon } from "@/components/sections/skill-icon";
import type { Tables } from "@/lib/supabase/database.types";

function groupByCategory(skills: Tables<"skills">[]) {
  const groups = new Map<string, Tables<"skills">[]>();
  for (const skill of skills) {
    const list = groups.get(skill.category) ?? [];
    list.push(skill);
    groups.set(skill.category, list);
  }
  return groups;
}

export function SkillsSection({ skills }: { skills: Tables<"skills">[] }) {
  const groups = groupByCategory(skills);

  return (
    <Section id="skills" label="Skills">
      <SectionLabel>Skills</SectionLabel>

      {groups.size === 0 ? (
        <p className="text-body text-muted-foreground">Skills coming soon.</p>
      ) : (
        <div className="grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 xl:gap-x-8">
          {Array.from(groups.entries()).map(([category, items]) => (
            <div key={category}>
              <p data-reveal className="font-label text-meta text-muted-foreground uppercase">
                {category}
              </p>
              <ul className="mt-4 flex flex-col">
                {items.map((skill) => (
                  <li
                    key={skill.id}
                    data-reveal
                    className="group/skill flex items-center gap-3 border-b border-border py-3 last:border-b-0"
                  >
                    <SkillIcon
                      slug={skill.icon_slug}
                      name={skill.name}
                      className="text-muted-foreground transition-colors duration-200 ease-apple group-hover/skill:text-accent"
                    />
                    <span className="font-display text-h3 font-medium">{skill.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </Section>
  );
}
