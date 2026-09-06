import type { ReactNode } from "react";
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
  return (
    <section
      id={id}
      aria-label={label}
      className={cn("flex min-h-screen w-full flex-col justify-center px-10 py-24 sm:px-14", className)}
      style={{ scrollMarginTop: "1.5rem" }}
    >
      {children}
    </section>
  );
}
