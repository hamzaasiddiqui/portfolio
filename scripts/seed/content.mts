/**
 * The entire public content of the site, in one file.
 *
 * This is the source of copy — not the migrations. Schema history describes
 * the *shape* of content; changing a sentence shouldn't append to it. Run
 * `pnpm seed` to make the database match this file.
 *
 * Conventions
 * - Prose fields support inline markdown links: `[label](https://example.com)`.
 *   The app renders those as new-tab anchors. Plain text passes through
 *   untouched, so there is no escaping burden on copy that has no links.
 * - `display_order` is explicit everywhere and globally sequential within a
 *   table, including across skill categories: categories render in the order
 *   their first member appears.
 * - `icon_slug` on a skill is a Simple Icons slug (https://simpleicons.org).
 */
import type { TablesInsert } from "@/lib/supabase/database.types";

const GIKI = "https://giki.edu.pk/";

export const PROFILE: TablesInsert<"profile"> = {
  id: true,
  name: "Hamza Siddiqui",
  tagline: "Software Engineer",
  about_text: [
    `I am a software engineer with expertise in crafting complex data-intensive web applications. I hold a BSc in Computer Engineering from [GIKI](${GIKI}). I care about the details many miss, and I take real pride in shipping products that are thoughtful and genuinely useful, not just functional.`,
    `I work across the full stack, and I especially enjoy building AI-powered applications and automations, though that's more of a strong interest than my whole identity. Scalability, clean schema design, and readable code matter a lot to me, as does good product design.`,
    `Right now I'm a Software Engineer at [TreeTraction](https://treetraction.com/), where I work on AI-powered automations, data pipelines, and their CRM, supporting the US direct-mail marketing industry. Before this, I was at [Devsinc](https://devsinc.com/).`,
  ].join("\n\n"),
  resume_url: "/hsiddiqui-resume.pdf",
  avatar_url: "/images/portrait.jpg",
  seo_title: "Hamza Siddiqui — Software Engineer",
  seo_description:
    "Software engineer building data-intensive web applications, AI-powered automations, and the data pipelines behind them.",
};

export const SOCIAL_LINKS: TablesInsert<"social_links">[] = [
  { platform: "LinkedIn", url: "https://www.linkedin.com/in/-hamza-siddiqui/", icon_name: "linkedin-logo", display_order: 0 },
  { platform: "GitHub", url: "https://github.com/hamzaasiddiqui", icon_name: "github-logo", display_order: 1 },
  { platform: "Email", url: "mailto:hamza.eins@gmail.com", icon_name: "envelope-simple", display_order: 2 },
];

/**
 * Categories are emitted in the order their first member appears, so the
 * sequence of `display_order` below fixes both the group order and the order
 * inside each group. Keep it contiguous when editing.
 */
