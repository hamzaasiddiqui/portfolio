import type { Metadata } from "next";
import { getProfile } from "@/lib/queries/profile";
import { getSkills } from "@/lib/queries/skills";
import { getProcessSteps } from "@/lib/queries/process-steps";
import { getExperiences } from "@/lib/queries/experiences";
import { getProjects } from "@/lib/queries/projects";
import { getSocialLinks } from "@/lib/queries/social-links";
import { Sidebar } from "@/components/layout/sidebar";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { SocialLinks } from "@/components/layout/social-links";
import { Footer, Copyright } from "@/components/layout/footer";
import { AboutSection } from "@/components/sections/about-section";
import { SkillsSection } from "@/components/sections/skills-section";
import { ProcessSection } from "@/components/sections/process-section";
import { ExperienceSection } from "@/components/sections/experience-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import { ConnectSection } from "@/components/sections/connect-section";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();

  return {
    title: profile.seo_title ?? profile.name,
    description: profile.seo_description ?? profile.tagline ?? undefined,
    openGraph: {
      title: profile.seo_title ?? profile.name,
      description: profile.seo_description ?? profile.tagline ?? undefined,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: profile.seo_title ?? profile.name,
      description: profile.seo_description ?? profile.tagline ?? undefined,
    },
  };
}

export default async function Home() {
  // Every read is independent of the others — fire them together so they
  // resolve in parallel instead of a request waterfall.
  const [profile, skills, processSteps, experiences, projects, socialLinks] = await Promise.all([
    getProfile(),
    getSkills(),
    getProcessSteps(),
    getExperiences(),
    getProjects(),
    getSocialLinks(),
  ]);

  return (
    <div className="relative min-h-full">
      <Sidebar name={profile.name} resumeUrl={profile.resume_url}>
        <SidebarNav />
      </Sidebar>

      <div
        className="pointer-events-none fixed inset-x-0 top-0 z-(--z-content) flex justify-end p-6"
        style={{ paddingLeft: "calc(var(--sidebar-offset) + 1.5rem)" }}
      >
        <div className="pointer-events-auto">
          <SocialLinks links={socialLinks} />
        </div>
      </div>

      <main
        id="main-content"
        className="relative z-(--z-content)"
        style={{ paddingLeft: "var(--sidebar-offset)" }}
      >
        <AboutSection profile={profile} />
        <SkillsSection skills={skills} />
        <ProcessSection steps={processSteps} />
        <ExperienceSection experiences={experiences} />
        <ProjectsSection projects={projects} />
        <ConnectSection socialLinks={socialLinks} />
      </main>

      <Footer />
      <Copyright />
    </div>
  );
}
