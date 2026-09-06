import { Section } from "@/components/sections/section";
import { Eyebrow } from "@/components/sections/eyebrow";
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
      <Eyebrow>Experience</Eyebrow>
      <h2 className="text-h1 font-semibold text-balance text-foreground">Experience</h2>

      {experiences.length === 0 ? (
        <p className="mt-8 text-body text-muted-foreground">Experience coming soon.</p>
      ) : (
        <ul className="mt-10 flex flex-col gap-8">
          {experiences.map((experience) => (
            <li
              key={experience.id}
              className="grid grid-cols-1 gap-1 border-t border-border pt-6 first:border-t-0 first:pt-0 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-6"
            >
              <span className="font-mono text-meta text-muted-foreground tabular-nums">
                {formatRange(experience.start_date, experience.end_date, experience.is_current)}
              </span>
              <div>
                <h3 className="text-h3 font-semibold text-foreground">
                  {experience.role} <span className="text-muted-foreground">— {experience.company}</span>
                </h3>
                {experience.location ? (
                  <p className="mt-1 font-mono text-meta text-muted-foreground">{experience.location}</p>
                ) : null}
                {experience.description ? (
                  <p className="mt-3 max-w-prose text-body text-foreground/90 text-pretty">
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
