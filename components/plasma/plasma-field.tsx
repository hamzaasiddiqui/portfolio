"use client";

import { useEffect, useState, type ReactNode } from "react";
import { PlasmaCanvas, PlasmaProvider } from "@cruxgarden/plasma-ui";
import { useTheme } from "next-themes";

const THEMES = {
  dark: {
    background: "#00000000",
    rimColor: "#ff36ac",
    rim: 0.5,
    rimWidth: 0.1,
    edgeLine: 0.8,
    tint: "#ffffff",
    opacity: 0,
    canvasOpacity: 0.6,
  },
  light: {
    background: "#ffffff00",
    rimColor: "#a011ff",
    rim: 0.8,
    rimWidth: 0.6,
    edgeLine: 1.8,
    tint: "#0b0b14",
    opacity: 0,
    canvasOpacity: 0.6,
  },
} as const;

export function PlasmaField({ children }: { children: ReactNode }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  const mode = mounted && resolvedTheme === "light" ? "light" : "dark";
  const t = THEMES[mode];

  return (
    <PlasmaProvider
      canvas={false}
      theme={mode}
      ground="clear"
      background={t.background}
      viscosity={0.5}
      stretch={0}
      flow={0}
      radius={26}
      elevation={0.35}
      blend={40}
      smoothness={1}
      refraction={2.5}
      dispersion={2}
      rim={t.rim}
      rimColor={t.rimColor}
      tint={t.tint}
      opacity={t.opacity}
      rimWidth={t.rimWidth}
      highlight={1}
      edgeLine={t.edgeLine}
      shimmer={1}
      glow={1}
      wash={0}
      grain={1}
      backgroundBlur={0}
      pointerDrop
      pointerPull
      ambientDrops={false}
      formOut
      freezeOnScroll
    >
      <PlasmaCanvas style={{ zIndex: "var(--z-plasma)", opacity: t.canvasOpacity }} />
      {children}
    </PlasmaProvider>
  );
}
