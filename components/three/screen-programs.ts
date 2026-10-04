import * as THREE from "three";

export type Program = "static" | "eyes" | "code" | "terminal" | "signal";

const WIDTH = 512;
const HEIGHT = 384;
const MONO = '22px "JetBrains Mono", ui-monospace, monospace';

const TERMINAL: { text: string; tone: "prompt" | "ok" | "note" }[] = [
  { text: "$ pnpm build", tone: "prompt" },
  { text: "  compiling 214 modules", tone: "note" },
  { text: "  ✓ 4 routes prerendered", tone: "ok" },
  { text: "$ tsc --noEmit", tone: "prompt" },
  { text: "  ✓ no type errors", tone: "ok" },
  { text: "$ vitest run --silent", tone: "prompt" },
  { text: "  ✓ 38 passed  0 failed", tone: "ok" },
  { text: "  watching for changes", tone: "note" },
];

const CODE = [
  "export function useFrameLoop(fn) {",
  "  const raf = useRef(0)",
  "  useEffect(() => {",
  "    const tick = (t) => {",
  "      fn(t - last)",
  "      raf.current = requestAnimationFrame(tick)",
  "    }",
  "    return () => cancelAnimationFrame(raf.current)",
  "  }, [fn])",
  "}",
  "",
  "const signal = await tune(channel)",
  "if (!signal.locked) return retry(channel)",
  "",
  "// compositing pass",
  "for (const frame of stream) {",
  "  const noise = frame.grain * 0.42",
  "  composite(frame, { noise, scanlines: true })",
  "}",
];

const KEYWORDS = /\b(const|await|if|export|function|return|new|for|of)\b/g;

export class ScreenPainter {
  readonly texture: THREE.CanvasTexture;

  private readonly context: CanvasRenderingContext2D;
  private accent = "#ff4d94";
  private lastPaint = -1;

  constructor() {
    const canvas = document.createElement("canvas");
    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    const context = canvas.getContext("2d");
    if (!context) throw new Error("2D canvas unavailable for the screen texture");
    this.context = context;

    this.texture = new THREE.CanvasTexture(canvas);
    this.texture.colorSpace = THREE.SRGBColorSpace;
    this.texture.minFilter = THREE.LinearFilter;
    this.texture.magFilter = THREE.LinearFilter;
  }

  setAccent(hex: string) {
    this.accent = hex;
  }

  dispose() {
    this.texture.dispose();
  }

  paint(program: Program, time: number, blink: number) {
    if (time - this.lastPaint < 1 / 18) return;
    this.lastPaint = time;

    const ctx = this.context;
    ctx.fillStyle = "#07070a";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    switch (program) {
      case "eyes":
        this.paintEyes(time, blink);
        break;
      case "terminal":
        this.paintTerminal(time);
        break;
      case "code":
        this.paintCode(time);
        break;
      case "signal":
        this.paintSignal(time);
        break;
      case "static":
        break;
    }

    this.texture.needsUpdate = true;
  }

  private paintEyes(time: number, blink: number) {
    const ctx = this.context;
    const open = Math.max(1 - blink, 0.04);
    const drift = Math.sin(time * 0.45) * 7;

    const draw = (cx: number, radius: number) => {
      ctx.save();
      ctx.translate(cx, HEIGHT * 0.5);
      ctx.scale(1, open);

      const glow = ctx.createRadialGradient(0, 0, radius * 0.05, 0, 0, radius * 1.6);
      glow.addColorStop(0, "#ffffff");
      glow.addColorStop(0.46, "#ffffff");
      glow.addColorStop(0.66, "rgba(255,255,255,0.55)");
      glow.addColorStop(0.84, "rgba(255,255,255,0.14)");
      glow.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(0, 0, radius * 1.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    draw(WIDTH * 0.33 + drift, 56);
    draw(WIDTH * 0.67 + drift, 56);
  }

  private paintTerminal(time: number) {
    const ctx = this.context;
    ctx.font = MONO;
    ctx.textBaseline = "middle";

    const revealed = Math.min(TERMINAL.length, Math.floor((time % 14) / 1.1) + 1);
    const start = Math.max(0, revealed - 8);
    let y = 40;

    for (let i = start; i < revealed; i += 1) {
      const line = TERMINAL[i];
      ctx.fillStyle =
        line.tone === "prompt"
          ? "rgba(255,255,255,0.86)"
          : line.tone === "ok"
            ? this.accent
            : "rgba(255,255,255,0.38)";
      ctx.fillText(line.text, 24, y);
      y += 40;
    }

    if (Math.floor(time * 2) % 2 === 0) {
      ctx.fillStyle = this.accent;
      ctx.fillRect(24, y - 11, 12, 22);
    }
  }

  private paintCode(time: number) {
    const ctx = this.context;
    ctx.font = MONO;
    ctx.textBaseline = "middle";

    const rowHeight = 40;
    const offset = (time * 26) % rowHeight;
    const first = Math.floor((time * 26) / rowHeight);

    for (let row = 0; row < HEIGHT / rowHeight + 1; row += 1) {
      const line = CODE[(first + row) % CODE.length];
      const y = 34 + row * rowHeight - offset;

      ctx.fillStyle = "rgba(255,255,255,0.2)";
      ctx.fillText(String((first + row) % 99).padStart(2, "0"), 18, y);

      if (line.startsWith("//")) {
        ctx.fillStyle = "rgba(255,255,255,0.3)";
        ctx.fillText(line, 62, y);
        continue;
      }

      let x = 62;
      for (const token of line.split(/(\s+)/)) {
        KEYWORDS.lastIndex = 0;
        ctx.fillStyle = KEYWORDS.test(token) ? this.accent : "rgba(255,255,255,0.72)";
        ctx.fillText(token, x, y);
        x += ctx.measureText(token).width;
      }
    }

    if (Math.floor(time * 2) % 2 === 0) {
      ctx.fillStyle = this.accent;
      ctx.fillRect(62, HEIGHT - 52, 12, 26);
    }
  }

  private paintSignal(time: number) {
    const ctx = this.context;
    ctx.strokeStyle = this.accent;
    ctx.lineWidth = 2;
    ctx.beginPath();

    for (let x = 0; x <= WIDTH; x += 4) {
      const t = x / WIDTH;
      const y =
        HEIGHT * 0.5 +
        Math.sin(t * 22 + time * 3) * 46 * Math.sin(t * Math.PI) +
        Math.sin(t * 61 - time * 7) * 12;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    ctx.fillStyle = "rgba(255,255,255,0.25)";
    ctx.font = MONO;
    ctx.fillText("NO SIGNAL", 22, HEIGHT - 30);
  }
}
