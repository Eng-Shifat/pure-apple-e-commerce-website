"use client";

import { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

type DragState = {
  dragging: boolean;
  lastX: number;
  lastY: number;
  dx: number; // pending horizontal drag (px)
  dy: number; // pending vertical drag (px)
  velocity: number; // inertia (rad/frame)
  lastInteraction: number;
};

const AUTO_SPEED = 0.006; // right to left
const RESUME_DELAY = 1500; // ms after release before auto-rotate resumes

function IPhone({ drag, scale = 1, ...props }: any) {
  const { scene } = useGLTF("/models/iphone.glb");
  // Slightly larger on the shorter mobile canvases so the phones fill the space
  const { size } = useThree();
  const fit = size.height >= 450 ? 1 : 1.2;
  const ref = useRef<THREE.Group>(null);

  // Kill all glare on the phones:
  //  - "Screen glass" (transmission layer) and "Setka" (glare overlay PNG) are hidden
  //  - the display ("Screen") becomes an unlit material, so lights / environment
  //    can never wash the wallpaper out with white reflections
  useEffect(() => {
    const swap = new Map<THREE.Material, THREE.Material>();
    scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;
      const apply = (m: THREE.Material) => {
        const name = (m.name || "").toLowerCase().trim();
        if (name === "screen glass" || name === "setka") {
          m.visible = false;
          return m;
        }
        if (name === "screen") {
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
        return m;
      };
      mesh.material = Array.isArray(mesh.material)
        ? mesh.material.map(apply)
        : apply(mesh.material);
    });
  }, [scene]);

  useFrame(() => {
    const g = ref.current;
    if (!g) return;
    const d: DragState = drag.current;

    if (d.dragging) {
      g.rotation.y += d.dx * 0.01;
      g.rotation.x = THREE.MathUtils.clamp(g.rotation.x + d.dy * 0.006, -0.6, 0.6);
      d.velocity = d.dx * 0.01;
      d.dx = 0;
      d.dy = 0;
      return;
    }

    // inertia after release
    if (Math.abs(d.velocity) > 0.0005) {
      g.rotation.y += d.velocity;
      d.velocity *= 0.95;
    } else if (performance.now() - d.lastInteraction > RESUME_DELAY) {
      g.rotation.y -= AUTO_SPEED;
    }

    // ease tilt back to upright
    g.rotation.x *= 0.92;
  });

  return (
    <group ref={ref} scale={scale * fit} {...props}>
      <primitive object={scene} />
    </group>
  );
}

function Stand() {
  return (
    <group position={[0, -2.1, 0]}>
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.04, 0.05, 0.3, 32]} />
        <meshStandardMaterial color="#8896b0" metalness={0.95} roughness={0.1} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.55, 0.06, 64]} />
        <meshStandardMaterial color="#a0b0cc" metalness={0.95} roughness={0.1} />
      </mesh>
      {/* Blue glow ring */}
      <mesh position={[0, -0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.42, 0.6, 64]} />
        <meshStandardMaterial
          color="#3366ff"
          emissive="#2255ff"
          emissiveIntensity={1.2}
          transparent
          opacity={0.5}
        />
      </mesh>
    </group>
  );
}

export default function PhoneModel() {
  const drag = useRef<DragState>({
    dragging: false,
    lastX: 0,
    lastY: 0,
    dx: 0,
    dy: 0,
    velocity: 0,
    lastInteraction: 0,
  });
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const d = drag.current;

    const down = (e: PointerEvent) => {
      d.dragging = true;
      d.lastX = e.clientX;
      d.lastY = e.clientY;
      d.velocity = 0;
      el.setPointerCapture(e.pointerId);
      el.style.cursor = "grabbing";
    };
    const move = (e: PointerEvent) => {
      if (!d.dragging) return;
      d.dx += e.clientX - d.lastX;
      d.dy += e.clientY - d.lastY;
      d.lastX = e.clientX;
      d.lastY = e.clientY;
    };
    const up = (e: PointerEvent) => {
      if (!d.dragging) return;
      d.dragging = false;
      d.lastInteraction = performance.now();
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
      el.style.cursor = "grab";
    };

    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    return () => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      data-no-swipe
      className="relative w-full max-w-[420px] h-[270px] sm:h-[360px] lg:w-[420px] lg:h-[500px] select-none"
      style={{ cursor: "grab", touchAction: "pan-y" }}
    >
      <Suspense
        fallback={
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
        }
      >
        <Canvas
          camera={{ position: [0, 0, 4.2], fov: 38 }}
          style={{ background: "transparent" }}
          gl={{ alpha: true, antialias: true }}
          onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
          shadows
        >
          {/* Lighting setup — premium studio feel */}
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[4, 6, 4]}
            intensity={1.8}
            castShadow
            shadow-mapSize={[2048, 2048]}
          />
          <directionalLight position={[-4, 2, -3]} intensity={0.5} color="#6699ff" />
          <pointLight position={[0, 4, 3]} intensity={1} color="#ffffff" />
          <pointLight position={[2, -2, 2]} intensity={0.4} color="#4466ff" />
          <pointLight position={[-2, -1, -2]} intensity={0.3} color="#aabbff" />

          {/* Rim light for premium edge highlight */}
          <spotLight
            position={[-3, 3, -2]}
            angle={0.4}
            penumbra={1}
            intensity={1.2}
            color="#88aaff"
          />


          <Environment preset="studio" />

          <IPhone drag={drag} scale={11.5} position={[0, 0.1, 0]} />

          <Stand />

          <ContactShadows
            position={[0, -2.3, 0]}
            opacity={0.4}
            scale={4}
            blur={2.5}
            far={2.5}
            color="#1133cc"
          />
        </Canvas>
      </Suspense>
    </div>
  );
}

useGLTF.preload("/models/iphone.glb");
