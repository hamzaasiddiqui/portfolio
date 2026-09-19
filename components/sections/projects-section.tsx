import { Section, SectionLabel } from "@/components/sections/section";
import { ProjectCard } from "@/components/sections/project-card";
import type { Tables } from "@/lib/supabase/database.types";

export function ProjectsSection({ projects }: { projects: Tables<"projects">[] }) {
  return (
    <Section id="projects" label="Projects">
      <SectionLabel>Projects</SectionLabel>

      {projects.length === 0 ? (
        <p className="text-body text-muted-foreground">Projects coming soon.</p>
      ) : (
        <ul className="flex flex-col">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </ul>
      )}
    </Section>
  );
}
