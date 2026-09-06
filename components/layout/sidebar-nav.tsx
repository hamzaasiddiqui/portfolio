"use client";

import { motion, useReducedMotion } from "motion/react";
import { UserCircle } from "@phosphor-icons/react/dist/csr/UserCircle";
import { Wrench } from "@phosphor-icons/react/dist/csr/Wrench";
import { GitBranch } from "@phosphor-icons/react/dist/csr/GitBranch";
import { Briefcase } from "@phosphor-icons/react/dist/csr/Briefcase";
import { FolderOpen } from "@phosphor-icons/react/dist/csr/FolderOpen";
import { EnvelopeOpen } from "@phosphor-icons/react/dist/csr/EnvelopeOpen";
import { cn } from "@/lib/utils";
import { NAV_ITEMS, type NavItem } from "@/components/layout/nav-items";
import { useSidebar } from "@/components/layout/sidebar-context";
import { useActiveSection } from "@/components/active-section-provider";

const ICONS: Record<NavItem["icon"], typeof UserCircle> = {
  "user-circle": UserCircle,
  wrench: Wrench,
  "git-branch": GitBranch,
  briefcase: Briefcase,
  "folder-open": FolderOpen,
  "envelope-open": EnvelopeOpen,
};

export function SidebarNav() {
  const { isCollapsed } = useSidebar();
  const { activeId } = useActiveSection();
  const shouldReduceMotion = useReducedMotion();

  return (
    <nav aria-label="Section navigation" className="w-full">
      <ul className="flex flex-col">
        {NAV_ITEMS.map((item, index) => {
          const id = item.href.slice(1);
          const isActive = id === activeId;
          const Icon = ICONS[item.icon];

          return (
            <li key={item.href} className="relative">
              {/* The active marker is a hairline, not a filled pill — it
                  slides between items via a shared layoutId. */}
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
                  "flex items-center gap-3 py-2.5 font-mono text-meta uppercase transition-colors duration-200 ease-apple",
                  isCollapsed ? "justify-center" : "pl-4",
                  isActive ? "text-accent" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {/* Wireframe rule: text when expanded, icons when collapsed —
                    one or the other, never both crammed into a 4rem rail. */}
                {isCollapsed ? (
                  <Icon size={16} aria-hidden="true" />
                ) : (
                  <span className="tabular-nums opacity-45">{String(index + 1).padStart(2, "0")}</span>
                )}
                <span className={isCollapsed ? "sr-only" : ""}>{item.label}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
