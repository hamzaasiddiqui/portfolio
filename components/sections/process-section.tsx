import { Section, SectionLabel } from "@/components/sections/section";
import type { Tables } from "@/lib/supabase/database.types";

export function ProcessSection({ steps }: { steps: Tables<"process_steps">[] }) {
  return (
    <Section id="process" label="Process">
      <SectionLabel>Process</SectionLabel>

      {steps.length === 0 ? (
        <p className="text-body text-muted-foreground">Process steps coming soon.</p>
      ) : (
        <ol className="flex flex-col">
          {steps.map((step, index) => (
            <li
              key={step.id}
              className="grid grid-cols-[3rem_minmax(0,1fr)] items-start gap-x-6 gap-y-2 border-b border-border py-7 first:pt-0 last:border-b-0 sm:grid-cols-[5rem_minmax(0,22rem)_minmax(0,1fr)]"
            >
              <span className="font-mono text-meta text-accent tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="font-display text-h2 font-medium">{step.title}</h3>
              <p className="col-start-2 max-w-prose text-body text-pretty text-muted-foreground sm:col-start-3">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      )}
    </Section>
  );
}
