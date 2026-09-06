import { Section } from "@/components/sections/section";
import { Eyebrow } from "@/components/sections/eyebrow";
import type { Tables } from "@/lib/supabase/database.types";

export function AboutSection({ profile }: { profile: Tables<"profile"> }) {
  return (
    <Section id="about" label="About">
      <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-[minmax(0,28%)_minmax(0,1fr)]">
        {/* 3D robot slot — ticket 3 mounts the R3F canvas here, prominent
            and mouse-interactive only while this section is active. */}
        <div
          aria-hidden="true"
          className="aspect-square w-full rounded-3xl border border-dashed border-border/60 bg-muted/30"
        />

        <div>
          <Eyebrow>About</Eyebrow>
          <h1 className="text-display font-semibold text-balance text-foreground">
            {profile.name}
          </h1>
          {profile.tagline ? (
            <p className="mt-4 text-h3 text-muted-foreground text-pretty">{profile.tagline}</p>
          ) : null}
          {profile.about_text ? (
            <p className="mt-8 max-w-prose text-body text-foreground/90 text-pretty whitespace-pre-line">
              {profile.about_text}
            </p>
          ) : null}
        </div>
      </div>
    </Section>
  );
}
