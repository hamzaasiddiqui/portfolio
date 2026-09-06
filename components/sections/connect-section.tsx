import { Section, SectionLabel } from "@/components/sections/section";
import { ContactForm } from "@/components/sections/contact-form";
import type { Tables } from "@/lib/supabase/database.types";

export function ConnectSection({ socialLinks }: { socialLinks: Tables<"social_links">[] }) {
  return (
    <Section id="connect" label="Connect">
      <SectionLabel>Connect</SectionLabel>

      <div className="grid grid-cols-1 gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)]">
        <div>
          <p className="max-w-lg font-display text-h1 font-medium text-balance uppercase">
            Have something in mind? Send it over.
          </p>

          {socialLinks.length > 0 ? (
            <ul className="mt-12 flex flex-col">
              {socialLinks.map((link) => (
                <li key={link.id} className="border-b border-border first:border-t">
                  <a
                    href={link.url}
                    target={link.url.startsWith("mailto:") ? undefined : "_blank"}
                    rel={link.url.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                    className="flex items-baseline justify-between gap-4 py-3 font-mono text-meta text-muted-foreground uppercase transition-colors duration-200 ease-apple hover:text-accent-ink"
                  >
                    {link.platform}
                    <span aria-hidden="true">&rarr;</span>
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <ContactForm />
      </div>
    </Section>
  );
}
