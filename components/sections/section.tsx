"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/reveal";

export function Section({
  id,
  label,
  children,
  className,
}: {
  id: string;
  label: string;
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  // Overflow exemption: a section taller than the viewport (Projects,
  // Experience — both driven by an unbounded row count) must not snap, or a
  // long list traps the user mid-scroll. Measured, not hardcoded to named
  // sections, and applied imperatively so server and client render alike.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const check = () => {
      el.style.scrollSnapAlign = el.scrollHeight <= window.innerHeight + 2 ? "start" : "none";
    };
    check();

    const observer = new ResizeObserver(check);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      id={id}
      aria-label={label}
      className={cn(
        "flex min-h-screen w-full flex-col justify-center px-(--gutter) py-28",
        className
      )}
      style={{ scrollMarginTop: "var(--gutter)", scrollSnapAlign: "start" }}
    >
      <Reveal className="w-full">{children}</Reveal>
    </section>
  );
}

/**
 * Section label: small, mono, uppercase, over a hairline. The section's own
 * name is already set large and in the accent colour by the fixed indicator
 * in the top-right corner — repeating it in display type here would just be
 * the same word twice, so the big type in each section belongs to the
 * *content* instead.
 */
export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-12 w-full border-b border-border pb-4 font-mono text-meta text-muted-foreground uppercase">
      {children}
    </h2>
  );
}
