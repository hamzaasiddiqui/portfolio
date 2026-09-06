import Image from "next/image";
import { Section } from "@/components/sections/section";
import { Eyebrow } from "@/components/sections/eyebrow";
import type { Tables } from "@/lib/supabase/database.types";

export function ProjectsSection({ projects }: { projects: Tables<"projects">[] }) {
  return (
    <Section id="projects" label="Projects">
      <Eyebrow>Projects</Eyebrow>
      <h2 className="text-h1 font-semibold text-balance text-foreground">Projects</h2>

      {projects.length === 0 ? (
        <p className="mt-8 text-body text-muted-foreground">Projects coming soon.</p>
      ) : (
        <ul className="mt-10 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2">
          {projects.map((project) => (
            <li key={project.id} className="flex flex-col">
              {project.image_url ? (
                <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-2xl border border-border">
                  <Image
                    src={project.image_url}
                    alt=""
                    fill
                    loading="lazy"
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              ) : null}
              <h3 className="text-h3 font-semibold text-foreground">
                {project.url ? (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-accent-readable focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    {project.title}
                  </a>
                ) : (
                  project.title
                )}
              </h3>
              {project.description ? (
                <p className="mt-2 text-body text-muted-foreground text-pretty">{project.description}</p>
              ) : null}
              {project.tags.length > 0 ? (
                <ul className="mt-3 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full border border-border px-3 py-1 font-mono text-meta text-muted-foreground uppercase"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              ) : null}
              {project.repo_url ? (
                <a
                  href={project.repo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 font-mono text-meta text-accent-readable hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  View Source
                </a>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}
