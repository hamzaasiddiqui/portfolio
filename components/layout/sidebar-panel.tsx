"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/layout/sidebar-context";
import { useIntro } from "@/components/motion/intro-context";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { ResumeButton } from "@/components/layout/resume-button";
import { CollapseButton } from "@/components/layout/collapse-button";
import { PlasmaLayer } from "@/components/plasma/plasma-layer";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { type NavItem } from "@/components/layout/nav-items";

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("");
}

export function SidebarPanel({
  name,
  resumeUrl,
  navItems,
}: {
  name: string;
  resumeUrl: string | null;
  navItems: NavItem[];
}) {
  const { isCollapsed } = useSidebar();
  const { introDone } = useIntro();

  return (
    <motion.aside
      initial={{ opacity: 0, x: -24 }}
      animate={introDone ? { opacity: 1, x: 0 } : undefined}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      className={cn(
        "fixed z-(--z-sidebar) m-(--gutter) flex overflow-visible rounded-[26px] lg:overflow-hidden",
        "inset-x-0 top-0 flex-row items-center gap-4 px-4 py-2",
        "lg:inset-y-0 lg:left-0 lg:w-(--sidebar-offset) lg:flex-col lg:items-stretch lg:gap-0 lg:px-0 lg:py-0",
        "transition-[width] duration-300 ease-apple"
      )}
    >
      <PlasmaLayer fuse={false} className="-z-10" />

      <div
        className={cn(
          "flex min-w-0 shrink-0 flex-col gap-0 lg:@container lg:gap-5 lg:px-5 lg:pt-7",
          isCollapsed && "lg:items-center lg:px-0"
        )}
      >
        <span
          className={cn(
            "font-display font-medium tracking-[-0.04em] whitespace-nowrap text-foreground",
            "text-[1.05rem] leading-none",
            isCollapsed ? "lg:text-[1.1rem]" : "lg:text-[min(1.45rem,11.4cqi)]"
          )}
        >
          <span className="lg:hidden">{name}</span>
          <span className="hidden lg:inline">{isCollapsed ? initials(name) : name}</span>
        </span>
        <div className="hidden h-px w-full bg-border lg:block" />
      </div>

      <div
        className={cn(
          "hidden min-w-0 flex-1 lg:block lg:overflow-x-hidden lg:overflow-y-auto lg:px-5 lg:pt-12",
          isCollapsed && "lg:px-2"
        )}
      >
        <SidebarNav items={navItems} />
      </div>

      <div
        className={cn(
          "hidden min-w-0 shrink-0 flex-col gap-4 lg:flex lg:px-5 lg:pb-6",
          isCollapsed && "lg:items-center lg:px-2"
        )}
      >
        <div className="hidden h-px w-full bg-border lg:block" />
        <div
          className={cn(
            "flex items-center gap-3",
            isCollapsed ? "lg:flex-col lg:gap-2" : "lg:justify-between"
          )}
        >
          <ThemeToggle />
          <span className="hidden lg:contents">
            <ResumeButton resumeUrl={resumeUrl} />
            <CollapseButton />
          </span>
        </div>
      </div>

      <MobileMenu items={navItems} resumeUrl={resumeUrl} />
    </motion.aside>
  );
}
