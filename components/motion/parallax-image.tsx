"use client";

import { useRef, type ComponentProps, type CSSProperties } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import type { RevealKind } from "@/components/motion/reveal-manager";

type ImageProps = Omit<ComponentProps<typeof Image>, "fill" | "className" | "style" | "alt">;

/**
 * Every picture on the site goes through this so they all drift the same way.
 *
 * The host is an ordinary box — give it a size (an aspect ratio, usually) and
 * it clips. The picture inside is taller than the host by `drift` percent on
 * each end and slides from one bleed to the other as the host crosses the
 * viewport, so it always has spare image to move into and never shows an
 * edge. It moves *against* the scroll, which is what makes it read as sitting
 * behind the page rather than on it.
 */
export function ParallaxImage({
  alt,
  drift = 12,
  className,
  style,
  reveal = "scale",
  imageClassName,
  ...image
}: ImageProps & {
  /** Required, and "" for a purely decorative picture. */
  alt: string;
  /** Bleed on each end as a percentage of the host's height. */
  drift?: number;
  /** Applied to the host box, not the picture — a clip-path goes here. */
  className?: string;
  style?: CSSProperties;
  /** Entrance, handled by RevealManager on the host. `null` opts out. */
  reveal?: RevealKind | null;
  imageClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // The local hook, not motion's: it reports `false` on the first render on
  // both server and client, so the transform in the markup matches at
  // hydration. Motion's version already knows the preference client-side
  // and would render `y: 0` against the server's parallax offset.
  const reduceMotion = useReducedMotion();

  // 0 when the host's top meets the viewport's bottom, 1 when its bottom
  // meets the viewport's top: the whole span in which it is visible at all.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // The travel is expressed in the picture's own height (that is what `y`
  // percentages mean on the element being moved), so it is scaled back from
  // host units to picture units to stay exactly inside the bleed.
  const amplitude = (drift / (100 + 2 * drift)) * 100;
  const y = useTransform(scrollYProgress, [0, 1], [`${-amplitude}%`, `${amplitude}%`]);

  return (
    <div
      ref={ref}
      data-reveal={reveal ?? undefined}
      className={cn("relative overflow-hidden", className)}
      style={style}
    >
      {/* Not aria-hidden: the picture's own `alt` decides whether it is
          decorative, and hiding the wrapper would override a real one. */}
      <motion.div
        className="absolute inset-x-0 will-change-transform"
        style={{
          top: `${-drift}%`,
          bottom: `${-drift}%`,
          y: reduceMotion ? 0 : y,
        }}
      >
        <Image {...image} alt={alt} fill className={cn("object-cover", imageClassName)} />
      </motion.div>
    </div>
  );
}
