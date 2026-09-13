import Image from "next/image";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr/ArrowUpRight";
import { Section, SectionLabel } from "@/components/sections/section";
import type { Tables } from "@/lib/supabase/database.types";

export function ProjectsSection({ projects }: { projects: Tables<"projects">[] }) {
  return (
    <Section id="projects" label="Projects">
      <SectionLabel>Projects</SectionLabel>

      {projects.length === 0 ? (
        <p className="text-body text-muted-foreground">Projects coming soon.</p>
      ) : (
        <ul className="grid grid-cols-1 gap-x-12 gap-y-14 sm:grid-cols-2">
          {projects.map((project) => {
            const href = project.url ?? project.repo_url;
            const showSource = Boolean(project.repo_url && project.url);

            return (
              <li
                key={project.id}
                className="group/card relative flex flex-col transition-transform duration-500 ease-apple hover:-translate-y-1.5"
              >
                {project.image_url ? (
                  <div className="relative mb-5 aspect-4/3 w-full overflow-hidden">
                    <Image
                      src={project.image_url}
                      alt=""
                      fill
                      loading="lazy"
                      sizes="(min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 ease-apple group-hover/card:scale-[1.04]"
                    />
                  </div>
                ) : null}

                <h3 className="font-display text-h2 font-medium transition-colors duration-300 ease-apple group-hover/card:text-accent-ink">
                  {href ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-start gap-1 rounded-sm outline-none after:absolute after:inset-0 after:content-[''] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
                    >
                      {project.title}
                      <ArrowUpRight
                        size={18}
                        weight="bold"
                        aria-hidden="true"
                        className="mt-1 shrink-0 transition-transform duration-300 ease-apple group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5"
                      />
                    </a>
                  ) : (
                    project.title
                  )}
                </h3>

                {project.description ? (
                  <p className="mt-2 text-body text-pretty text-muted-foreground">
                    {project.description}
                  </p>
                ) : null}

                <div className="relative mt-5 pt-3">
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-px bg-border"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-0 h-px w-0 bg-accent transition-[width] duration-500 ease-apple group-hover/card:w-full"
                  />

                  {project.tags.length > 0 || showSource ? (
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-meta text-muted-foreground uppercase">
                      {project.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                      {showSource ? (
                        <a
                          href={project.repo_url ?? undefined}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="relative ml-auto transition-colors duration-200 ease-apple hover:text-accent-ink"
                        >
                          Source
                        </a>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Section>
  );
}
