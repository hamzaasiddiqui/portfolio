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
          {projects.map((project) => (
            <li key={project.id} className="group flex flex-col">
              {project.image_url ? (
                <div className="relative mb-5 aspect-4/3 w-full overflow-hidden">
                  <Image
                    src={project.image_url}
                    alt=""
                    fill
                    loading="lazy"
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 ease-apple group-hover:scale-[1.02]"
                  />
                </div>
              ) : null}

              <h3 className="font-display text-h2 font-medium">
                {project.url ? (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-start gap-1 transition-colors duration-200 ease-apple hover:text-accent-ink"
                  >
                    {project.title}
                    <ArrowUpRight size={18} weight="bold" aria-hidden="true" className="mt-1" />
                  </a>
                ) : (
                  project.title
                )}
              </h3>

              {project.description ? (
                <p className="mt-2 max-w-prose text-body text-pretty text-muted-foreground">
                  {project.description}
                </p>
              ) : null}

              <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-border pt-3 font-mono text-meta text-muted-foreground uppercase">
                {project.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
                {project.repo_url ? (
                  <a
                    href={project.repo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto transition-colors duration-200 ease-apple hover:text-accent-ink"
                  >
                    Source
                  </a>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}
