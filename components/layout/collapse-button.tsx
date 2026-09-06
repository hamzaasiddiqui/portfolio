"use client";

import { ArrowLineLeft } from "@phosphor-icons/react/dist/csr/ArrowLineLeft";
import { ArrowLineRight } from "@phosphor-icons/react/dist/csr/ArrowLineRight";
import { useSidebar } from "@/components/layout/sidebar-context";
import { ICON_BUTTON } from "@/components/layout/control-styles";

export function CollapseButton() {
  const { isCollapsed, toggleCollapsed } = useSidebar();

  return (
    <button
      type="button"
      onClick={toggleCollapsed}
      aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      aria-expanded={!isCollapsed}
      className={ICON_BUTTON}
    >
      {isCollapsed ? <ArrowLineRight size={15} /> : <ArrowLineLeft size={15} />}
    </button>
  );
}
