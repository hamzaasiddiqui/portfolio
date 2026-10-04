"use client";

import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { useTheme } from "next-themes";
import { FigureScene } from "@/components/three/figure-scene";

export function FigureCanvas({ present }: { present: boolean }) {
  const { resolvedTheme } = useTheme();
  const [tabVisible, setTabVisible] = useState(true);
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    const onVisibility = () => setTabVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const running = tabVisible && (present || !settled);

  return (
    <Canvas
      style={{ pointerEvents: "none" }}
      frameloop={running ? "always" : "never"}
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 5], fov: 30 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
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
