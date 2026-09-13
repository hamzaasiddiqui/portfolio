import { Section, SectionLabel } from "@/components/sections/section";
import { RichText } from "@/components/rich-text";
import type { Tables } from "@/lib/supabase/database.types";

export function EducationSection({ education }: { education: Tables<"education">[] }) {
  return (
    <Section id="education" label="Education">
      <SectionLabel>Education</SectionLabel>

      {education.length === 0 ? (
        <p className="text-body text-muted-foreground">Education coming soon.</p>
      ) : (
        <ul className="flex flex-col">
          {education.map((entry) => (
            <li
              key={entry.id}
              className="grid grid-cols-1 gap-x-8 gap-y-3 border-b border-border py-7 first:pt-0 last:border-b-0 sm:grid-cols-[11rem_minmax(0,1fr)]"
            >
              <div>
                {entry.graduation_year ? (
                  <span className="font-mono text-meta text-muted-foreground tabular-nums">
                    Class of {entry.graduation_year}
                  </span>
                ) : null}
              </div>

              <div>
                <h3 className="font-display text-h2 font-medium">{entry.degree}</h3>

                <p className="mt-1 font-mono text-meta text-accent uppercase">
                  {entry.institution_url ? (
                    <a
                      href={entry.institution_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors duration-200 ease-apple hover:text-accent-ink"
                    >
                      {entry.institution}
                    </a>
                  ) : (
                    entry.institution
                  )}
                </p>

                {entry.honors.length > 0 || entry.activities.length > 0 ? (
                  <dl className="mt-6 flex flex-col gap-5">
                    {entry.honors.length > 0 ? (
                      <div>
                        <dt className="font-mono text-meta text-muted-foreground/70 uppercase">
                          Honors
                        </dt>
                        <dd className="mt-2 flex flex-col gap-1 text-body text-muted-foreground">
                          {entry.honors.map((honor, index) => (
                            <span key={index}>
                              <RichText text={honor} />
                            </span>
                          ))}
                        </dd>
                      </div>
                    ) : null}

                    {entry.activities.length > 0 ? (
                      <div>
                        <dt className="font-mono text-meta text-muted-foreground/70 uppercase">
                          Activities
                        </dt>
                        <dd className="mt-2 flex flex-col gap-1 text-body text-muted-foreground">
                          {entry.activities.map((activity, index) => (
                            <span key={index}>
                              <RichText text={activity} />
                            </span>
                          ))}
                        </dd>
                      </div>
                    ) : null}
                  </dl>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}
