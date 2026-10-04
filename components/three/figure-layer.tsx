"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useActiveSection } from "@/components/active-section-provider";

const FigureCanvas = dynamic(
  () => import("@/components/three/figure-canvas").then((m) => m.FigureCanvas),
  { ssr: false }
);

const DESKTOP = "(min-width: 1024px) and (pointer: fine)";

export function FigureLayer() {
  const { activeId } = useActiveSection();
  const [enabled, setEnabled] = useState(false);

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
      className="fixed top-0 right-0 bottom-0"
      style={{
        left: "calc(var(--sidebar-offset) - 9rem)",
        zIndex: "var(--z-figure)",
        pointerEvents: present ? "auto" : "none",
      }}
    >
      <FigureCanvas present={present} />
    </div>
  );
}
