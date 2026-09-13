"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/layout/sidebar-context";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { ResumeButton } from "@/components/layout/resume-button";
import { CollapseButton } from "@/components/layout/collapse-button";

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
  children,
}: {
  name: string;
  resumeUrl: string | null;
  children: ReactNode;
}) {
  const { isCollapsed } = useSidebar();

  return (
    // Width tracks --sidebar-offset directly (see globals.css) rather than a
    // local isCollapsed ternary — the provider is the single source of truth
    // for that variable, so content padding can never drift out of sync.
    <aside
      className={cn(
        // Two layouts, one element: a top bar on small screens (leaving the
        // top-right corner free for the social cluster), a column from lg up.
        "fixed z-(--z-sidebar) m-(--gutter) flex overflow-hidden rounded-2xl",
        "inset-x-0 top-0 mr-14 flex-row items-center gap-4 px-4 py-2",
        "lg:inset-y-0 lg:left-0 lg:mr-(--gutter) lg:w-(--sidebar-offset) lg:flex-col lg:items-stretch lg:gap-0 lg:px-0 lg:py-0",
        // Glass: the panel is the page ground at 62% opacity with a blur
        // behind it and a single hairline edge. No shadow, no sheen, no fill
        // of its own.
        "border border-border bg-sidebar backdrop-blur-xl",
        "transition-[width] duration-300 ease-apple"
      )}
    >
      <div
        className={cn(
          // @container only from lg: container-type establishes size
          // containment, which would collapse this box to nothing inside the
          // mobile bar's flex row.
          "flex min-w-0 shrink-0 flex-col gap-0 lg:@container lg:gap-5 lg:px-5 lg:pt-7",
          isCollapsed && "lg:items-center lg:px-0"
        )}
      >
        {/* Sized in container units, not viewport units: the name must stay
            on one line, and what it has to fit inside is the sidebar's
            width, which does not track the viewport 1:1 (it is clamped).
            The min() cap keeps it from ballooning on a wide panel. */}
        <span
          className={cn(
            "font-display font-medium tracking-[-0.04em] whitespace-nowrap text-foreground",
            // Container units only make sense in the column layout, where the
            // panel's width is what the name has to fit inside. The bar sizes
            // it plainly.
            "text-[1.05rem] leading-none",
            isCollapsed ? "lg:text-[1.1rem]" : "lg:text-[min(1.45rem,11.4cqi)]"
          )}
        >
          {isCollapsed ? initials(name) : name}
        </span>
        <div className="hidden h-px w-full bg-border lg:block" />
      </div>

      <div
        className={cn(
          "min-w-0 flex-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:overflow-x-hidden lg:overflow-y-auto lg:px-5 lg:pt-12",
          isCollapsed && "lg:px-2"
        )}
      >
        {children}
      </div>

      <div
        className={cn(
          "flex min-w-0 shrink-0 flex-col gap-4 lg:px-5 lg:pb-6",
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
          {/* Resume and collapse are desktop-only: the bar has no room, and
              there is nothing to collapse. */}
          <span className="hidden lg:contents">
            <ResumeButton resumeUrl={resumeUrl} />
            <CollapseButton />
          </span>
        </div>
      </div>
    </aside>
  );
}
