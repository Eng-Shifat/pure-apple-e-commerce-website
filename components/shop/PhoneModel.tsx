"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, ContactShadows, PresentationControls } from "@react-three/drei";
import * as THREE from "three";

// ── 3D Phone ──────────────────────────────────────────
function IPhone({ ...props }: any) {
  const { scene } = useGLTF("/models/iphone.glb");
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (ref.current) {
      // Continuous 360° Y-axis rotation
      ref.current.rotation.y += 0.008;
      // Subtle floating up and down
      ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.05;
    }
  });

  return (
    <group ref={ref} {...props}>
      <primitive object={scene} />
    </group>
  );
}

// ── Premium Stand ──────────────────────────────────────
function Stand() {
  return (
    <group position={[0, -1.45, 0]}>
      {/* Neck */}
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.03, 0.04, 0.25, 32]} />
        <meshStandardMaterial color="#a0aec0" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Base disc */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.35, 0.4, 0.05, 64]} />
        <meshStandardMaterial color="#b0bec5" metalness={0.9} roughness={0.15} />
      </mesh>
      {/* Glow ring under base */}
      <mesh position={[0, -0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.3, 0.45, 64]} />
        <meshStandardMaterial
          color="#4466ff"
          emissive="#2244ff"
          emissiveIntensity={0.6}
          transparent
          opacity={0.4}
        />
      </mesh>
    </group>
  );
}

// ── Loading Spinner ────────────────────────────────────
function Loader() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-3">
      <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      <p className="text-blue-400 text-xs font-medium">Loading 3D Model...</p>
    </div>
  );
}

// ── Main Export ────────────────────────────────────────
export default function PhoneModel() {
  return (
    <div className="relative w-56 h-96 lg:w-64 lg:h-[420px]">
      <Suspense fallback={<Loader />}>
        <Canvas
          camera={{ position: [0, 0, 3.5], fov: 40 }}
          style={{ background: "transparent" }}
          gl={{ alpha: true, antialias: true }}
        >
          {/* Lighting */}
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
          <directionalLight position={[-5, 3, -5]} intensity={0.4} color="#4466ff" />
          <pointLight position={[0, 3, 2]} intensity={0.8} color="#ffffff" />
          <pointLight position={[0, -2, 2]} intensity={0.3} color="#4466ff" />

          {/* Environment for reflections */}
          <Environment preset="city" />

          {/* Drag to rotate */}
          <PresentationControls
            global
            snap={{ mass: 2, tension: 300 }}
            zoom={1}
            rotation={[0, 0, 0]}
            polar={[-Math.PI / 6, Math.PI / 6]}
            azimuth={[-Math.PI, Math.PI]}
          >
            {/* Phone model */}
            <IPhone scale={8} position={[0, 0.2, 0]} />
          </PresentationControls>

          {/* Premium stand */}
          <Stand />

          {/* Floor shadow */}
          <ContactShadows
            position={[0, -1.6, 0]}
            opacity={0.35}
            scale={3}
            blur={2}
            far={2}
            color="#2244ff"
          />
        </Canvas>
      </Suspense>
    </div>
  );
}

// Preload model
useGLTF.preload("/models/iphone.glb");
