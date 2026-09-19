"use client";

import { createContext, use, useCallback, useMemo, useState, type ReactNode } from "react";
import { MotionConfig } from "motion/react";

interface IntroContextValue {
  /** True once the loading screen has started to leave (or never showed). */
  introDone: boolean;
  finishIntro: () => void;
}

const IntroContext = createContext<IntroContextValue>({
  introDone: false,
  finishIntro: () => {},
});

/**
 * The page's first appearance is choreographed: nothing animates in until the
 * loading screen begins to lift, so the sidebar, hero and scroll reveals all
 * start from behind the curtain rather than under it. This is the one flag
 * they share. It starts false on both server and client so hydration matches;
 * the loader flips it — immediately, if there is nothing to show.
 */
export function IntroProvider({ children }: { children: ReactNode }) {
  const [introDone, setIntroDone] = useState(false);
  const finishIntro = useCallback(() => setIntroDone(true), []);
  const value = useMemo(() => ({ introDone, finishIntro }), [introDone, finishIntro]);

  return (
    // reducedMotion="user": every `initial`/`animate` transform on the page
    // collapses to an instant change for people who asked for less motion,
    // while opacity still fades — no per-component checks needed.
    <MotionConfig reducedMotion="user">
      <IntroContext value={value}>{children}</IntroContext>
    </MotionConfig>
  );
}

export function useIntro() {
  return use(IntroContext);
}
