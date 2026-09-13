"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useActiveSection } from "@/components/active-section-provider";

// ssr: false keeps three, R3F and drei out of the server render *and* out of
// the initial bundle — the chunk is only fetched once the gate below opens.
const FigureCanvas = dynamic(
  () => import("@/components/three/figure-canvas").then((m) => m.FigureCanvas),
  { ssr: false }
);

const DESKTOP = "(min-width: 1024px) and (pointer: fine)";

export function FigureLayer() {
  const { activeId } = useActiveSection();
  const [enabled, setEnabled] = useState(false);

  // Desktop only. Phones never download the 3D chunk at all.
  useEffect(() => {
    const query = window.matchMedia(DESKTOP);
    const sync = () => setEnabled(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  if (!enabled) return null;

  const present = activeId === "about";

  return (
    <div
      // Anchored to the content area, but starting 9rem *inside* the sidebar:
      // the figure tracks the text when the sidebar collapses (so it never
      // creeps over the words) while still spilling behind the glass panel.
      className="fixed top-0 right-0 bottom-0"
      style={{
        left: "calc(var(--sidebar-offset) - 9rem)",
        // Always above the sections (z-content + 1) so it can overlap the
        // type, and always below the sidebar (z-sidebar) and the top bar
        // (z-overlay) so those stay clickable. The z-index does *not* drop
        // when it leaves: the body's background is opaque, so dropping behind
        // would cut the exit animation off mid-play. Once it has dissolved
        // the canvas is fully transparent and its frame loop has stopped, so
        // leaving it on top costs nothing.
        zIndex: "calc(var(--z-content) + 1)",
        pointerEvents: present ? "auto" : "none",
      }}
    >
      <FigureCanvas present={present} />
    </div>
  );
}
