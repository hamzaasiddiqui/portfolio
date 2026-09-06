import { LinkedinLogo } from "@phosphor-icons/react/dist/ssr/LinkedinLogo";
import { GithubLogo } from "@phosphor-icons/react/dist/ssr/GithubLogo";
import { EnvelopeSimple } from "@phosphor-icons/react/dist/ssr/EnvelopeSimple";
import { Globe } from "@phosphor-icons/react/dist/ssr/Globe";
import type { Tables } from "@/lib/supabase/database.types";

const ICONS: Record<string, typeof LinkedinLogo> = {
  "linkedin-logo": LinkedinLogo,
  "github-logo": GithubLogo,
  "envelope-simple": EnvelopeSimple,
  globe: Globe,
};

export function SocialLinks({ links }: { links: Tables<"social_links">[] }) {
  if (links.length === 0) return null;

  return (
    <div className="group/social relative flex size-9 items-center justify-end">
      {/* Always-visible trigger. Real focusable element so keyboard users
          land here and immediately satisfy :focus-within — no mouse
          required to reach the links behind it. */}
      <button
        type="button"
        aria-label="Social links"
        className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border/60 bg-background/60 text-foreground shadow-sm backdrop-blur-md transition-opacity duration-200 ease-apple group-hover/social:opacity-0 group-focus-within/social:opacity-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Globe size={16} aria-hidden="true" />
      </button>

      <div className="pointer-events-none absolute right-0 flex items-center gap-1 rounded-full border border-border/60 bg-background/80 p-1 opacity-0 shadow-lg backdrop-blur-md transition-opacity duration-200 ease-apple group-hover/social:pointer-events-auto group-hover/social:opacity-100 group-focus-within/social:pointer-events-auto group-focus-within/social:opacity-100">
        {links.map((link) => {
          const Icon = ICONS[link.icon_name] ?? Globe;
          return (
            <a
              key={link.id}
              href={link.url}
              target={link.url.startsWith("mailto:") ? undefined : "_blank"}
              rel={link.url.startsWith("mailto:") ? undefined : "noopener noreferrer"}
              aria-label={link.platform}
              className="flex size-8 shrink-0 items-center justify-center rounded-full text-foreground transition-colors hover:bg-accent/10 hover:text-accent-readable focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Icon size={16} weight="regular" aria-hidden="true" />
            </a>
          );
        })}
      </div>
    </div>
  );
}
