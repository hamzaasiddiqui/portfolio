"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useActiveSection } from "@/components/active-section-provider";

export function SectionIndicator() {
  const { activeId, activeLabel } = useActiveSection();
  const shouldReduceMotion = useReducedMotion();

  return (
    <div aria-live="polite" className="relative flex h-8 items-center overflow-hidden">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={activeId}
          initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={shouldReduceMotion ? undefined : { opacity: 0, y: -14 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-h2 font-medium text-accent"
        >
          {activeLabel}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
