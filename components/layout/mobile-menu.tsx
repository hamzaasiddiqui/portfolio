"use client";

import { useEffect, useState } from "react";
import { List } from "@phosphor-icons/react/dist/csr/List";
import { X } from "@phosphor-icons/react/dist/csr/X";
import { ArrowDown } from "@phosphor-icons/react/dist/csr/ArrowDown";
import { cn } from "@/lib/utils";
import { type NavItem } from "@/components/layout/nav-items";
import { useActiveSection } from "@/components/active-section-provider";
import { ICON_BUTTON, META_LINK } from "@/components/layout/control-styles";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { PlasmaLayer } from "@/components/plasma/plasma-layer";

const MENU_ID = "mobile-menu";

export function MobileMenu({
  items,
  resumeUrl,
}: {
  items: NavItem[];
  resumeUrl: string | null;
}) {
  const [open, setOpen] = useState(false);
  const { activeId } = useActiveSection();

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    function onPointerDown(event: PointerEvent) {
      const target = event.target as HTMLElement | null;
      if (!target?.closest(`#${MENU_ID}, [aria-controls="${MENU_ID}"]`)) setOpen(false);
    }

    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls={MENU_ID}
        onClick={() => setOpen((previous) => !previous)}
        className={cn(ICON_BUTTON, "ml-auto lg:hidden", open && "text-accent")}
      >
        {open ? <X size={17} aria-hidden="true" /> : <List size={17} aria-hidden="true" />}
      </button>

      {open ? (
        <div
          id={MENU_ID}
          className="absolute inset-x-0 top-full mt-3 rounded-[26px] px-5 py-3 lg:hidden"
        >
          <PlasmaLayer fuse={false} className="-z-10" />
          <div
            aria-hidden="true"
            className="absolute inset-[2px] -z-10 rounded-[24px] bg-background/92 backdrop-blur-xl"
          />

          <nav aria-label="Section navigation">
            <ul className="flex flex-col">
              {items.map((item, index) => {
                const isActive = item.href.slice(1) === activeId;

                return (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      aria-current={isActive ? "true" : undefined}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3.5 py-3 font-label text-meta uppercase transition-colors duration-200 ease-apple",
                        isActive ? "text-accent" : "text-foreground"
                      )}
                    >
                      <span className="tabular-nums opacity-45" aria-hidden="true">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="mt-3 h-px w-full bg-border" />

          <div className="flex items-center justify-between gap-4 pt-3">
            {resumeUrl ? (
              <a
                href={resumeUrl}
                download
                className={cn(META_LINK, "inline-flex items-center gap-1.5")}
              >
                Resume
                <ArrowDown size={11} weight="bold" aria-hidden="true" />
              </a>
            ) : (
              <span />
            )}
            <ThemeToggle />
          </div>
        </div>
      ) : null}
    </>
  );
}
