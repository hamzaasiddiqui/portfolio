"use client";

import { useState, type FocusEvent } from "react";
import { LinkedinLogo } from "@phosphor-icons/react/dist/csr/LinkedinLogo";
import { GithubLogo } from "@phosphor-icons/react/dist/csr/GithubLogo";
import { EnvelopeSimple } from "@phosphor-icons/react/dist/csr/EnvelopeSimple";
import { Globe } from "@phosphor-icons/react/dist/csr/Globe";
import { Plus } from "@phosphor-icons/react/dist/csr/Plus";
import { cn } from "@/lib/utils";
import { PlasmaLayer } from "@/components/plasma/plasma-layer";
import type { Tables } from "@/lib/supabase/database.types";

const ICONS: Record<string, typeof LinkedinLogo> = {
  "linkedin-logo": LinkedinLogo,
  "github-logo": GithubLogo,
  "envelope-simple": EnvelopeSimple,
  globe: Globe,
};

const CONTROL =
  "relative inline-flex size-9 shrink-0 items-center justify-center rounded-[18px] text-foreground transition-colors duration-200 ease-apple hover:text-accent";

export function SocialLinks({ links }: { links: Tables<"social_links">[] }) {
  const [open, setOpen] = useState(false);

  if (links.length === 0) return null;

  function handleBlur(event: FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
  }

  return (
    <div
      className="relative size-9"
      onPointerEnter={() => setOpen(true)}
      onPointerLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={handleBlur}
    >
      <button
        type="button"
        aria-label="Social links"
        aria-expanded={open}
        className={cn(CONTROL, "absolute top-0 right-0", open && "text-accent")}
      >
        <PlasmaLayer radius={18} fuse={false} />
        <Plus
          size={16}
          aria-hidden="true"
          className={cn(
            "relative transition-[rotate] duration-300 ease-apple",
            open && "rotate-45"
          )}
        />
      </button>

      <div className="absolute top-9 right-0 flex flex-col items-center gap-5 pt-5">
        {open
          ? links.map((link) => {
              const Icon = ICONS[link.icon_name] ?? Globe;
              const isMail = link.url.startsWith("mailto:");

              return (
                <a
                  key={link.id}
                  href={link.url}
                  target={isMail ? undefined : "_blank"}
                  rel={isMail ? undefined : "noopener noreferrer"}
                  aria-label={link.platform}
                  className={CONTROL}
                >
                  <PlasmaLayer radius={18} fuse={false} />
                  <Icon size={16} aria-hidden="true" className="relative" />
                </a>
              );
            })
          : null}
      </div>
    </div>
  );
}
