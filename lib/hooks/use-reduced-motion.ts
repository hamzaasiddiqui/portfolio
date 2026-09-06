"use client";

import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(QUERY);
    // matchMedia is unavailable during SSR, so this can only be read after
    // mount — there's no server-rendered value to diverge from here since
    // this hook only ever gates imperative animation behavior, never JSX.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReduced(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return reduced;
}
