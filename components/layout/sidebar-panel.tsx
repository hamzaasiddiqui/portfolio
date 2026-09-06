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
      style={{ width: "var(--sidebar-offset)" }}
      className={cn(
        "fixed inset-y-0 left-0 z-(--z-sidebar) m-(--gutter) flex flex-col overflow-hidden rounded-2xl",
        // Glass: the panel is the page ground at 62% opacity with a blur
        // behind it and a single hairline edge. No shadow, no sheen, no fill
        // of its own.
        "border border-border bg-sidebar backdrop-blur-xl",
        "transition-[width] duration-300 ease-apple"
      )}
    >
      <div className={cn("@container flex min-w-0 flex-col gap-5 px-5 pt-7", isCollapsed && "items-center px-0")}>
        {/* Sized in container units, not viewport units: the name must stay
            on one line, and what it has to fit inside is the sidebar's
            width, which does not track the viewport 1:1 (it is clamped).
            The min() cap keeps it from ballooning on a wide panel. */}
        <span
          className={cn(
            "font-display font-medium tracking-[-0.04em] whitespace-nowrap text-foreground",
            isCollapsed ? "text-[1.1rem]" : "text-[min(1.45rem,11.4cqi)] leading-none"
          )}
        >
          {isCollapsed ? initials(name) : name}
        </span>
        <div className="h-px w-full bg-border" />
      </div>

      <div className={cn("min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-5 pt-12", isCollapsed && "px-2")}>
        {children}
      </div>

      <div className={cn("flex min-w-0 flex-col gap-4 px-5 pb-6", isCollapsed && "items-center px-2")}>
        <div className="h-px w-full bg-border" />
        <div className={cn("flex items-center", isCollapsed ? "flex-col gap-2" : "justify-between gap-3")}>
          <ThemeToggle />
          <ResumeButton resumeUrl={resumeUrl} />
          <CollapseButton />
        </div>
      </div>
    </aside>
  );
}
