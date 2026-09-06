"use client";

import { DownloadSimple } from "@phosphor-icons/react/dist/csr/DownloadSimple";
import { useSidebar } from "@/components/layout/sidebar-context";

export function ResumeButton({ resumeUrl }: { resumeUrl: string | null }) {
  const { isCollapsed } = useSidebar();

  // Explicit wireframe requirement: hidden entirely when collapsed, not
  // just visually — a collapsed rail has no room for it.
  if (isCollapsed || !resumeUrl) return null;

  return (
    <a
      href={resumeUrl}
      download
      className="inline-flex h-7 items-center gap-1.5 rounded-full bg-foreground px-3 font-sans text-xs font-medium text-background shadow-sm transition-transform hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar active:scale-[0.98]"
    >
      <DownloadSimple size={13} weight="bold" aria-hidden="true" />
      Resume
    </a>
  );
}
