import { Section } from "@/components/sections/section";
import { Eyebrow } from "@/components/sections/eyebrow";
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
      <Eyebrow>Skills</Eyebrow>
      <h2 className="text-h1 font-semibold text-balance text-foreground">Skills</h2>

      {groups.size === 0 ? (
        <p className="mt-8 text-body text-muted-foreground">Skills coming soon.</p>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-x-12 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from(groups.entries()).map(([category, items]) => (
            <div key={category}>
              <h3 className="font-mono text-meta text-muted-foreground uppercase">{category}</h3>
              <ul className="mt-3 flex flex-col gap-2">
                {items.map((skill) => (
                  <li key={skill.id} className="flex items-baseline justify-between gap-3 text-body text-foreground">
                    <span className="truncate">{skill.name}</span>
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
