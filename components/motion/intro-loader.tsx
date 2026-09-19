"use client";

import { Fragment, useEffect, useState } from "react";
import { AnimatePresence, animate, motion, useMotionValue, useTransform } from "motion/react";
import { useIntro } from "@/components/motion/intro-context";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const EASE_IN_OUT = [0.83, 0, 0.17, 1] as const;

// Milestones, in ms from mount.
const LEAVE_AT = 1700; // name rolls back out
const LIFT_AT = 2050; // curtain lifts, page starts animating in

type Phase = "loading" | "leaving" | "gone";

/**
 * First-visit loading screen: the name rolls in letter by letter over a
 * counter and a hairline that fill to 100, then everything rolls out and the
 * whole black curtain lifts off the top of the page.
 *
 * It renders on the server so the very first paint is the curtain, not a
 * flash of page. A blocking script in the root layout marks <html> with
 * data-intro="seen" from sessionStorage before that paint, and the CSS hides
 * the curtain outright in that case, so a reload never replays it. Anyone who
 * asked for reduced motion skips it entirely.
 */
export function IntroLoader({ name }: { name: string }) {
  const { finishIntro } = useIntro();
  const [phase, setPhase] = useState<Phase>("loading");

  const progress = useMotionValue(0);
  const counter = useTransform(progress, (value) => String(Math.round(value)).padStart(3, "0"));
  const fill = useTransform(progress, [0, 100], [0, 1]);

  useEffect(() => {
    const root = document.documentElement;
    const seen = root.dataset.intro === "seen";
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (seen || reduced) {
      // Nothing to show: hand the page over at once. Setting state here is
      // the point — it's the client-only decision the server couldn't make.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPhase("gone");
      finishIntro();
      return;
    }

    try {
      sessionStorage.setItem("intro-seen", "1");
    } catch {
      // Private browsing: the curtain will simply play again next load.
    }

    root.style.overflow = "hidden";
    const count = animate(progress, 100, { duration: 1.5, delay: 0.15, ease: [0.65, 0, 0.35, 1] });
    const leave = window.setTimeout(() => setPhase("leaving"), LEAVE_AT);
    const lift = window.setTimeout(() => {
      root.style.overflow = "";
      setPhase("gone");
      finishIntro();
    }, LIFT_AT);

    return () => {
      count.stop();
      window.clearTimeout(leave);
      window.clearTimeout(lift);
      root.style.overflow = "";
    };
  }, [finishIntro, progress]);

  const leaving = phase === "leaving";
  const words = name.split(" ");
  let letterIndex = 0;

  return (
    <AnimatePresence>
      {phase !== "gone" ? (
        <motion.div
          role="status"
          aria-label="Loading"
          className="intro-loader fixed inset-0 z-(--z-modal) flex items-center justify-center bg-background text-foreground"
          exit={{ y: "-100%", transition: { duration: 0.9, ease: EASE_IN_OUT } }}
        >
          {/* The name. Each letter sits in its own clip box (padded and
              pulled back so the display face's ascenders survive its tight
              line-height) and rolls up into place, then on out the top. */}
          <p
            aria-hidden="true"
            className="px-(--gutter) text-center font-display text-display font-medium text-balance"
          >
            {words.map((word, wordIndex) => (
              <Fragment key={wordIndex}>
                {wordIndex > 0 ? " " : null}
                <span className="inline-block whitespace-nowrap">
                  {Array.from(word).map((letter, i) => {
                    const index = letterIndex++;
                    return (
                      <span
                        key={i}
                        className="inline-block my-[-0.12em] overflow-hidden py-[0.12em]"
                      >
                        <motion.span
                          className="block"
                          initial={{ y: "110%" }}
                          animate={{ y: leaving ? "-110%" : "0%" }}
                          transition={
                            leaving
                              ? { duration: 0.5, ease: EASE_IN_OUT, delay: index * 0.015 }
                              : { duration: 0.9, ease: EASE_OUT, delay: 0.1 + index * 0.035 }
                          }
                        >
                          {letter}
                        </motion.span>
                      </span>
                    );
                  })}
                </span>
              </Fragment>
            ))}
          </p>

          {/* Footer band: a label on the left, the counter on the right, the
              fill line along the bottom edge. Fades as the name leaves. */}
          <motion.div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 flex items-end justify-between p-(--gutter)"
            initial={{ opacity: 0 }}
            animate={{ opacity: leaving ? 0 : 1 }}
            transition={{ duration: leaving ? 0.4 : 0.8, ease: EASE_OUT, delay: leaving ? 0 : 0.3 }}
          >
            <span className="font-label text-meta text-muted-foreground uppercase">Loading</span>
            <motion.span className="font-display text-h1 font-medium tabular-nums">{counter}</motion.span>
          </motion.div>
          <motion.span
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-px origin-left bg-accent"
            style={{ scaleX: fill }}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
