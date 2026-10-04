"use client";

import { createContext, use, useCallback, useMemo, useState, type ReactNode } from "react";
import { MotionConfig } from "motion/react";

interface IntroContextValue {
  introDone: boolean;
  finishIntro: () => void;
}

const IntroContext = createContext<IntroContextValue>({
  introDone: false,
  finishIntro: () => {},
});

export function IntroProvider({ children }: { children: ReactNode }) {
  const [introDone, setIntroDone] = useState(false);
  const finishIntro = useCallback(() => setIntroDone(true), []);
  const value = useMemo(() => ({ introDone, finishIntro }), [introDone, finishIntro]);

  return (
    <MotionConfig reducedMotion="user">
      <IntroContext value={value}>{children}</IntroContext>
    </MotionConfig>
  );
}

export function useIntro() {
  return use(IntroContext);
}
