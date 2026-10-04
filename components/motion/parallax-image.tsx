"use client";

import { useRef, type ComponentProps, type CSSProperties } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import type { RevealKind } from "@/components/motion/reveal-manager";

type ImageProps = Omit<ComponentProps<typeof Image>, "fill" | "className" | "style" | "alt">;

export function ParallaxImage({
  alt,
  drift = 12,
  className,
  style,
  reveal = "scale",
  imageClassName,
  ...image
}: ImageProps & {
  alt: string;
  drift?: number;
  className?: string;
  style?: CSSProperties;
  reveal?: RevealKind | null;
  imageClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const amplitude = (drift / (100 + 2 * drift)) * 100;
  const y = useTransform(scrollYProgress, [0, 1], [`${-amplitude}%`, `${amplitude}%`]);

  return (
    <div
      ref={ref}
      data-reveal={reveal ?? undefined}
      className={cn("relative overflow-hidden", className)}
      style={style}
    >
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
