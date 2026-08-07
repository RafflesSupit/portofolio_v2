"use client";

import { Component, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Canvas, useFrame, type RootState } from "@react-three/fiber";
import * as THREE from "three";

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uPointer;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 5; i++) {
      value += amplitude * noise(p);
      p *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    vec2 uv = vec2(vUv.x, 1.0 - vUv.y);
    float aspect = uResolution.x / uResolution.y;
    vec2 st = uv * vec2(aspect, 1.0) * 2.2;
    st += (uPointer - 0.5) * 0.1;

    vec2 driftA = vec2(uTime * 0.07, -uTime * 0.05);
    vec2 q = vec2(fbm(st + driftA), fbm(st + driftA + vec2(5.2, 1.3)));

    vec2 driftB = vec2(uTime * 0.09, uTime * 0.075);
    vec2 r = vec2(
      fbm(st + 3.2 * q + driftB + vec2(1.7, 9.2)),
      fbm(st + 3.2 * q + driftB + vec2(8.3, 2.8))
    );

    float f = fbm(st + 3.6 * r);

    vec3 bg = vec3(0.043, 0.043, 0.051);
    vec3 deepTeal = vec3(0.055, 0.486, 0.525);
    vec3 teal = vec3(0.310, 0.820, 0.780);
    vec3 paleTeal = vec3(0.561, 0.902, 0.871);

    vec3 col = mix(bg, deepTeal, smoothstep(0.15, 0.55, f));
    col = mix(col, teal, smoothstep(0.45, 0.75, f) * 0.6);
    col = mix(col, paleTeal, smoothstep(0.65, 0.95, length(r)) * 0.35);

    float vignette = smoothstep(1.1, 0.2, length(uv - 0.5) * 1.4);
    col *= mix(0.7, 1.0, vignette);

    gl_FragColor = vec4(col, 1.0);
  }
`;

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl")
    );
  } catch {
    return false;
  }
}

function detectGPURenderer(): string {
  try {
    const canvas = document.createElement("canvas");
    const gl = (canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    if (!gl) return "";
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    if (!info) return "";
    return String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL) ?? "");
  } catch {
    return "";
  }
}

// Cheap heuristics checked before mounting the canvas at all -- none of
// these are individually reliable (deviceMemory is Chrome/Edge-only,
// hardwareConcurrency and pointer type are only loose proxies), so a
// software/GPU-less renderer or reduced-motion/save-data is treated as a
// strong signal on its own, while core count and memory only count when
// combined with a coarse pointer (i.e. likely mobile).
function isLikelyLowPower(): boolean {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;

  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  if (connection?.saveData) return true;

  if (/swiftshader|software|llvmpipe/i.test(detectGPURenderer())) return true;

  const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const cores = navigator.hardwareConcurrency ?? 8;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;

  if (isCoarsePointer && cores <= 4) return true;
  if (isCoarsePointer && memory !== undefined && memory <= 4) return true;

  return false;
}

class WebGLErrorBoundary extends Component<
  { children: ReactNode; onError: () => void },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.warn("Hero WebGL scene failed to initialize, falling back to static gradient.", error);
    this.props.onError();
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

function FogField({ isFinePointer, onLowFps }: { isFinePointer: boolean; onLowFps: () => void }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const pointerTarget = useRef({ x: 0.5, y: 0.4 });
  const pointerSmooth = useRef({ x: 0.5, y: 0.4 });
  const fpsSampleStart = useRef<number | null>(null);
  const fpsSampleFrames = useRef(0);
  const fpsReported = useRef(false);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uPointer: { value: new THREE.Vector2(0.5, 0.4) },
    }),
    [],
  );

  useEffect(() => {
    if (!isFinePointer) return;
    function handlePointerMove(e: PointerEvent) {
      pointerTarget.current.x = e.clientX / window.innerWidth;
      pointerTarget.current.y = e.clientY / window.innerHeight;
    }
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [isFinePointer]);

  useFrame((state) => {
    const material = materialRef.current;
    if (!material) return;
    pointerSmooth.current.x += (pointerTarget.current.x - pointerSmooth.current.x) * 0.03;
    pointerSmooth.current.y += (pointerTarget.current.y - pointerSmooth.current.y) * 0.03;
    material.uniforms.uTime.value = state.clock.elapsedTime;
    material.uniforms.uResolution.value.set(state.size.width, state.size.height);
    material.uniforms.uPointer.value.set(pointerSmooth.current.x, pointerSmooth.current.y);

    // Hardware/GPU heuristics can't catch every slow device (thermal
    // throttling, background load, an unlisted GPU). Sample real frame
    // pacing over the first ~60 frames and drop to the static fallback if
    // it's actually running slow, instead of trusting the upfront guess.
    if (!fpsReported.current) {
      if (fpsSampleStart.current === null) fpsSampleStart.current = state.clock.elapsedTime;
      fpsSampleFrames.current += 1;
      if (fpsSampleFrames.current === 60) {
        const elapsed = state.clock.elapsedTime - fpsSampleStart.current;
        const fps = 60 / elapsed;
        fpsReported.current = true;
        if (fps < 30) onLowFps();
      }
    }
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

export function HeroScene() {
  const [webglReady] = useState(() => supportsWebGL() && !isLikelyLowPower());
  const [isFinePointer] = useState(() => window.matchMedia("(pointer: fine)").matches);
  const [canvasKey, setCanvasKey] = useState(0);
  const [disabled, setDisabled] = useState(false);

  const handleLowFps = useCallback(() => setDisabled(true), []);

  // WebGL context loss is a normal, recoverable event (GPU driver reset, tab
  // backgrounding, resource pressure) -- it never throws, so React's error
  // boundary can't see it. Without an explicit listener here the canvas is
  // left mounted but blank (opaque black, since nothing is drawing into it)
  // until a full page reload. `preventDefault()` on the loss event is also
  // required for the browser to attempt automatic restoration at all.
  const handleCreated = useCallback((state: RootState) => {
    const canvas = state.gl.domElement;

    function handleLost(event: Event) {
      event.preventDefault();
      setDisabled(true);
    }

    function handleRestored() {
      setDisabled(false);
      setCanvasKey((key) => key + 1);
    }

    canvas.addEventListener("webglcontextlost", handleLost, false);
    canvas.addEventListener("webglcontextrestored", handleRestored, false);
  }, []);

  if (!webglReady || disabled) return null;

  return (
    <WebGLErrorBoundary key={canvasKey} onError={() => setDisabled(true)}>
      <Canvas
        gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
        dpr={[1, 2]}
        className="absolute inset-0 h-full w-full"
        onCreated={handleCreated}
      >
        <FogField isFinePointer={isFinePointer} onLowFps={handleLowFps} />
      </Canvas>
    </WebGLErrorBoundary>
  );
}
