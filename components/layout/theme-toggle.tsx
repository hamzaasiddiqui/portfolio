"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun } from "@phosphor-icons/react/dist/csr/Sun";
import { Moon } from "@phosphor-icons/react/dist/csr/Moon";
import { ICON_BUTTON } from "@/components/layout/control-styles";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // next-themes writes the real theme onto <html> from a pre-hydration
  // script, but `resolvedTheme` is still undefined on the first client
  // render. Rendering the same "unresolved" state on server and first paint,
  // then flipping post-mount, is next-themes' documented fix for the
  // hydration mismatch this would otherwise cause.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  const isDark = mounted ? resolvedTheme !== "light" : true;

  return (
    <button
      type="button"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={ICON_BUTTON}
    >
      {isDark ? <Moon size={15} /> : <Sun size={15} />}
    </button>
  );
}