export const SKILLS: TablesInsert<"skills">[] = [
  // Languages
  { name: "JavaScript", category: "Languages", icon_slug: "javascript", display_order: 0 },
  { name: "TypeScript", category: "Languages", icon_slug: "typescript", display_order: 1 },
  { name: "C", category: "Languages", icon_slug: "c", display_order: 2 },
  { name: "C++", category: "Languages", icon_slug: "cplusplus", display_order: 3 },
  { name: "Python", category: "Languages", icon_slug: "python", display_order: 4 },
  { name: "Go", category: "Languages", icon_slug: "go", display_order: 5 },

  // Frameworks & Runtimes
  { name: "React", category: "Frameworks & Runtimes", icon_slug: "react", display_order: 6 },
  { name: "Next.js", category: "Frameworks & Runtimes", icon_slug: "nextdotjs", display_order: 7 },
  { name: "Angular", category: "Frameworks & Runtimes", icon_slug: "angular", display_order: 8 },
  { name: "Node.js", category: "Frameworks & Runtimes", icon_slug: "nodedotjs", display_order: 9 },
  { name: "Express", category: "Frameworks & Runtimes", icon_slug: "express", display_order: 10 },
  { name: "NestJS", category: "Frameworks & Runtimes", icon_slug: "nestjs", display_order: 11 },
  { name: "Flask", category: "Frameworks & Runtimes", icon_slug: "flask", display_order: 12 },
  { name: "FastAPI", category: "Frameworks & Runtimes", icon_slug: "fastapi", display_order: 13 },
  { name: "React Native", category: "Frameworks & Runtimes", icon_slug: "react", display_order: 14 },
  { name: "Electron", category: "Frameworks & Runtimes", icon_slug: "electron", display_order: 15 },

  // Data
  { name: "PostgreSQL", category: "Data", icon_slug: "postgresql", display_order: 16 },
  { name: "MySQL", category: "Data", icon_slug: "mysql", display_order: 17 },
  { name: "MongoDB", category: "Data", icon_slug: "mongodb", display_order: 18 },
  { name: "Supabase", category: "Data", icon_slug: "supabase", display_order: 19 },
  { name: "Firebase", category: "Data", icon_slug: "firebase", display_order: 20 },
  { name: "GraphQL", category: "Data", icon_slug: "graphql", display_order: 21 },

  // Cloud & AI
  // `amazonwebservices` and `openai` are not in Simple Icons (both brands
  // withdrew permission). The slugs stay canonical and the app's icon map
  // supplies those two marks locally — see lib/icons.
  { name: "AWS", category: "Cloud & AI", icon_slug: "amazonwebservices", display_order: 22 },
  { name: "Google Cloud", category: "Cloud & AI", icon_slug: "googlecloud", display_order: 23 },
  { name: "Vercel", category: "Cloud & AI", icon_slug: "vercel", display_order: 24 },
  { name: "OpenAI", category: "Cloud & AI", icon_slug: "openai", display_order: 25 },
  { name: "LangChain", category: "Cloud & AI", icon_slug: "langchain", display_order: 26 },

  // Tooling & Infrastructure
  { name: "Git", category: "Tooling & Infrastructure", icon_slug: "git", display_order: 27 },
  { name: "GitHub Actions", category: "Tooling & Infrastructure", icon_slug: "githubactions", display_order: 28 },
  { name: "Docker", category: "Tooling & Infrastructure", icon_slug: "docker", display_order: 29 },
  { name: "Kubernetes", category: "Tooling & Infrastructure", icon_slug: "kubernetes", display_order: 30 },
  { name: "Linux", category: "Tooling & Infrastructure", icon_slug: "linux", display_order: 31 },
  { name: "Terraform", category: "Tooling & Infrastructure", icon_slug: "terraform", display_order: 32 },
];

export const EXPERIENCES: TablesInsert<"experiences">[] = [
  {
    company: "TreeTraction",
    company_url: "https://treetraction.com/",
    role: "Software Engineer",
    location: null,
    start_date: "2026-06-01",
    end_date: null,
    is_current: true,
    display_order: 0,
    highlights: [
      "Build and maintain the core web application powering TreeTraction's platform for the US direct-mail industry, working across the full stack from schema design to UI.",
      "Shipped an automated campaign creation feature, cutting campaign setup time by 70% and eliminating a major manual bottleneck for the operations team.",
      "Integrated the OpenAI API to build an AI-powered summarization feature, reducing time spent reviewing campaign data by over 80%.",
      "Integrated Stripe and built out the platform's ledger system, enabling reliable payment processing and accurate financial tracking across thousands of transactions.",
    ],
  },
  {
    company: "Devsinc",
    company_url: "https://devsinc.com/",
    role: "Software Engineer",
    location: null,
    start_date: "2025-03-01",
    end_date: "2026-06-01",
    is_current: false,
    display_order: 1,
    highlights: [
      "Led a cross-functional team of 4 engineers to deliver a dual-platform ecosystem (web and native mobile) for a high-growth US-based client.",
      "Architected a scalable backend using Supabase and AWS, implementing advanced SQL logic and Deno-powered Edge Functions to handle complex, data-intensive operations.",
      "Standardized CI/CD workflows and AWS deployment strategies, ensuring seamless delivery cycles and 99.9% uptime for production environments.",
      "Served as the primary technical liaison for the client, translating high-level business requirements into scalable architectural decisions.",
      "Owned the full-cycle talent pipeline, from conducting rigorous technical interviews to designing and running training programs that accelerated the onboarding of junior engineers.",
    ],
  },
  {
    company: "Orbit-Ed",
    company_url: "https://www.orbit-ed.com/",
    role: "Software Engineer",
    location: null,
    start_date: "2024-06-01",
    end_date: "2025-03-01",
    is_current: false,
    display_order: 2,
    highlights: [
      "Architected, designed, and developed Orbit-Ed's Learning Management System and Content Management System for VR-based enterprise training and AI-powered analytics using the MERN stack.",
      "Designed and implemented over 100 RESTful API endpoints to connect the VR application, server-side AI models, and web applications, boosting data processing efficiency by 25%.",
      "Optimized UI/UX and frontend performance for the LMS and CMS using React and Next.js, achieving a 15% reduction in page load times and improving user engagement.",
      "Developed AI-powered 3D web applications using Three.js and React Three Fiber, creating interactive and high-performance 3D experiences.",
      "Authored database migration scripts to streamline system updates and ensure data integrity during transitions.",
      "Collaborated with product, design, and QA to deliver high-quality software on a regular release cadence.",
    ],
  },
];

