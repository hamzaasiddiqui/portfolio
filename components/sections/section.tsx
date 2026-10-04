"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

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
      <div className="w-full">{children}</div>
    </section>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="mb-12 w-full">
      <h2 data-reveal className="pb-4 font-label text-meta text-muted-foreground uppercase">
        {children}
      </h2>
      <span data-reveal="line" aria-hidden="true" className="block h-px w-full bg-border" />
    </div>
  );
}
