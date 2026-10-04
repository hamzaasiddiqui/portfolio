import type { ReactNode } from "react";
import { Section, SectionLabel } from "@/components/sections/section";
import { RichText } from "@/components/rich-text";
import { ParallaxImage } from "@/components/motion/parallax-image";
import type { Tables } from "@/lib/supabase/database.types";

const CUT = "min(7rem, 30%)";
const CHAMFER = `polygon(${CUT} 0, 100% 0, 100% 100%, 0 100%, 0 ${CUT})`;

function CampusFigure({ src, alt }: { src: string; alt: string }) {
  return (
    <ParallaxImage
      src={src}
      alt={alt}
      sizes="(min-width: 1536px) 34rem, (min-width: 1280px) 28rem, (min-width: 1024px) 22rem, 100vw"
      drift={6}
      className="aspect-video w-full lg:aspect-4/3"
      style={{ clipPath: CHAMFER }}
    />
  );
}

function Detail({ label, items }: { label: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div data-reveal>
      <dt className="font-label text-meta text-muted-foreground/70 uppercase">{label}</dt>
      <dd className="mt-2 flex flex-col gap-1 text-body text-muted-foreground">
        {items.map((item, index) => (
          <span key={index}>
            <RichText text={item} />
          </span>
        ))}
      </dd>
    </div>
  );
}

function Kicker({ children }: { children: ReactNode }) {
  return (
    <span data-reveal className="font-label text-meta text-muted-foreground uppercase">
      {children}
    </span>
  );
}

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
              className="grid grid-cols-1 gap-x-12 gap-y-8 border-b border-border py-8 first:pt-0 last:border-b-0 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:items-center xl:grid-cols-[minmax(0,28rem)_minmax(0,1fr)] xl:gap-x-16 2xl:grid-cols-[minmax(0,34rem)_minmax(0,1fr)]"
            >
              {entry.image_url ? (
                <CampusFigure src={entry.image_url} alt={`${entry.institution} campus`} />
              ) : (
                <div aria-hidden="true" className="hidden lg:block" />
              )}

              <div className="flex flex-col">
                {entry.graduation_year ? <Kicker>Class of {entry.graduation_year}</Kicker> : null}

                <h3 data-reveal className="mt-3 font-display text-h2 font-medium text-balance">
                  {entry.degree}
                </h3>

                <p data-reveal className="mt-2 font-label text-meta text-accent uppercase">
                  {entry.institution_url ? (
                    <a
                      href={entry.institution_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline decoration-accent/30 decoration-1 underline-offset-[6px] transition-colors duration-200 ease-apple hover:text-accent-ink hover:decoration-accent"
                    >
                      {entry.institution}
                    </a>
                  ) : (
                    entry.institution
                  )}
                </p>

                {entry.honors.length > 0 || entry.activities.length > 0 ? (
                  <>
                    <span
                      data-reveal="line"
                      aria-hidden="true"
                      className="mt-8 block h-px w-full bg-border"
                    />
                    <dl className="mt-6 grid grid-cols-1 gap-x-10 gap-y-6 sm:grid-cols-2">
                      <Detail label="Honors" items={entry.honors} />
                      <Detail label="Activities" items={entry.activities} />
                    </dl>
                  </>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}
