"use client";

import { useEffect, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/layout/sidebar-context";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { ResumeButton } from "@/components/layout/resume-button";
import { CollapseButton } from "@/components/layout/collapse-button";

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

  // Keeps --sidebar-offset (read by main content padding and the fixed
  // copyright line) in sync with the aside's own width, so collapsing the
  // sidebar doesn't leave a stale gap behind it.
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--sidebar-offset",
      isCollapsed ? "var(--sidebar-width-collapsed)" : "var(--sidebar-width)"
    );
  }, [isCollapsed]);

  return (
    <aside
      style={{ width: isCollapsed ? "var(--sidebar-width-collapsed)" : "var(--sidebar-width)" }}
      className={cn(
        "fixed inset-y-0 left-0 z-(--z-sidebar) m-4 flex flex-col overflow-hidden rounded-3xl sm:m-6",
        "border border-sidebar-border bg-sidebar shadow-2xl shadow-black/10 backdrop-blur-xl dark:shadow-black/40",
        "transition-[width] duration-300 ease-apple"
      )}
    >
      <div className={cn("flex min-w-0 flex-col gap-6 px-6 pt-8", isCollapsed && "px-0 text-center")}>
        <span className="truncate font-sans text-h3 font-semibold text-accent-readable">
          {isCollapsed ? name.charAt(0) : name}
        </span>
        <div className="h-px w-full bg-sidebar-border" />
      </div>

      <div
        className={cn(
          "flex min-w-0 flex-1 flex-col justify-center overflow-x-hidden overflow-y-auto px-4 py-6",
          isCollapsed && "items-center px-0"
        )}
      >
        {children}
      </div>

      <div className={cn("flex min-w-0 flex-col gap-4 px-6 pb-6", isCollapsed && "items-center px-3")}>
        <div className="h-px w-full bg-sidebar-border" />
        <div className={cn("flex items-center gap-3", isCollapsed ? "flex-col" : "justify-between")}>
          <ThemeToggle />
          <ResumeButton resumeUrl={resumeUrl} />
          <CollapseButton />
        </div>
      </div>
    </aside>
  );
}
