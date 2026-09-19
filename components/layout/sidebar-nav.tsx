"use client";

import { motion, useReducedMotion } from "motion/react";
import { UserCircle } from "@phosphor-icons/react/dist/csr/UserCircle";
import { Wrench } from "@phosphor-icons/react/dist/csr/Wrench";
import { GitBranch } from "@phosphor-icons/react/dist/csr/GitBranch";
import { Briefcase } from "@phosphor-icons/react/dist/csr/Briefcase";
import { GraduationCap } from "@phosphor-icons/react/dist/csr/GraduationCap";
import { FolderOpen } from "@phosphor-icons/react/dist/csr/FolderOpen";
import { EnvelopeOpen } from "@phosphor-icons/react/dist/csr/EnvelopeOpen";
import { cn } from "@/lib/utils";
import { type NavItem } from "@/components/layout/nav-items";
import { useSidebar } from "@/components/layout/sidebar-context";
import { useActiveSection } from "@/components/active-section-provider";
import { useIntro } from "@/components/motion/intro-context";

const ICONS: Record<NavItem["icon"], typeof UserCircle> = {
  "user-circle": UserCircle,
  wrench: Wrench,
  "git-branch": GitBranch,
  briefcase: Briefcase,
  "graduation-cap": GraduationCap,
  "folder-open": FolderOpen,
  "envelope-open": EnvelopeOpen,
};

export function SidebarNav({ items }: { items: NavItem[] }) {
  const { isCollapsed } = useSidebar();
  const { activeId } = useActiveSection();
  const { introDone } = useIntro();
  const shouldReduceMotion = useReducedMotion();

  return (
    <nav aria-label="Section navigation" className="w-full">
      {/* A scrollable strip of labels on small screens, a column from lg up. */}
      <ul className="flex flex-row items-center gap-4 lg:flex-col lg:items-stretch lg:gap-0">
        {items.map((item, index) => {
          const id = item.href.slice(1);
          const isActive = id === activeId;
          const Icon = ICONS[item.icon];

          return (
            // Items fall into place one after another once the panel has
            // arrived (see SidebarPanel's own entrance delay).
            <motion.li
              key={item.href}
              className="relative"
              initial={{ opacity: 0, x: -10 }}
              animate={introDone ? { opacity: 1, x: 0 } : undefined}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.55 + index * 0.06 }}
            >
              {/* The active marker is a hairline, not a filled pill — it
                  slides between items via a shared layoutId. */}
              {isActive ? (
                <motion.span
                  layoutId="nav-active-marker"
                  aria-hidden="true"
                  className="absolute bottom-0 left-0 h-px w-full bg-accent lg:top-1/2 lg:bottom-auto lg:h-4 lg:w-px lg:-translate-y-1/2"
                  transition={
                    shouldReduceMotion ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 36 }
                  }
                />
              ) : null}

              <a
                href={item.href}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "flex items-center gap-3.5 py-3 font-label text-meta whitespace-nowrap uppercase transition-colors duration-200 ease-apple",
                  isCollapsed ? "lg:justify-center" : "lg:pl-4",
                  isActive ? "text-accent" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {/* Wireframe rule, desktop only: text when expanded, icons when
                    collapsed. The mobile bar is always labels — a 4rem rail's
                    constraint does not apply to a full-width strip. */}
                <Icon size={16} aria-hidden="true" className={cn("hidden", isCollapsed && "lg:block")} />
                <span
                  className={cn("hidden tabular-nums opacity-45", !isCollapsed && "lg:inline")}
                  aria-hidden="true"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className={isCollapsed ? "lg:sr-only" : ""}>{item.label}</span>
              </a>
            </motion.li>
          );
        })}
      </ul>
    </nav>
  );
}
