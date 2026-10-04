"use client";

import { Plasma } from "@cruxgarden/plasma-ui";
import { cn } from "@/lib/utils";
import { useIntro } from "@/components/motion/intro-context";

export function PlasmaLayer({
  radius,
  fuse = true,
  className,
}: {
  radius?: number;
  fuse?: boolean;
  className?: string;
}) {
  const { introDone } = useIntro();

  if (!introDone) return null;

  return (
    <Plasma
      aria-hidden="true"
      radius={radius}
      fuse={fuse}
      lean={false}
      className={cn("pointer-events-none absolute inset-0", className)}
    />
  );
}
