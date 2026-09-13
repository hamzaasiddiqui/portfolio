import { Section } from "@/components/sections/section";
import { RichTextBlock } from "@/components/rich-text";
import type { Tables } from "@/lib/supabase/database.types";

export function AboutSection({ profile }: { profile: Tables<"profile"> }) {
  return (
    <Section id="about" label="About">
      <div className="grid grid-cols-1 items-center gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,30%)_minmax(0,1fr)]">
        {/* Desktop keeps this column clear for the figure, which FigureLayer
            floats over the whole viewport. Below that breakpoint there is no
            figure at all, so the column collapses instead of leaving a hole. */}
        <div aria-hidden="true" className="hidden aspect-square w-full lg:block" />

        <div>
          {/* The name lives permanently in the sidebar, so the page's one
              <h1> is the tagline. */}
          {profile.tagline ? (
            <h1 className="font-display text-h1 font-medium text-balance uppercase">{profile.tagline}</h1>
          ) : null}

          {profile.about_text ? (
            <div className="mt-10 max-w-2xl border-t border-border pt-5">
              <p className="mb-3 font-mono text-meta text-muted-foreground uppercase">About</p>
              <RichTextBlock
                text={profile.about_text}
                className="text-body text-pretty text-muted-foreground"
              />
            </div>
          ) : null}
        </div>
      </div>
    </Section>
  );
}
