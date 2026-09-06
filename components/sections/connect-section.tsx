import { Section } from "@/components/sections/section";
import { Eyebrow } from "@/components/sections/eyebrow";
import { ContactForm } from "@/components/sections/contact-form";
import type { Tables } from "@/lib/supabase/database.types";

export function ConnectSection({ socialLinks }: { socialLinks: Tables<"social_links">[] }) {
  return (
    <Section id="connect" label="Connect">
      <Eyebrow>Connect</Eyebrow>
      <h2 className="text-h1 font-semibold text-balance text-foreground">Let&rsquo;s talk</h2>
      <p className="mt-4 max-w-prose text-body text-muted-foreground text-pretty">
        Have a project in mind, or just want to say hi? Send a message below.
      </p>

      <ContactForm />

      {socialLinks.length > 0 ? (
        <ul className="mt-12 flex flex-wrap gap-x-6 gap-y-2 border-t border-border pt-6">
          {socialLinks.map((link) => (
            <li key={link.id}>
              <a
                href={link.url}
                target={link.url.startsWith("mailto:") ? undefined : "_blank"}
                rel={link.url.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                className="font-mono text-meta text-muted-foreground uppercase hover:text-accent-readable focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                {link.platform}
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </Section>
  );
}
