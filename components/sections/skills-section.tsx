import { Section, SectionLabel } from "@/components/sections/section";
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
        <div className="grid grid-cols-1 gap-x-16 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from(groups.entries()).map(([category, items]) => (
            <div key={category}>
              <p className="font-mono text-meta text-muted-foreground uppercase">{category}</p>
              <ul className="mt-4 flex flex-col">
                {items.map((skill) => (
                  <li
                    key={skill.id}
                    className="flex items-baseline justify-between gap-4 border-b border-border py-3 last:border-b-0"
                  >
                    <span className="font-display text-h3 font-medium">{skill.name}</span>
                    {skill.level ? (
                      <span
                        className="shrink-0 font-mono text-meta text-muted-foreground tabular-nums"
                        aria-label={`Proficiency ${skill.level} of 5`}
                      >
                        {skill.level}/5
                      </span>
                    ) : null}
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
