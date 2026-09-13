"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { RoundedBox, useGLTF } from "@react-three/drei";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { SCREEN_FRAGMENT, SCREEN_VERTEX, createScreenUniforms } from "@/components/three/screen-shader";
import { ScreenPainter, type Program } from "@/components/three/screen-programs";

/**
 * Head scan by Lee Perry-Smith (Infinite Realities), CC BY 3.0 — the credit
 * line in components/layout/credit.tsx is what satisfies that licence. Only
 * the shoulders and neck survive: the scan is clipped below the chin and a CRT
 * stands in for the head.
 */
const MODEL_URL = "/models/head.glb";

useGLTF.preload(MODEL_URL);

const PALETTE = {
  light: {
    skin: "#ded8d1",
    shell: "#9a9aa6",
    baseFade: 0.5,
    accent: "#a41bff",
    ground: "#ffffff",
    ambient: 0.5,
    key: 1.7,
    rim: "#ffffff",
    rimIntensity: 0.8,
    spill: 1.4,
  },
  dark: {
    skin: "#c3bdb5",
    shell: "#565663",
    baseFade: 0.36,
    accent: "#ff4d94",
    ground: "#0d0d0f",
    ambient: 0.09,
    key: 1.55,
    rim: "#ff4d94",
    rimIntensity: 3.4,
    spill: 2.4,
  },
} as const;

/* Geometry below is in the scan's own units: it spans x ±4.28, y ±3.97, with
   the chin near y = 0. The neck is cut just under it and the CRT hangs low
   enough that its case swallows the stump. */
const NECK_CUT = -0.55;
const CASE = { width: 4.85, height: 4.0, depth: 3.9, radius: 0.2 };
/** Depth of the front housing; everything behind it is the funnel. */
const FACE_DEPTH = 1.15;
const FUNNEL_DEPTH = 2.75;
/** The tube's throat: square-ish, with the edges well filleted. */
const THROAT = { width: 1.15, height: 0.95, radius: 0.34 };
/** Z of the housing's back face, where the funnel starts. */
const FUNNEL_Z = CASE.depth / 2 - FACE_DEPTH;
const FACE_Z = CASE.depth / 2 - FACE_DEPTH / 2;
const CASE_CENTRE: [number, number, number] = [0, NECK_CUT + CASE.height / 2 - 0.28, 0.12];

/** Share of the viewport's height the whole figure occupies. */
const HEIGHT_FRACTION = 0.46;
/** Where it stands, as a fraction of the viewport's width from centre. */
const X_FRACTION = -0.225;

/** The broadcast. Hard cuts, never crossfades — a tube switching feeds. */
interface Shot {
  program: Program;
  hold: number;
}

const SEQUENCE: Shot[] = [
  { program: "static", hold: 0.9 },
  { program: "code", hold: 5.5 },
  { program: "eyes", hold: 3 },
  { program: "terminal", hold: 5 },
  { program: "static", hold: 0.4 },
  { program: "code", hold: 4.5 },
  { program: "signal", hold: 2.6 },
  { program: "eyes", hold: 2.6 },
  { program: "static", hold: 0.4 },
  { program: "terminal", hold: 4 },
];

/** One ring of a rounded rectangle, counter-clockwise from the top right. */
function roundedRectRing(halfWidth: number, halfHeight: number, corner: number, perCorner: number) {
  const radius = Math.min(corner, halfWidth, halfHeight);
  const centres: [number, number, number][] = [
    [halfWidth - radius, halfHeight - radius, 0],
    [-(halfWidth - radius), halfHeight - radius, Math.PI / 2],
    [-(halfWidth - radius), -(halfHeight - radius), Math.PI],
    [halfWidth - radius, -(halfHeight - radius), (3 * Math.PI) / 2],
  ];

  const points: [number, number][] = [];
  for (const [cx, cy, start] of centres) {
    for (let i = 0; i <= perCorner; i += 1) {
      const angle = start + (i / perCorner) * (Math.PI / 2);
      points.push([cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius]);
    }
  }
  return points;
}

/**
 * The tube behind the glass. Lofted from the housing's own outline back to a
 * small square throat: flat sides, filleted edges, and — because every ring is
 * a rounded rectangle rather than a circle pushed into one — an outline that
 * can never bulge past the housing it sits behind.
 */
