"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun } from "@phosphor-icons/react/dist/csr/Sun";
import { Moon } from "@phosphor-icons/react/dist/csr/Moon";
import { useSidebar } from "@/components/layout/sidebar-context";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const { isCollapsed } = useSidebar();
  const [mounted, setMounted] = useState(false);

  // next-themes resolves the real theme from localStorage via a script that
  // runs before hydration, so the DOM's `.dark`/`.light` class is already
  // correct by the time React hydrates — but `resolvedTheme` in this render
  // is still `undefined` on the very first client render. Any guessed
  // default here is wrong whenever the visitor's stored preference differs
  // from the guess, producing a hydration mismatch on aria-checked/icon.
  // Rendering the same "unresolved" state on both server and first client
  // paint, then flipping post-mount, is next-themes' documented fix.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  const isDark = mounted ? resolvedTheme !== "light" : true;
  const label = isDark ? "Switch to light mode" : "Switch to dark mode";

  // The full pill track (56px) doesn't fit the collapsed rail's inner width
  // — swap to a compact icon-only button rather than let it clip.
  if (isCollapsed) {
    return (
      <button
        type="button"
        aria-label={label}
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className="flex size-7 shrink-0 items-center justify-center rounded-full border border-border/60 bg-background text-foreground shadow-sm transition-colors hover:bg-accent/10 hover:text-accent-readable focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar"
      >
        {isDark ? <Moon size={13} weight="fill" /> : <Sun size={13} weight="fill" />}
      </button>
    );
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={label}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="group/toggle relative inline-flex h-7 w-14 shrink-0 items-center rounded-full border border-border/60 bg-muted p-1 shadow-inner transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar"
    >
      <span
        className="flex size-5 items-center justify-center rounded-full bg-background text-foreground shadow-md transition-transform duration-300 ease-apple"
        style={{ transform: isDark ? "translateX(28px)" : "translateX(0px)" }}
      >
        {isDark ? <Moon size={12} weight="fill" /> : <Sun size={12} weight="fill" className="text-accent-readable" />}
      </span>
    </button>
  );
}