export const EDUCATION: TablesInsert<"education">[] = [
  {
    institution: "Ghulam Ishaq Khan Institute of Engineering Sciences and Technology",
    institution_url: GIKI,
    degree: "Bachelor of Science in Computer Engineering",
    graduation_year: 2024,
    honors: ["Dean's Honor Roll"],
    activities: [
      "Network Administrator at [Netronix](https://www.netronixgiki.com/)",
      "Member of Team Infinity",
    ],
    image_url: "/images/giki.jpg",
    display_order: 0,
  },
];

/**
 * `url` is null on every project: these are source-only, with no deployment to
 * point at. `image_url` points at a landing-page render under
 * public/images/projects — each one a mock of what the project's own site
 * would look like, since none of them has a deployment to screenshot.
 *
 * `tags` are deliberately empty rather than guessed; they render as the card's
 * tech strip and wrong stacks are worse than none.
 */
export const PROJECTS: TablesInsert<"projects">[] = [
  {
    title: "NLP Powered Business Intelligence",
    description:
      "Ask a database questions in plain English and get answers back — a natural-language layer that translates prompts into SQL and renders the result as a chart.",
    url: null,
    repo_url: "https://github.com/hamzaasiddiqui/NLP-Powered-BI",
    image_url: "/images/projects/nlp-powered-bi.jpg",
    tags: [],
    featured: true,
    display_order: 0,
  },
  {
    title: "STT Web Implementation",
    description:
      "A browser-native speech-to-text playground that streams microphone audio to a transcription model and prints the transcript as you speak.",
    url: null,
    repo_url: "https://github.com/hamzaasiddiqui/speech-to-text-web",
    image_url: "/images/projects/stt-web.jpg",
    tags: [],
    featured: false,
    display_order: 1,
  },
  {
    title: "H.E.L.I.X — IoT Control AI Assistant",
    description:
      "A voice-driven assistant that turns spoken commands into device actions, wiring a language model up to a real IoT control layer.",
    url: null,
    repo_url: "https://github.com/hamzaasiddiqui/H.E.L.I.X._AIProj",
    image_url: "/images/projects/helix.jpg",
    tags: [],
    featured: true,
    display_order: 2,
  },
  {
    title: "Staff Appointment System",
    description:
      "A scheduling platform for an academic department: students book time with faculty, and the system generates conflict-free timetables around them.",
    url: null,
    repo_url: "https://github.com/hamzaasiddiqui/timetable-and-teacher-appointment-system",
    image_url: "/images/projects/staff-appointments.jpg",
    tags: [],
    featured: false,
    display_order: 3,
  },
  {
    title: "Gate Access Control System",
    description:
      "A campus gate access system for GIK Institute that verifies arrivals against a central register and keeps a live log of every entry and exit.",
    url: null,
    repo_url: "https://github.com/hamzaasiddiqui/new-gate-system-gik",
    image_url: "/images/projects/gate-access.jpg",
    tags: [],
    featured: false,
    display_order: 4,
  },
];
