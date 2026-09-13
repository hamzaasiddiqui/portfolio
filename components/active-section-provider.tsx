"use client";

import { createContext, use, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { type NavItem } from "@/components/layout/nav-items";

interface ActiveSectionContextValue {
  activeId: string;
  activeLabel: string;
}

const ActiveSectionContext = createContext<ActiveSectionContextValue>({
  activeId: "",
  activeLabel: "",
});

export function ActiveSectionProvider({
  items,
  children,
}: {
  items: NavItem[];
  children: ReactNode;
}) {
  const sectionIds = useMemo(() => items.map((item) => item.href.slice(1)), [items]);
  const [activeId, setActiveId] = useState(sectionIds[0] ?? "");
  // Tracks each section's intersection ratio so we can pick the most-visible
  // one on every observer callback, rather than reacting to whichever
  // section's entry happened to fire last.
  const ratios = useRef(new Map<string, number>());

  useEffect(() => {
    const elements = sectionIds.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null
    );
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.current.set(entry.target.id, entry.intersectionRatio);
        }

        let bestId = sectionIds[0];
        let bestRatio = 0;
        for (const id of sectionIds) {
          const ratio = ratios.current.get(id) ?? 0;
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        }

        if (bestRatio > 0) {
          setActiveId((current) => (current === bestId ? current : bestId));
        }
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, [sectionIds]);

  useEffect(() => {
    // replaceState (not pushState/location.hash) — reflects the section in
    // the URL for deep-linking without adding a history entry per section
    // scrolled past, and without triggering the browser's own
    // scroll-into-view behavior that setting location.hash would cause.
    if (!activeId) return;
    window.history.replaceState(null, "", `#${activeId}`);
  }, [activeId]);

  const activeLabel = items.find((item) => item.href.slice(1) === activeId)?.label ?? "";

  return <ActiveSectionContext value={{ activeId, activeLabel }}>{children}</ActiveSectionContext>;
}

export function useActiveSection() {
  return use(ActiveSectionContext);
}
