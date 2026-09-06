import { LinkedinLogo } from "@phosphor-icons/react/dist/ssr/LinkedinLogo";
import { GithubLogo } from "@phosphor-icons/react/dist/ssr/GithubLogo";
import { EnvelopeSimple } from "@phosphor-icons/react/dist/ssr/EnvelopeSimple";
import { Globe } from "@phosphor-icons/react/dist/ssr/Globe";
import { Plus } from "@phosphor-icons/react/dist/ssr/Plus";
import { ICON_BUTTON } from "@/components/layout/control-styles";
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
    // Hover/focus is pure CSS on this group, so the cluster stays a Server
    // Component — no client bundle for what a `:hover` can do.
    <div className="group/social relative size-8">
      {/* Collapsed: a single glyph, rotating 45° into a close mark as the
          column opens beneath it. It keeps pointer events while faded so the
          hover target never disappears out from under the cursor. */}
      <button
        type="button"
        aria-label="Social links"
        className={`${ICON_BUTTON} absolute top-0 right-0 group-hover/social:rotate-45 group-hover/social:text-accent group-focus-within/social:rotate-45 group-focus-within/social:text-accent`}
      >
        <Plus size={16} aria-hidden="true" />
      </button>

      {/* Expanded: the links drop straight down from the trigger, one under
          the other, each a bare glyph — no panel, card or overlay behind
          them. Absolutely placed, so opening shifts nothing on the page. */}
      <div className="absolute top-9 right-0 flex flex-col items-center gap-1">
        {links.map((link, index) => {
          const Icon = ICONS[link.icon_name] ?? Globe;
          const isMail = link.url.startsWith("mailto:");

          return (
            <a
              key={link.id}
              href={link.url}
              target={isMail ? undefined : "_blank"}
              rel={isMail ? undefined : "noopener noreferrer"}
              aria-label={link.platform}
              style={{ transitionDelay: `${index * 45}ms` }}
              className={`${ICON_BUTTON} pointer-events-none -translate-y-2 opacity-0 transition-[color,transform,opacity] group-hover/social:pointer-events-auto group-hover/social:translate-y-0 group-hover/social:opacity-100 group-focus-within/social:pointer-events-auto group-focus-within/social:translate-y-0 group-focus-within/social:opacity-100`}
            >
              <Icon size={16} aria-hidden="true" />
            </a>
          );
        })}
      </div>
    </div>
  );
}
