import { Section, SectionLabel } from "@/components/sections/section";
import { ContactForm } from "@/components/sections/contact-form";
import { ParallaxImage } from "@/components/motion/parallax-image";
import type { Tables } from "@/lib/supabase/database.types";

export function ConnectSection({
  socialLinks,
  avatarUrl,
  name,
}: {
  socialLinks: Tables<"social_links">[];
  avatarUrl: string | null;
  name: string;
}) {
  return (
    <Section id="connect" label="Connect">
      <SectionLabel>Connect</SectionLabel>

      <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:gap-x-16 xl:grid-cols-[14rem_minmax(0,1fr)_minmax(0,22rem)] xl:gap-x-12 2xl:grid-cols-[16rem_minmax(0,1fr)_minmax(0,24rem)] 2xl:gap-x-16">
        <div className="flex flex-col gap-10 xl:contents">
          {avatarUrl ? (
            <ParallaxImage
              src={avatarUrl}
              alt={`Portrait of ${name}`}
              sizes="(min-width: 1536px) 16rem, (min-width: 1280px) 14rem, 11rem"
              drift={8}
              className="aspect-square w-40 rounded-2xl lg:w-44 xl:aspect-3/4 xl:w-full"
            />
          ) : null}

          <div className="flex flex-col gap-10">
            <p data-reveal className="font-display text-h1 font-medium text-balance uppercase">
              Have something in mind? Send it over.
            </p>

            {socialLinks.length > 0 ? (
              <ul className="flex max-w-sm flex-col">
                {socialLinks.map((link) => (
                  <li key={link.id} data-reveal className="border-b border-border first:border-t">
                    <a
                      href={link.url}
                      target={link.url.startsWith("mailto:") ? undefined : "_blank"}
                      rel={link.url.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                      className="flex items-baseline justify-between gap-4 py-3 font-label text-meta text-muted-foreground uppercase transition-colors duration-200 ease-apple hover:text-accent-ink"
                    >
                      {link.platform}
                      <span aria-hidden="true">&rarr;</span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>

        <ContactForm />
      </div>
    </Section>
  );
}
