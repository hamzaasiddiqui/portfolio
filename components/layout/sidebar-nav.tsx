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
      <ul className="flex flex-col items-stretch">
        {items.map((item, index) => {
          const id = item.href.slice(1);
          const isActive = id === activeId;
          const Icon = ICONS[item.icon];

          return (
            <motion.li
              key={item.href}
              className="relative"
              initial={{ opacity: 0, x: -10 }}
              animate={introDone ? { opacity: 1, x: 0 } : undefined}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.55 + index * 0.06 }}
            >
              {isActive ? (
                <motion.span
                  layoutId="nav-active-marker"
                  aria-hidden="true"
                  className="absolute top-1/2 left-0 h-4 w-px -translate-y-1/2 bg-accent"
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
                  isCollapsed ? "justify-center" : "pl-4",
                  isActive ? "text-accent" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {isCollapsed ? <Icon size={16} aria-hidden="true" /> : null}
                {!isCollapsed ? (
                  <span className="tabular-nums opacity-45" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                ) : null}
                <span className={isCollapsed ? "sr-only" : ""}>{item.label}</span>
              </a>
            </motion.li>
          );
        })}
      </ul>
    </nav>
  );
}
