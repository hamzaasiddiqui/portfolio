import * as THREE from "three";

/**
 * The glass. The picture itself arrives as a canvas texture (see
 * screen-programs.ts); everything here is what a tube does to it — curvature,
 * bleed, scanlines, grain, the roll bar, the power-off collapse — plus the
 * same height-based dissolve the body uses, so screen and figure are consumed
 * by the background together.
 */
export const SCREEN_VERTEX = /* glsl */ `
  uniform float uCurve;

  varying vec2 vUv;
  varying vec3 vWorldPosition;

  void main() {
    vUv = uv;

    // The glass is actually domed, not a flat plane with a barrel filter: the
    // centre stands proud of the corners, so the bezel shadows the edges and
    // highlights slide across it as the head turns.
    vec2 offset = uv - 0.5;
    vec3 domed = position;
    domed.z += (0.25 - dot(offset, offset)) * uCurve;

    vec4 world = modelMatrix * vec4(domed, 1.0);
    vWorldPosition = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

export const SCREEN_FRAGMENT = /* glsl */ `
  precision highp float;

  uniform sampler2D uScreen;
  uniform float uTime;
  uniform float uPower;    // 1 = on, 0 = off. Drives the CRT collapse.
  uniform float uStatic;   // 0..1 grain over the picture.
  uniform float uGlitch;   // 0..1 tearing and bleed.
  uniform float uWave;     // World height the dissolve has eaten up to.
  uniform vec3  uAccent;
  uniform vec3  uEdge;

  varying vec2 vUv;
  varying vec3 vWorldPosition;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float hash3(vec3 p) {
    return fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
  }

  void main() {
    // Consumed from below: identical maths to the body material, so the
    // waterline crosses both at the same instant.
    float n = hash3(floor(vWorldPosition * 26.0));
    float level = vWorldPosition.y - uWave + (n - 0.5) * 0.22;
    if (level < 0.0) discard;

    float p = clamp(uPower, 0.0, 1.0);

    // Power-off: squeeze the picture into a line before it goes.
    float squeeze = max(p * p, 1e-4);
    vec2 uv = vec2(vUv.x, (vUv.y - 0.5) / squeeze + 0.5);
    float inside = step(0.0, uv.y) * step(uv.y, 1.0);

    // A whisper of optical distortion on top of the domed geometry — the
    // glass does the curving now, this only bends the raster a little.
    vec2 centred = uv - 0.5;
    uv = 0.5 + centred * (1.0 + 0.018 * dot(centred, centred));

    // Rows slipping sideways.
    float row = floor(uv.y * 46.0);
    uv.x += (hash(vec2(row, floor(uTime * 15.0))) - 0.5) * 0.16 * uGlitch;

    // Colour bleed, wider while the signal is breaking up.
    float bleed = 0.0018 + 0.006 * uGlitch;
    vec3 picture;
    picture.r = texture2D(uScreen, uv + vec2(bleed, 0.0)).r;
    picture.g = texture2D(uScreen, uv).g;
    picture.b = texture2D(uScreen, uv - vec2(bleed, 0.0)).b;

    // Chromatic snow: three independent channels, then pushed toward the
    // accent or a cold blue in alternating bands, so a dead channel is still
    // colour rather than grey mush.
    vec2 cell = floor(uv * vec2(190.0, 140.0)) + floor(uTime * 26.0);
    vec3 snow = vec3(hash(cell), hash(cell + 17.1), hash(cell + 41.7));
    float band = step(0.0, sin(uv.y * 9.0 - uTime * 1.7));
    vec3 tint = mix(vec3(0.34, 0.68, 1.0), uAccent, band);
    snow = mix(snow, snow * tint * 1.8, 0.6);
    picture = mix(picture, snow, uStatic);

    // Occasional rows drop a channel and shift — the tube losing its grip.
    float torn = step(0.982, hash(vec2(floor(uv.y * 34.0), floor(uTime * 3.0))));
    picture = mix(picture, picture.gbr * 1.35 + 0.06, torn * 0.85);

    // The roll bar drifting up the tube.
    float roll = fract(uv.y + uTime * 0.07);
    picture *= 1.0 + 0.07 * smoothstep(0.03, 0.0, abs(roll - 0.5));

    picture *= 0.82 + 0.18 * sin(uv.y * 320.0);
    picture *= 1.35;
    picture *= smoothstep(1.25, 0.32, length(vUv - 0.5) * 1.7);
    picture += uAccent * 0.09 + vec3(0.012, 0.014, 0.02);
    picture *= inside;

    // The flash as the line snaps shut, gated so a fully-off tube is black.
    float flash = smoothstep(0.34, 0.02, p) * smoothstep(0.0, 0.06, p);
    picture += vec3(1.0) * flash * smoothstep(0.02, 0.0, abs(vUv.y - 0.5));

    // The bright meniscus riding the dissolve line.
    picture = mix(uEdge, picture, smoothstep(0.0, 0.18, level));

    gl_FragColor = vec4(picture, 1.0);
  }
`;

export function createScreenUniforms() {
  return {
    uScreen: { value: null as THREE.Texture | null },
    uTime: { value: 0 },
    uPower: { value: 0 },
    uStatic: { value: 1 },
    uGlitch: { value: 0 },
    uWave: { value: -999 },
    uCurve: { value: 0.16 },
    uAccent: { value: new THREE.Color("#ff4d94") },
    uEdge: { value: new THREE.Color("#ff4d94") },
  };
}

export type ScreenUniforms = ReturnType<typeof createScreenUniforms>;
