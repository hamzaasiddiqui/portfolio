import type { Metadata } from "next";
import { getProfile } from "@/lib/queries/profile";
import { getSkills } from "@/lib/queries/skills";
import { getProcessSteps } from "@/lib/queries/process-steps";
import { getExperiences } from "@/lib/queries/experiences";
import { getEducation } from "@/lib/queries/education";
import { getProjects } from "@/lib/queries/projects";
import { getSocialLinks } from "@/lib/queries/social-links";
import { ActiveSectionProvider } from "@/components/active-section-provider";
import { NAV_ITEMS } from "@/components/layout/nav-items";
import { Sidebar } from "@/components/layout/sidebar";
import { SocialLinks } from "@/components/layout/social-links";
import { SectionIndicator } from "@/components/layout/section-indicator";
import { Copyright } from "@/components/layout/footer";
import { ModelCredit } from "@/components/layout/credit";
import { FigureLayer } from "@/components/three/figure-layer";
import { IntroLoader } from "@/components/motion/intro-loader";
import { IntroReveal } from "@/components/motion/intro-reveal";
import { AboutSection } from "@/components/sections/about-section";
import { SkillsSection } from "@/components/sections/skills-section";
import { ProcessSection } from "@/components/sections/process-section";
import { ExperienceSection } from "@/components/sections/experience-section";
import { EducationSection } from "@/components/sections/education-section";
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
  const [profile, skills, processSteps, experiences, education, projects, socialLinks] =
    await Promise.all([
      getProfile(),
      getSkills(),
      getProcessSteps(),
      getExperiences(),
      getEducation(),
      getProjects(),
      getSocialLinks(),
    ]);

  const populated: Record<string, boolean> = {
    about: true,
    skills: skills.length > 0,
    process: processSteps.length > 0,
    experience: experiences.length > 0,
    education: education.length > 0,
    projects: projects.length > 0,
    connect: true,
  };

  const navItems = NAV_ITEMS.filter((item) => populated[item.href.slice(1)]);

  return (
    <ActiveSectionProvider items={navItems}>
      <IntroLoader name={profile.name} />
      <div className="relative min-h-full">
        <FigureLayer />

        <Sidebar name={profile.name} resumeUrl={profile.resume_url} navItems={navItems} />

        <div
          className="pointer-events-none fixed inset-x-0 top-0 z-(--z-overlay) flex items-start justify-end gap-6 p-(--gutter)"
          style={{ paddingLeft: "calc(var(--sidebar-offset) + var(--gutter))" }}
        >
          <IntroReveal delay={0.5} className="pointer-events-auto hidden lg:block">
            <SectionIndicator />
          </IntroReveal>
          <IntroReveal delay={0.6} className="pointer-events-auto hidden lg:block">
            <SocialLinks links={socialLinks} />
          </IntroReveal>
        </div>

        <main
          id="main-content"
          className="relative z-(--z-content)"
          style={{ paddingLeft: "calc(var(--sidebar-offset) + var(--gutter))" }}
        >
          <AboutSection profile={profile} />
          {populated.skills ? <SkillsSection skills={skills} /> : null}
          {populated.process ? <ProcessSection steps={processSteps} /> : null}
          {populated.experience ? <ExperienceSection experiences={experiences} /> : null}
          {populated.projects ? <ProjectsSection projects={projects} /> : null}
          {populated.education ? <EducationSection education={education} /> : null}
          <ConnectSection
            socialLinks={socialLinks}
            avatarUrl={profile.avatar_url}
            name={profile.name}
          />
        </main>

        <Copyright />
      </div>
    </ActiveSectionProvider>
  );
}
