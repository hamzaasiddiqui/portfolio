import { Section, SectionLabel } from "@/components/sections/section";
import type { Tables } from "@/lib/supabase/database.types";

const dateFormatter = new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" });

function formatRange(startDate: string, endDate: string | null, isCurrent: boolean) {
  const start = dateFormatter.format(new Date(startDate));
  if (isCurrent) return `${start} — Present`;
  if (!endDate) return start;
  return `${start} — ${dateFormatter.format(new Date(endDate))}`;
}

export function ExperienceSection({ experiences }: { experiences: Tables<"experiences">[] }) {
  return (
    <Section id="experience" label="Experience">
      <SectionLabel>Experience</SectionLabel>

      {experiences.length === 0 ? (
        <p className="text-body text-muted-foreground">Experience coming soon.</p>
      ) : (
        <ul className="flex flex-col">
          {experiences.map((experience) => (
            <li
              key={experience.id}
              className="grid grid-cols-1 gap-x-8 gap-y-3 border-b border-border py-7 first:pt-0 last:border-b-0 sm:grid-cols-[11rem_minmax(0,1fr)]"
            >
              <div className="flex flex-col gap-1">
                <span className="font-mono text-meta text-muted-foreground tabular-nums">
                  {formatRange(experience.start_date, experience.end_date, experience.is_current)}
                </span>
                {experience.location ? (
                  <span className="font-mono text-meta text-muted-foreground/70 uppercase">
                    {experience.location}
                  </span>
                ) : null}
              </div>

              <div>
                <h3 className="font-display text-h2 font-medium">{experience.role}</h3>
                <p className="mt-1 font-mono text-meta text-accent uppercase">{experience.company}</p>
                {experience.description ? (
                  <p className="mt-4 max-w-prose text-body text-pretty text-muted-foreground">
                    {experience.description}
                  </p>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}
