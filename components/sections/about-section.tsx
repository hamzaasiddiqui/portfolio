import { Section } from "@/components/sections/section";
import type { Tables } from "@/lib/supabase/database.types";

export function AboutSection({ profile }: { profile: Tables<"profile"> }) {
  return (
    <Section id="about" label="About">
      <div className="grid grid-cols-1 items-center gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,30%)_minmax(0,1fr)]">
        {/* Ticket 3 mounts the R3F canvas here — prominent and mouse-
            interactive while About is the active section, ambient elsewhere.
            Deliberately unstyled: it reserves square space in the grid and
            nothing more, so the 3D model arrives without a frame to fight. */}
        <div id="robot-slot" aria-hidden="true" className="aspect-square w-full" />

        <div>
          {/* The name lives permanently in the sidebar, so the page's one
              <h1> is the tagline. */}
          {profile.tagline ? (
            <h1 className="font-display text-display font-medium text-balance uppercase">{profile.tagline}</h1>
          ) : null}

          {profile.about_text ? (
            <div className="mt-12 max-w-md border-t border-border pt-5">
              <p className="mb-3 font-mono text-meta text-muted-foreground uppercase">About</p>
              <p className="text-body text-pretty whitespace-pre-line text-muted-foreground">
                {profile.about_text}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </Section>
  );
}
