import { Section } from "@/components/sections/section";
import { Eyebrow } from "@/components/sections/eyebrow";
import type { Tables } from "@/lib/supabase/database.types";

export function ProcessSection({ steps }: { steps: Tables<"process_steps">[] }) {
  return (
    <Section id="process" label="Process">
      <Eyebrow>Process</Eyebrow>
      <h2 className="text-h1 font-semibold text-balance text-foreground">Process</h2>

      {steps.length === 0 ? (
        <p className="mt-8 text-body text-muted-foreground">Process steps coming soon.</p>
      ) : (
        <ol className="mt-10 flex flex-col gap-8">
          {steps.map((step, index) => (
            <li key={step.id} className="flex gap-6 border-t border-border pt-6 first:border-t-0 first:pt-0">
              <span className="font-mono text-meta text-muted-foreground tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-h3 font-semibold text-foreground">{step.title}</h3>
                <p className="mt-2 max-w-prose text-body text-muted-foreground text-pretty">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </Section>
  );
}
