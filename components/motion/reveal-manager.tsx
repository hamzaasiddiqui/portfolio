"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useIntro } from "@/components/motion/intro-context";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";

gsap.registerPlugin(ScrollTrigger);

export type RevealKind = "up" | "fade" | "line" | "scale";

const FROM: Record<RevealKind, gsap.TweenVars> = {
  up: { opacity: 0, y: 28 },
  fade: { opacity: 0 },
  line: { opacity: 1, scaleX: 0, transformOrigin: "left center" },
  scale: { opacity: 0, y: 20, scale: 1.05 },
};

const TO: Record<RevealKind, gsap.TweenVars> = {
  up: { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
  fade: { opacity: 1, duration: 0.8, ease: "power2.out" },
  line: { scaleX: 1, duration: 1.1, ease: "power3.inOut" },
  scale: { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "power3.out" },
};

function kindOf(element: HTMLElement): RevealKind {
  const value = element.dataset.reveal;
  return value === "fade" || value === "line" || value === "scale" ? value : "up";
}

export function RevealManager() {
  const { introDone } = useIntro();
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (!introDone) return;

      const elements = gsap.utils.toArray<HTMLElement>("[data-reveal]");
      if (elements.length === 0) return;

      if (reducedMotion) {
        gsap.set(elements, { opacity: 1 });
        return;
      }

      const revealed = new WeakSet<HTMLElement>();

      const reveal = (batch: Element[]) => {
        const fresh = batch.filter(
          (el): el is HTMLElement => el instanceof HTMLElement && !revealed.has(el)
        );
        if (fresh.length === 0) return;

        const each = Math.min(0.09, 1.2 / fresh.length);
        fresh.forEach((el, index) => {
          revealed.add(el);
          const kind = kindOf(el);
          gsap.fromTo(el, FROM[kind], {
            ...TO[kind],
            delay: index * each,
            onComplete: () => gsap.set(el, { clearProps: "transform" }),
          });
        });
      };

      const above = elements.filter((el) => el.getBoundingClientRect().bottom < 0);
      above.forEach((el) => revealed.add(el));
      gsap.set(above, { opacity: 1 });

      ScrollTrigger.batch(elements, {
        start: "top 92%",
        onEnter: reveal,
        onEnterBack: reveal,
      });
    },
    { dependencies: [introDone, reducedMotion] }
  );

  return null;
}
