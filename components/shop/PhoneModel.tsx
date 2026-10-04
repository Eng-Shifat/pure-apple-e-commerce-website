"use client";

import { Component, Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { Plus, Minus, RotateCcw } from "lucide-react";

type DragState = {
  dragging: boolean;
  lastX: number;
  lastY: number;
  dx: number; // pending horizontal drag (px)
  dy: number; // pending vertical drag (px)
  velocity: number; // inertia (rad/frame)
  lastInteraction: number;
  zoom: number; // zoom target (1 = normal) – set by pinch / ctrl+wheel
};

// "sway": the pair gently swings around the showcase pose (recommended)
// "spin": the pair keeps rotating left-to-right, a full 360° turn
const AUTO_MODE: "sway" | "spin" = "spin";
const AUTO_SPEED = 0.5; // rad/second, used by "spin" (~12.5 s per full turn)
const SWAY_AMOUNT = 0.32; // radians each side, used by "sway"
const SWAY_SPEED = 0.55;
const RESUME_DELAY = 1500; // ms after release before auto motion resumes
const ZOOM_MIN = 0.7; // pinch / wheel zoom limits
const ZOOM_MAX = 2.4;

// Showcase pose: the back-view phone sits behind-left, the front-view phone
// sits in front-right, both fanned outward and overlapping (like a product render).
const POSE = {
  front: { x: 0.026, y: 0, z: 0.014, yaw: 0.36 },
  back: { x: -0.026, y: 0.004, z: -0.014, yaw: Math.PI - 0.36 },
};

// If a model file is missing/broken, show nothing in the 3D area instead of
// crashing the whole page. Resets automatically when the slide (model) changes.
class ModelBoundary extends Component<{ children: ReactNode; url: string; onFail?: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.warn("[PhoneModel] could not load", this.props.url, error);
    this.props.onFail?.();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

// Checks the file exists BEFORE three.js tries to load it, so a wrong file name /
// wrong folder shows a clear console message instead of a red error screen.
const existsCache = new Map<string, boolean>();
function useModelExists(url: string) {
  const [ok, setOk] = useState<boolean | undefined>(existsCache.get(url));
  useEffect(() => {
    if (existsCache.has(url)) {
      setOk(existsCache.get(url));
      return;
    }
    let cancelled = false;
    setOk(undefined);
    fetch(url, { method: "HEAD" })
      .then((r) => r.ok)
      .catch(() => false)
      .then((good) => {
        existsCache.set(url, good);
        if (!good) console.warn(`[PhoneModel] 3D file not found: ${url} — put the .glb inside public/models/ with exactly this name.`);
        if (!cancelled) setOk(good);
      });
    return () => {
      cancelled = true;
    };
  }, [url]);
  return ok;
}

// ── Model registry ────────────────────────────────────────────
// Add a new model: drop the .glb in public/models/ and (optionally) list it here.
//  - fit:  true  → the model is centred and auto-scaled to fit the panel (recommended)
//          false → use the fixed `scale` below (the old two-phone model)
//  - auto: "spin" = keeps turning 360°, "sway" = gently swings left/right
//  - pose: true → arranges the old front/back phone pair (only for iphone.glb)
type ModelCfg = { fit: boolean; scale?: number; auto: "spin" | "sway"; pose?: boolean };
const MODELS: Record<string, ModelCfg> = {
  "/models/iphone.glb": { fit: false, scale: 11.5, auto: "spin", pose: true },
  "/models/apple-iphone-duo.glb": { fit: true, auto: "sway" },
};
const DEFAULT_CFG: ModelCfg = { fit: true, auto: "sway" };
const cfgOf = (url: string) => MODELS[url] ?? DEFAULT_CFG;

function IPhone({ drag, url }: { drag: any; url: string }) {
  const { scene } = useGLTF(url);
  const cfg = cfgOf(url);
  const { size } = useThree();
  const ref = useRef<THREE.Group>(null); // drag / auto rotation
  const intro = useRef<THREE.Group>(null); // pop-in when the slide changes
  const t = useRef(0);
  const zoomCur = useRef(1); // smoothed zoom actually applied

  // size of the canvas decides how big the model may be
  const aspect = size.width / Math.max(size.height, 1);
  const visH = 2 * 4.2 * Math.tan(THREE.MathUtils.degToRad(38 / 2)); // visible height at z=0
  const visW = visH * aspect;

  // measure the model once (cached on the scene so re-visits don't re-measure)
  const box = useMemo(() => {
    if (!scene.userData._box) {
      scene.updateMatrixWorld(true);
      const bb = new THREE.Box3().setFromObject(scene);
      scene.userData._box = { center: bb.getCenter(new THREE.Vector3()), size: bb.getSize(new THREE.Vector3()) };
    }
    return scene.userData._box as { center: THREE.Vector3; size: THREE.Vector3 };
  }, [scene]);

  let fitScale: number;
  if (cfg.fit) {
    // wide, short canvas (phones) → let the model use more of the height
    const hFrac = aspect > 1.2 ? 0.88 : 0.74;
    fitScale = Math.min((visW * 0.84) / box.size.x, (visH * hFrac) / box.size.y);
  } else {
    // legacy: fixed scale, slightly larger on short canvases and smaller on narrow ones
    const base = size.height >= 450 ? 1 : 1.05;
    fitScale = (cfg.scale ?? 1) * base * THREE.MathUtils.clamp(aspect / 0.8, 0.7, 1);
  }
  const offset = cfg.fit ? box.center.clone().multiplyScalar(-fitScale) : new THREE.Vector3(0, 0.1, 0);

  // Kill glare + expensive materials (works for any model, matched by material name):
  //  - glass overlays on the screen are hidden
  //  - the display becomes an unlit material so lights can never wash the wallpaper out
  //  - any "transmission" glass (forces a full extra render pass) becomes plain see-through glass
  useEffect(() => {
    const swap = new Map<THREE.Material, THREE.Material>();
    const norm = (n: string) => n.toLowerCase().replace(/\u0441/g, "c").trim(); // Cyrillic "с" → latin "c"
    scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;
      const apply = (m: THREE.Material) => {
        const name = norm(m.name || "");
        if (name === "screen glass" || name === "glass screen" || name === "setka") {
          m.visible = false;
          return m;
        }
        if (name.startsWith("screen")) {
          if (!swap.has(m)) {
            const src = m as THREE.MeshStandardMaterial;
            if (src.map) src.map.colorSpace = THREE.SRGBColorSpace;
            swap.set(
              m,
              new THREE.MeshBasicMaterial({
                map: src.map ?? null,
                color: src.map ? 0xffffff : 0x050507,
                toneMapped: false,
                side: src.side,
              })
            );
          }
          return swap.get(m)!;
        }
        if ((m as THREE.MeshPhysicalMaterial).transmission > 0) {
          const glass = (m as THREE.MeshPhysicalMaterial).clone();
          glass.transmission = 0;
          glass.thickness = 0;
          glass.transparent = true;
          glass.opacity = 0.25;
          glass.depthWrite = false;
          return glass;
        }
        return m;
      };
      mesh.material = Array.isArray(mesh.material)
        ? mesh.material.map(apply)
        : apply(mesh.material);
    });
  }, [scene]);

  // Old two-phone model only: arrange front/back phones into the showcase pose
  useEffect(() => {
    if (!cfg.pose) return;
    const roots: THREE.Object3D[] = [];
    scene.traverse((o) => {
      if (o.children.length >= 10 && roots.length < 2) roots.push(o);
    });
    if (roots.length < 2) return;
    const [front, back] = roots[0].position.x >= roots[1].position.x ? roots : [roots[1], roots[0]];
    front.position.set(POSE.front.x, POSE.front.y, POSE.front.z);
    front.rotation.set(0, POSE.front.yaw, 0);
    back.position.set(POSE.back.x, POSE.back.y, POSE.back.z);
    back.rotation.set(0, POSE.back.yaw, 0);
  }, [scene, cfg.pose]);

  useFrame(({ clock }, delta) => {
    // pop-in animation (runs every time a new model appears)
    if (intro.current && t.current < 1) {
      t.current = Math.min(1, t.current + delta / 0.85);
      const e = 1 - Math.pow(1 - t.current, 3);
      intro.current.scale.setScalar(0.72 + 0.28 * e);
      intro.current.rotation.y = (1 - e) * -1.1;
    }

    const g = ref.current;
    if (!g) return;
    const d: DragState = drag.current;

    // smooth pinch / wheel zoom (scale + re-centre so the model zooms around its middle)
    zoomCur.current += (d.zoom - zoomCur.current) * Math.min(1, delta * 12);
    const s = fitScale * zoomCur.current;
    g.scale.setScalar(s);
    if (cfg.fit) g.position.set(-box.center.x * s, -box.center.y * s, -box.center.z * s);

    if (d.dragging) {
      g.rotation.y += d.dx * 0.01;
      g.rotation.x = THREE.MathUtils.clamp(g.rotation.x + d.dy * 0.006, -0.6, 0.6);
      d.velocity = d.dx * 0.01;
      d.dx = 0;
      d.dy = 0;
      return;
    }

    if (Math.abs(d.velocity) > 0.0005) {
      g.rotation.y += d.velocity;
      d.velocity *= 0.95;
    } else if (performance.now() - d.lastInteraction > RESUME_DELAY) {
      if (cfg.auto === "spin") {
        g.rotation.y += AUTO_SPEED * delta;
      } else {
        g.rotation.y = THREE.MathUtils.euclideanModulo(g.rotation.y + Math.PI, Math.PI * 2) - Math.PI;
        const target = Math.sin(clock.elapsedTime * SWAY_SPEED) * SWAY_AMOUNT;
        g.rotation.y += (target - g.rotation.y) * 0.05;
      }
    }

    g.rotation.x *= 0.92;
  });

  return (
    <group ref={intro} scale={0.72}>
      <group ref={ref} scale={fitScale} position={offset}>
        <primitive object={scene} />
      </group>
    </group>
  );
}

