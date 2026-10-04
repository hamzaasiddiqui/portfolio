"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import { useIntro } from "@/components/motion/intro-context";

export function IntroReveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const { introDone } = useIntro();

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: -10 }}
      animate={introDone ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
