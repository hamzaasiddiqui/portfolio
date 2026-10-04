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
    if (!activeId) return;
    window.history.replaceState(null, "", `#${activeId}`);
  }, [activeId]);

  const activeLabel = items.find((item) => item.href.slice(1) === activeId)?.label ?? "";

  return <ActiveSectionContext value={{ activeId, activeLabel }}>{children}</ActiveSectionContext>;
}

export function useActiveSection() {
  return use(ActiveSectionContext);
}