function Stand() {
  return (
    <group position={[0, -2.1, 0]}>
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.04, 0.05, 0.3, 32]} />
        <meshStandardMaterial color="#9aa0a6" metalness={0.95} roughness={0.1} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.55, 0.06, 64]} />
        <meshStandardMaterial color="#c3c7cb" metalness={0.95} roughness={0.1} />
      </mesh>
      {/* Blue glow ring */}
      <mesh position={[0, -0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.42, 0.6, 64]} />
        <meshStandardMaterial
          color="#FB5724"
          emissive="#FB5724"
          emissiveIntensity={1.2}
          transparent
          opacity={0.5}
        />
      </mesh>
    </group>
  );
}

export default function PhoneModel({ fill = false, model = "/models/apple-iphone-duo.glb" }: { fill?: boolean; model?: string }) {
  const drag = useRef<DragState>({
    dragging: false,
    lastX: 0,
    lastY: 0,
    dx: 0,
    dy: 0,
    velocity: 0,
    lastInteraction: 0,
    zoom: 1,
  });
  const wrapRef = useRef<HTMLDivElement>(null);
  const modelOk = useModelExists(model);
  const [badFile, setBadFile] = useState<string | null>(null); // file exists but could not be read
  const [inView, setInView] = useState(true);
  const [shown, setShown] = useState(false);

  // Stop rendering the 3D scene while it is scrolled out of view
  // Warm the cache for the other slides' models once the first one is on screen,
  // so switching slides is instant without slowing the first load.
  useEffect(() => {
    const id = setTimeout(() => Object.keys(MODELS).forEach((u) => fetch(u, { priority: "low" } as RequestInit).catch(() => {})), 3500);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: "80px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // on-screen zoom buttons (always work: touch, mouse, emulator)
  const zoomBy = (f: number) => {
    const d = drag.current;
    d.zoom = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, d.zoom * f));
    d.lastInteraction = performance.now();
  };
  const zoomReset = () => {
    drag.current.zoom = 1;
    drag.current.lastInteraction = performance.now();
  };

  // a new slide/model always starts un-zoomed
  useEffect(() => {
    drag.current.zoom = 1;
  }, [model]);

  // Touch / mouse controls:
  //  1 finger (or mouse) drag → rotate 360°
  //  2 fingers pinch          → zoom in / out
  //  ctrl + wheel (trackpad pinch on desktop) → zoom
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const d = drag.current;

    const pts = new Map<number, { x: number; y: number }>();
    let pinchDist = 1;
    let pinchZoom = 1;
    const clampZoom = (z: number) => Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, z));
    const pinchNow = () => {
      const [a, b] = Array.from(pts.values());
      return Math.hypot(a.x - b.x, a.y - b.y) || 1;
    };

    const down = (e: PointerEvent) => {
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      try {
        el.setPointerCapture(e.pointerId);
      } catch {}
      d.velocity = 0;
      if (pts.size === 1) {
        d.dragging = true;
        d.lastX = e.clientX;
        d.lastY = e.clientY;
        el.style.cursor = "grabbing";
      } else if (pts.size === 2) {
        d.dragging = false; // second finger → pinch instead of rotate
        pinchDist = pinchNow();
        pinchZoom = d.zoom;
      }
    };
    const move = (e: PointerEvent) => {
      const p = pts.get(e.pointerId);
      if (!p) return;
      p.x = e.clientX;
      p.y = e.clientY;
      if (pts.size >= 2) {
        d.zoom = clampZoom((pinchZoom * pinchNow()) / pinchDist);
        d.lastInteraction = performance.now();
        return;
      }
      if (!d.dragging) return;
      d.dx += e.clientX - d.lastX;
      d.dy += e.clientY - d.lastY;
      d.lastX = e.clientX;
      d.lastY = e.clientY;
    };
    const up = (e: PointerEvent) => {
      if (!pts.delete(e.pointerId)) return;
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
      d.lastInteraction = performance.now();
      if (pts.size === 1) {
        // one finger left after a pinch → carry on rotating with it (no jump)
        const r = Array.from(pts.values())[0];
        d.dragging = true;
        d.lastX = r.x;
        d.lastY = r.y;
        d.dx = 0;
        d.dy = 0;
      } else if (pts.size === 0) {
        d.dragging = false;
        el.style.cursor = "grab";
      }
    };
    const wheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return; // plain wheel keeps scrolling the page
      e.preventDefault();
      d.zoom = clampZoom(d.zoom * Math.exp(-e.deltaY * 0.01));
      d.lastInteraction = performance.now();
    };

    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    el.addEventListener("wheel", wheel, { passive: false });
    return () => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
      el.removeEventListener("wheel", wheel);
    };
  }, []);

  return (
    <>
    <div
      ref={wrapRef}
      data-no-swipe
      className={
        fill
          ? "absolute inset-0 select-none"
          : "relative w-full max-w-[420px] h-[270px] sm:h-[360px] lg:w-[420px] lg:h-[500px] select-none"
      }
      style={{
        cursor: "grab",
        touchAction: "pan-y",
      }}
    >
      <Suspense
        fallback={
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin" />
          </div>
        }
      >
        <Canvas
          camera={{ position: [0, 0, 4.2], fov: 38 }}
          style={{ background: "transparent", opacity: shown ? 1 : 0, transition: "opacity 0.6s ease" }}
          dpr={[1, 1.5]}
          frameloop={inView ? "always" : "never"}
          gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0);
            setShown(true);
          }}
        >
          {/* Lighting setup — premium studio feel */}
          <ambientLight intensity={0.4} />
          <directionalLight position={[4, 6, 4]} intensity={1.8} />
          <directionalLight position={[-4, 2, -3]} intensity={0.5} color="#FFC48A" />
          <pointLight position={[0, 4, 3]} intensity={1} color="#ffffff" />
          <pointLight position={[2, -2, 2]} intensity={0.4} color="#FFB27A" />
          <pointLight position={[-2, -1, -2]} intensity={0.3} color="#FFE3A8" />

          {/* Rim light for premium edge highlight */}
          <spotLight
            position={[-3, 3, -2]}
            angle={0.4}
            penumbra={1}
            intensity={1.2}
            color="#FFD08A"
          />


          <Environment files="/models/studio.hdr" />

          {modelOk && (
            <ModelBoundary key={model} url={model} onFail={() => setBadFile(model)}>
              <Suspense fallback={null}>
                <IPhone drag={drag} url={model} />
              </Suspense>
            </ModelBoundary>
          )}

          <Stand />

          <ContactShadows
            position={[0, -2.3, 0]}
            opacity={0.4}
            scale={4}
            blur={2.5}
            far={2.5}
            resolution={256}
            color="#C2410C"
          />
        </Canvas>
      </Suspense>

      {/* Development helper: tells you why the 3D area is empty (never shown in production) */}
      {process.env.NODE_ENV !== "production" && (modelOk === false || badFile === model) && (
        <div className="absolute inset-x-4 top-1/3 text-center text-[11px] leading-relaxed text-white/60 pointer-events-none">
          {modelOk === false ? "3D file not found:" : "3D file could not be read:"}
          <br />
          <span className="text-brand-300 font-mono break-all">{model}</span>
          <br />
          {modelOk === false
            ? "Put it in public/models/ with exactly this name."
            : "Open the browser console for details."}
        </div>
      )}
    </div>

    {/* Zoom buttons (outside the drag area so taps are never mistaken for a rotate) */}
    {fill && (
      <div className="absolute top-2.5 right-2.5 z-10 flex flex-col gap-1.5">
        {[
          { label: "Zoom in", onClick: () => zoomBy(1.3), icon: <Plus size={16} /> },
          { label: "Zoom out", onClick: () => zoomBy(1 / 1.3), icon: <Minus size={16} /> },
          { label: "Reset zoom", onClick: zoomReset, icon: <RotateCcw size={14} /> },
        ].map((b) => (
          <button
            key={b.label}
            type="button"
            aria-label={b.label}
            onClick={b.onClick}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 active:scale-90 backdrop-blur-md border border-white/20 text-white/90 transition"
          >
            {b.icon}
          </button>
        ))}
      </div>
    )}
    </>
  );
}

// (other models are preloaded a few seconds after the first one is shown – see PhoneModel)