function buildFunnel() {
  const RINGS = 12;
  const PER_CORNER = 5;
  const perRing = 4 * (PER_CORNER + 1);

  const positions: number[] = [];
  for (let ring = 0; ring <= RINGS; ring += 1) {
    const t = ring / RINGS;
    // Eased, not linear: a CRT's glass flares fast off the screen and then
    // runs almost straight back to the neck.
    const k = Math.pow(t, 0.7);
    const halfWidth = THREE.MathUtils.lerp(CASE.width / 2, THROAT.width, k);
    const halfHeight = THREE.MathUtils.lerp(CASE.height / 2, THROAT.height, k);
    const corner = THREE.MathUtils.lerp(CASE.radius, THROAT.radius, k);

    for (const [x, y] of roundedRectRing(halfWidth, halfHeight, corner, PER_CORNER)) {
      positions.push(x, y, -t * FUNNEL_DEPTH);
    }
  }

  const index: number[] = [];
  for (let ring = 0; ring < RINGS; ring += 1) {
    for (let i = 0; i < perRing; i += 1) {
      const a = ring * perRing + i;
      const b = ring * perRing + ((i + 1) % perRing);
      const c = (ring + 1) * perRing + i;
      const d = (ring + 1) * perRing + ((i + 1) % perRing);
      index.push(a, b, c, b, d, c);
    }
  }

  // Cap the throat so the tube is not an open pipe when seen from behind.
  const centre = positions.length / 3;
  positions.push(0, 0, -FUNNEL_DEPTH);
  const lastRing = RINGS * perRing;
  for (let i = 0; i < perRing; i += 1) {
    index.push(centre, lastRing + ((i + 1) % perRing), lastRing + i);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(index);
  geometry.computeVertexNormals();
  return geometry;
}

/**
 * Patches a standard material with the two things the stock one cannot do:
 * a noise dissolve that eats the figure from below like it is sinking into
 * the page, and a falloff that lets its base disappear into the dark instead
 * of ending on a hard silhouette edge. Both are shared uniforms, so the body
 * and the tube are consumed on exactly the same waterline.
 */
function patchForDissolve(material: THREE.MeshStandardMaterial, uniforms: Record<string, THREE.IUniform>) {
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);

    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vWorldPosition;")
      .replace(
        "#include <begin_vertex>",
        "#include <begin_vertex>\n  vWorldPosition = (modelMatrix * vec4(transformed, 1.0)).xyz;"
      );

    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>
         varying vec3 vWorldPosition;
         uniform float uWave;
         uniform float uFadeBottom;
         uniform float uFadeTop;
         uniform vec3 uEdge;
         uniform vec3 uGround;
         float dHash(vec3 p) { return fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 43758.5453); }`
      )
      .replace(
        "#include <dithering_fragment>",
        `#include <dithering_fragment>
         float dn = dHash(floor(vWorldPosition * 26.0));
         float level = vWorldPosition.y - uWave + (dn - 0.5) * 0.22;
         if (level < 0.0) discard;
         gl_FragColor.rgb = mix(uEdge, gl_FragColor.rgb, smoothstep(0.0, 0.18, level));
         gl_FragColor.rgb = mix(uGround, gl_FragColor.rgb, smoothstep(uFadeBottom, uFadeTop, vWorldPosition.y));`
      );
  };
  material.customProgramCacheKey = () => "figure-dissolve";
  material.needsUpdate = true;
}

/**
 * The mutable three.js objects behind the figure: shader uniforms, the shared
 * dissolve uniforms, the screen painter and the clipping plane. They live at
 * module scope, created once, because every one of them is written to on every
 * frame — which is precisely what a value produced by useMemo or read from a
 * ref during render may not be. There is only ever one figure on the page, so
 * a single instance is the honest model.
 */
interface SharedResources {
  uniforms: ReturnType<typeof createScreenUniforms>;
  dissolve: {
    uWave: THREE.IUniform<number>;
    uFadeBottom: THREE.IUniform<number>;
    uFadeTop: THREE.IUniform<number>;
    uEdge: THREE.IUniform<THREE.Color>;
    uGround: THREE.IUniform<THREE.Color>;
  };
  painter: ScreenPainter;
  clipPlane: THREE.Plane;
  localPlane: THREE.Plane;
}

let resources: SharedResources | null = null;

function sharedResources(): SharedResources {
  resources ??= {
    uniforms: createScreenUniforms(),
    dissolve: {
      uWave: { value: -999 },
      uFadeBottom: { value: -1 },
      uFadeTop: { value: 1 },
      uEdge: { value: new THREE.Color("#ff4d94") },
      uGround: { value: new THREE.Color("#0d0d0f") },
    },
    painter: new ScreenPainter(),
    // Clipping planes are world-space, so the plane the material uses is
    // re-derived from the figure's matrix every frame; `localPlane` is the
    // definition it is derived from.
    clipPlane: new THREE.Plane(new THREE.Vector3(0, -1, 0), NECK_CUT),
    localPlane: new THREE.Plane(new THREE.Vector3(0, -1, 0), NECK_CUT),
  };
  return resources;
}

export function FigureScene({
  isDark,
  present,
  onSettledChange,
}: {
  isDark: boolean;
  present: boolean;
  onSettledChange: (settled: boolean) => void;
}) {
  const root = useRef<THREE.Group>(null);
  const yaw = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const screen = useRef<THREE.Mesh>(null);

  const { scene } = useGLTF(MODEL_URL);
  const { viewport } = useThree();
  const reducedMotion = useReducedMotion();
  const [hovered, setHovered] = useState(false);

  const palette = PALETTE[isDark ? "dark" : "light"];

  useLayoutEffect(() => {
    const { uniforms, dissolve, painter } = sharedResources();
    uniforms.uScreen.value = painter.texture;
    painter.setAccent(palette.accent);
    uniforms.uAccent.value.set(palette.accent);
    uniforms.uEdge.value.set(palette.accent);
    dissolve.uEdge.value.set(palette.accent);
    dissolve.uGround.value.set(palette.ground);
  }, [palette.accent, palette.ground]);

  // Both materials are built in code rather than in JSX, because they have to
  // be patched before their first compile.
  const skinRef = useRef<THREE.MeshStandardMaterial | null>(null);

  const shellMaterial = useMemo(() => {
    const material = new THREE.MeshStandardMaterial({
      color: palette.shell,
      roughness: 0.62,
      metalness: 0,
    });
    patchForDissolve(material, sharedResources().dissolve);
    return material;
  }, [palette.shell]);

  useEffect(() => () => shellMaterial.dispose(), [shellMaterial]);

  // Fittings: near-black for knobs, vents and cable, and one lit pinprick for
  // the power lamp. Both are patched too, so they are eaten by the same wave
  // as the case rather than hanging in the air after it has gone.
  const trimMaterial = useMemo(() => {
    const material = new THREE.MeshStandardMaterial({ color: "#141419", roughness: 0.5, metalness: 0 });
    patchForDissolve(material, sharedResources().dissolve);
    return material;
  }, []);

  const lampMaterial = useMemo(() => {
    const material = new THREE.MeshStandardMaterial({
      color: palette.accent,
      emissive: new THREE.Color(palette.accent),
      emissiveIntensity: 2.4,
      roughness: 0.4,
      metalness: 0,
    });
    patchForDissolve(material, sharedResources().dissolve);
    return material;
  }, [palette.accent]);

  useEffect(() => {
    return () => {
      trimMaterial.dispose();
      lampMaterial.dispose();
    };
  }, [trimMaterial, lampMaterial]);

  const funnel = useMemo(() => buildFunnel(), []);

  // The cap is the skin colour but carries no clipping plane of its own — it
  // lives below the cut and exists precisely to close it.
  const neckCapMaterial = useMemo(() => {
    const material = new THREE.MeshStandardMaterial({
      color: palette.skin,
      roughness: 0.92,
      metalness: 0,
    });
    patchForDissolve(material, sharedResources().dissolve);
    return material;
  }, [palette.skin]);

  useEffect(() => () => neckCapMaterial.dispose(), [neckCapMaterial]);

  useEffect(() => () => funnel.dispose(), [funnel]);

  // Cables drooping out of the back of the case and over the shoulders. Built
  // as tubes along a spline rather than modelled, so they cost nothing to ship.
  const cables = useMemo(() => {
    const tube = (points: [number, number, number][], radius: number) =>
      new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3(points.map(([x, y, z]) => new THREE.Vector3(x, y, z))),
        44,
        radius,
        7,
        false
      );

    return [
      // A long loop off the visible cheek, doubling back on itself before it
      // falls — slack cable, not a wire diagram.
      tube(
        [
          [1.5, -0.4, -1.9],
          [2.6, -0.9, -1.6],
          [2.9, -1.9, -1.6],
          [2.4, -2.6, -1.9],
          [2.5, -3.6, -2.4],
          [1.9, -4.6, -2.8],
        ],
        0.055
      ),
      tube(
        [
          [1.2, -0.9, -2.0],
          [2.4, -1.6, -1.8],
          [2.6, -2.8, -2.0],
          [1.8, -3.8, -2.5],
          [1.3, -4.8, -2.9],
        ],
        0.045
      ),
      tube(
        [
          [0.6, -2.0, -2.1],
          [1.7, -3.2, -2.1],
          [1.1, -4.3, -2.6],
        ],
        0.05
      ),
      tube(
        [
          [-1.1, -1.9, -2.0],
          [-2.3, -3.0, -2.0],
          [-1.8, -4.0, -2.5],
          [-1.0, -4.9, -2.9],
        ],
        0.06
      ),
      tube(
        [
          [-0.2, -2.1, -2.2],
          [-0.8, -3.3, -2.3],
          [0.0, -4.4, -2.8],
        ],
        0.04
      ),
    ];
  }, []);

  useEffect(() => {
    const geometries = cables;
    return () => geometries.forEach((geometry) => geometry.dispose());
  }, [cables]);

  useLayoutEffect(() => {
    const skin = new THREE.MeshStandardMaterial({
      color: palette.skin,
      roughness: 0.92,
      metalness: 0,
      clippingPlanes: [sharedResources().clipPlane],
      // The cut leaves the neck open, so the inside of the shoulders would
      // otherwise vanish when seen from below.
      side: THREE.DoubleSide,
    });
    patchForDissolve(skin, sharedResources().dissolve);
    skinRef.current = skin;

    scene.traverse((object) => {
      if (object instanceof THREE.Mesh) object.material = skin;
    });

    return () => {
      skin.dispose();
      skinRef.current = null;
    };
  }, [scene, palette.skin]);

  // Fit the whole composition — shoulders plus CRT — to the viewport height.
  const fit = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    box.max.y = NECK_CUT;
    box.expandByPoint(
      new THREE.Vector3(
        CASE_CENTRE[0] - CASE.width / 2,
        CASE_CENTRE[1] - CASE.height / 2,
        CASE_CENTRE[2] - CASE.depth / 2
      )
    );
    box.expandByPoint(
      new THREE.Vector3(
        CASE_CENTRE[0] + CASE.width / 2,
        CASE_CENTRE[1] + CASE.height / 2,
        CASE_CENTRE[2] + CASE.depth / 2
      )
    );

    const size = box.getSize(new THREE.Vector3());
    const centre = box.getCenter(new THREE.Vector3());
    const height = viewport.height * HEIGHT_FRACTION;
    const scale = height / (size.y || 1);
    return {
      scale,
      height,
      offset: new THREE.Vector3(-centre.x * scale, -centre.y * scale, -centre.z * scale),
    };
  }, [scene, viewport.height]);

  const pointer = useRef({ x: 0, y: 0 });
  const presence = useRef(0);
  const power = useRef(0);
  const glitch = useRef(0);
  const shot = useRef({ index: 0, until: 0, blinkAt: 0, blink: 0 });
  const leftAt = useRef(0);
  const wasPresent = useRef(false);
  const settled = useRef(false);

  useEffect(() => {
    if (reducedMotion) return;

    const onMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reducedMotion]);

  useEffect(() => {
    document.body.style.cursor = hovered && present ? "pointer" : "";
    return () => {
      document.body.style.cursor = "";
    };
  }, [hovered, present]);

  const onClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    if (reducedMotion) return;
    // Interference, not applause: the signal breaks up and the feed cuts.
    glitch.current = 1;
    shot.current.until = 0;
  };

  useFrame((state, rawDelta) => {
    const { uniforms, dissolve, painter, clipPlane, localPlane } = sharedResources();
    const group = root.current;
    const body = yaw.current;
    const crt = head.current;
    const screenMesh = screen.current;
    if (!group || !body || !crt || !screenMesh) return;

    // Clamp: a backgrounded tab returns with a delta of seconds, which would
    // teleport every damped value below in a single frame.
    const delta = Math.min(rawDelta, 0.1);
    const time = state.clock.elapsedTime;

    if (present !== wasPresent.current) {
      wasPresent.current = present;
      if (!present) leftAt.current = time;
      if (settled.current) {
        settled.current = false;
        onSettledChange(false);
      }
    }

    // Leaving is fast and staged: the tube cuts out, and a beat later the
    // background takes the figure. Arriving is slower — it surfaces.
    const dissolving = present || time > leftAt.current + 0.1;
    if (dissolving) {
      presence.current = THREE.MathUtils.damp(presence.current, present ? 1 : 0, present ? 2.6 : 7, delta);
    }
    power.current = THREE.MathUtils.damp(power.current, present ? 1 : 0, present ? 1.8 : 14, delta);
    glitch.current = THREE.MathUtils.damp(glitch.current, 0, 3.4, delta);

    const p = presence.current;

    // The waterline sweeps from below the figure to above its head as it
    // leaves, and back down as it returns.
    const bottom = -fit.height / 2;
    const top = fit.height / 2;
    dissolve.uWave.value = THREE.MathUtils.lerp(top + 0.25, bottom - 0.25, p);
    dissolve.uFadeBottom.value = bottom - 0.02;
    dissolve.uFadeTop.value = bottom + fit.height * palette.baseFade;
    uniforms.uWave.value = dissolve.uWave.value;

    // Keep the neck cut glued to the figure as it turns.
    body.updateWorldMatrix(true, false);
    clipPlane.copy(localPlane).applyMatrix4(body.matrixWorld);

    const u = screenMesh.material as THREE.ShaderMaterial;
    u.uniforms.uTime.value = time;
    u.uniforms.uPower.value = reducedMotion ? p : power.current;
    u.uniforms.uGlitch.value = glitch.current;

    if (reducedMotion) {
      u.uniforms.uStatic.value = 0.04;
      painter.paint("eyes", 0, 0);
      body.rotation.y = 0;
      crt.rotation.set(0, 0, 0);
      return;
    }

    // Run the broadcast only while the tube is on.
    const cut = shot.current;
    if (power.current > 0.35) {
      if (time > cut.until) {
        cut.index = (cut.index + 1) % SEQUENCE.length;
        cut.until = time + SEQUENCE[cut.index].hold;
        cut.blinkAt = time + 0.8 + Math.random() * 2;
      }

      const frame = SEQUENCE[cut.index];
      if (time > cut.blinkAt) {
        cut.blink = 1;
        cut.blinkAt = time + 1.6 + Math.random() * 3.5;
      }
      cut.blink = THREE.MathUtils.damp(cut.blink, 0, 9, delta);

      u.uniforms.uStatic.value = Math.max(frame.program === "static" ? 1 : 0.05, glitch.current);
      painter.paint(frame.program, time, cut.blink);
    }

    // Tracking, properly: the body leans, the tube turns nearly twice as far
    // and lags a beat behind, and the whole figure shifts a little — enough
    // parallax that it reads as watching you rather than as a still.
    const aim = pointer.current.x * p;
    const tilt = pointer.current.y * p;
    // The figure stands well left of the canvas centre, so under perspective a
    // tube pointed down -Z reads as facing away to the left. This turns it
    // back toward the reader first; the tracking below is measured from there.
    const facing = Math.atan2(-group.position.x, state.camera.position.z - group.position.z);

    // The neck is part of the scan, so it cannot bend — the bust has to turn
    // with the tube or the head shears off it. The body carries most of the
    // rotation and the head only leads it by a little.
    const look = facing * 0.72 + aim * 0.42;
    body.rotation.y = THREE.MathUtils.damp(body.rotation.y, look * 0.82, 5, delta);
    crt.rotation.y = THREE.MathUtils.damp(crt.rotation.y, look * 0.18, 6.5, delta);
    crt.rotation.x = THREE.MathUtils.damp(crt.rotation.x, tilt * 0.2, 6, delta);
    crt.position.x = THREE.MathUtils.damp(crt.position.x, CASE_CENTRE[0] + aim * 0.3, 4.5, delta);

    group.position.x = X_FRACTION * viewport.width + aim * 0.06;
    group.position.y = Math.sin(time * 0.4) * 0.025 * p + tilt * -0.03;

    // Tell the canvas when there is nothing left to draw, so it can stop the
    // loop entirely rather than rendering a figure that has already gone.
    if (!present && !settled.current && p < 0.002 && glitch.current < 0.01) {
      settled.current = true;
      onSettledChange(true);
    }
  });

  return (
    <>
      <ambientLight intensity={palette.ambient} />
      {/* Key from front-left, well above: it carves the shoulders and leaves
          the base in shadow, which is what puts the figure in a dark room
          rather than on a white sweep. */}
      <directionalLight position={[3, 5.5, 4]} intensity={palette.key} />
      {/* Rim from behind, in the accent: separates the silhouette from a
          background of the same value without lighting the front. */}
      <pointLight
        position={[-2.6, 1.6, -3.2]}
        color={palette.rim}
        intensity={palette.rimIntensity}
        distance={9}
      />
      {/* The tube's own spill onto the case and shoulders. */}
      <pointLight position={[0, 1.15, 2.1]} color={palette.accent} intensity={palette.spill} distance={3.4} />

      <group ref={root}>
        <group ref={yaw} scale={fit.scale} position={fit.offset}>
          <primitive object={scene} />

          {/* The clip leaves the neck open at the top. Tilting the chassis up
              opens a gap and you see straight into it, so the stump is capped
              just under the cut — in the body group, not the head, so it stays
              put while the tube moves. */}
          <mesh position={[0, NECK_CUT - 0.06, 0.05]} scale={[1, 1, 0.92]}>
            <cylinderGeometry args={[0.86, 0.86, 0.12, 24]} />
            <primitive object={neckCapMaterial} attach="material" />
          </mesh>

          {/* The head group sits at the collar, and the chassis hangs above
              it, so pitch rotates about the mount the way a real one would —
              tilting up lifts the face and swings the tube back, instead of
              pushing the bottom edge through the neck. */}
          <group ref={head} position={[CASE_CENTRE[0], CASE_CENTRE[1] - CASE.height / 2, CASE_CENTRE[2]]}>
            <group position={[0, CASE.height / 2, 0]}>
            {/* A CRT is not a cube: a shallow housing carries the glass, and
                behind it the tube funnels back to a narrow square throat with
                the electron gun's neck on the end. */}
            <RoundedBox
              args={[CASE.width, CASE.height, FACE_DEPTH]}
              radius={CASE.radius}
              smoothness={4}
              position={[0, 0, FACE_Z]}
              onClick={onClick}
              onPointerOver={() => setHovered(true)}
              onPointerOut={() => setHovered(false)}
            >
              <primitive object={shellMaterial} attach="material" />
            </RoundedBox>

            <mesh geometry={funnel} position={[0, 0, FUNNEL_Z]}>
              <primitive object={shellMaterial} attach="material" />
            </mesh>

            <mesh position={[0, 0, FUNNEL_Z - FUNNEL_DEPTH - 0.28]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.4, 0.48, 0.6, 16]} />
              <primitive object={trimMaterial} attach="material" />
            </mesh>

            {/* Fittings. A blank box reads as a prop; a bezel, ridges, a
                speaker, knobs and a lamp row read as equipment someone keeps
                running. */}

            {/* Dark surround behind the glass, sitting a hair proud of the
                case so the tube reads as recessed into it rather than painted
                on. Kept flat: any depth here would occlude the domed glass. */}
            <mesh position={[0, 0.12, CASE.depth / 2 + 0.01]}>
              <planeGeometry args={[CASE.width * 0.87, CASE.height * 0.76]} />
              <primitive object={trimMaterial} attach="material" />
            </mesh>

            {/* Corner brackets clamping the glass into the face. */}
            {[
              [-1, -1],
              [1, -1],
              [-1, 1],
              [1, 1],
            ].map(([sx, sy]) => (
              <group
                key={`${sx}${sy}`}
                position={[sx * CASE.width * 0.41, 0.12 + sy * CASE.height * 0.355, CASE.depth / 2 + 0.1]}
              >
                <mesh position={[sx * -0.22, 0, 0]}>
                  <boxGeometry args={[0.52, 0.09, 0.07]} />
                  <primitive object={trimMaterial} attach="material" />
                </mesh>
                <mesh position={[0, sy * -0.2, 0]}>
                  <boxGeometry args={[0.09, 0.46, 0.07]} />
                  <primitive object={trimMaterial} attach="material" />
                </mesh>
              </group>
            ))}

            {/* Ridges across the crown, and a carry bar above them. */}
            {[FACE_Z - 0.34, FACE_Z, FACE_Z + 0.34].map((z) => (
              <mesh key={z} position={[0, CASE.height / 2 - 0.02, z]}>
                <boxGeometry args={[CASE.width * 0.86, 0.09, 0.12]} />
                <primitive object={trimMaterial} attach="material" />
              </mesh>
            ))}
            <mesh position={[0, CASE.height / 2 + 0.1, FACE_Z - 0.15]}>
              <boxGeometry args={[CASE.width * 0.66, 0.22, 0.9]} />
              <primitive object={trimMaterial} attach="material" />
            </mesh>
            {/* Speaker disc on the cheek the reader actually sees — the head
                stands left of centre and turns toward the camera, so its +X
                side is the one on show. */}
            <group position={[CASE.width / 2 + 0.06, 0.1, FACE_Z]} rotation={[0, 0, Math.PI / 2]}>
              <mesh>
                <cylinderGeometry args={[0.62, 0.62, 0.18, 28]} />
                <primitive object={trimMaterial} attach="material" />
              </mesh>
              <mesh position={[0, 0.06, 0]}>
                <cylinderGeometry args={[0.34, 0.34, 0.14, 24]} />
                <primitive object={shellMaterial} attach="material" />
              </mesh>
            </group>

            {/* Controls and the lamp row along the bottom bezel. */}
            <group position={[0, -CASE.height / 2 + 0.36, CASE.depth / 2 - 0.05]}>
              {[-2.05, -1.6, -1.15].map((x) => (
                <mesh key={x} position={[x, 0, 0.08]} rotation={[Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.14, 0.14, 0.16, 16]} />
                  <primitive object={trimMaterial} attach="material" />
                </mesh>
              ))}

              {[0.9, 1.2, 1.5, 1.8, 2.1].map((x, index) => (
                <mesh key={x} position={[x, 0.02, 0.08]}>
                  <boxGeometry args={[0.16, 0.09, 0.06]} />
                  <primitive object={index < 2 ? lampMaterial : trimMaterial} attach="material" />
                </mesh>
              ))}
            </group>

            {/* Vent slots down the far cheek. */}
            <group position={[-CASE.width / 2 + 0.02, 0.2, FACE_Z]}>
              {[-0.55, -0.2, 0.15, 0.5].map((y) => (
                <mesh key={y} position={[0, y, 0]}>
                  <boxGeometry args={[0.06, 0.09, 0.85]} />
                  <primitive object={trimMaterial} attach="material" />
                </mesh>
              ))}
            </group>

            {cables.map((geometry, index) => (
              <mesh key={index} geometry={geometry}>
                <primitive object={trimMaterial} attach="material" />
              </mesh>
            ))}

            {/* The picture, inset into the case so the shell reads as a bezel. */}
            <mesh ref={screen} position={[0, 0.12, CASE.depth / 2 + 0.045]}>
              <planeGeometry args={[CASE.width * 0.83, CASE.height * 0.72, 32, 26]} />
              <shaderMaterial
                args={[
                  {
                    uniforms: sharedResources().uniforms,
                    vertexShader: SCREEN_VERTEX,
                    fragmentShader: SCREEN_FRAGMENT,
                  },
                ]}
              />
            </mesh>
            </group>
          </group>
        </group>
      </group>
    </>
  );
}
