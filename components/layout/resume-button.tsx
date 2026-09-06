"use client";

import { ArrowDown } from "@phosphor-icons/react/dist/csr/ArrowDown";
import { useSidebar } from "@/components/layout/sidebar-context";
import { META_LINK } from "@/components/layout/control-styles";

export function ResumeButton({ resumeUrl }: { resumeUrl: string | null }) {
  const { isCollapsed } = useSidebar();

  // Explicit wireframe requirement: absent when collapsed, not merely
  // hidden — a 4rem rail has no room for a text label.
  if (isCollapsed || !resumeUrl) return null;

  return (
    <a href={resumeUrl} download className={`${META_LINK} inline-flex items-center gap-1.5`}>
      Resume
      <ArrowDown size={11} weight="bold" aria-hidden="true" />
    </a>
  );
}
