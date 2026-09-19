import { Section, SectionLabel } from "@/components/sections/section";
import { RichText } from "@/components/rich-text";
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
              <div data-reveal className="flex flex-col gap-1">
                <span className="font-label text-meta text-muted-foreground tabular-nums">
                  {formatRange(experience.start_date, experience.end_date, experience.is_current)}
                </span>
                {experience.location ? (
                  <span className="font-label text-meta text-muted-foreground/70 uppercase">
                    {experience.location}
                  </span>
                ) : null}
              </div>

              <div>
                <h3 data-reveal className="font-display text-h3 font-medium">
                  {experience.role}
                </h3>

                <p data-reveal className="mt-1.5 font-label text-body text-accent uppercase">
                  {experience.company_url ? (
                    <a
                      href={experience.company_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline decoration-accent/30 decoration-1 underline-offset-[6px] transition-colors duration-200 ease-apple hover:text-accent-ink hover:decoration-accent"
                    >
                      {experience.company}
                    </a>
                  ) : (
                    experience.company
                  )}
                </p>

                {experience.highlights.length > 0 ? (
                  <ul className="mt-5 flex max-w-4xl flex-col gap-2.5">
                    {experience.highlights.map((highlight, index) => (
                      <li
                        key={index}
                        data-reveal
                        className="relative pl-5 text-body text-pretty text-muted-foreground"
                      >
                        <span
                          aria-hidden="true"
                          className="absolute top-[0.65em] left-0 size-1 rounded-full bg-accent"
                        />
                        <RichText text={highlight} />
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}
