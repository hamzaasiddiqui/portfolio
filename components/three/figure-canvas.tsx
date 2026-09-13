"use client";

import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { useTheme } from "next-themes";
import { FigureScene } from "@/components/three/figure-scene";

export function FigureCanvas({ present }: { present: boolean }) {
  const { resolvedTheme } = useTheme();
  const [tabVisible, setTabVisible] = useState(true);
  // The scene raises this once it has finished dissolving; it lowers it again
  // the moment anything starts moving. Both calls come from the frame loop,
  // which is a callback — the one place a flag like this can be set from.
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    const onVisibility = () => setTabVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  // Runs while the figure is on screen or still animating off it, and stops
  // dead afterwards: no rAF, no draw calls, nothing for a hidden tab.
  const running = tabVisible && (present || !settled);

  return (
    <Canvas
      frameloop={running ? "always" : "never"}
      // A 3x buffer buys nothing on a matte surface lit by one tube.
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 5], fov: 30 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      // The scan is cut off below the chin with a clipping plane, which needs
      // local clipping switched on at the renderer.
      onCreated={({ gl }) => {
        gl.localClippingEnabled = true;
      }}
    >
      <Suspense fallback={null}>
        <FigureScene isDark={resolvedTheme !== "light"} present={present} onSettledChange={setSettled} />
      </Suspense>
    </Canvas>
  );
}
