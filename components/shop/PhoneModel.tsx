"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, ContactShadows, PresentationControls } from "@react-three/drei";
import * as THREE from "three";

function IPhone({ ...props }: any) {
  const { scene } = useGLTF("/models/iphone.glb");
  const ref = useRef<THREE.Group>(null);

  useFrame(() => {
    if (ref.current) {
      // Right to left rotation (negative = right to left)
      ref.current.rotation.y -= 0.006;
    }
  });

  return (
    <group ref={ref} {...props}>
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
  return (
    <div className="relative w-72 h-[480px] lg:w-80 lg:h-[520px]">
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

          <PresentationControls
            global
            snap
            zoom={1}
            rotation={[0.05, 0, 0]}
            polar={[-Math.PI / 8, Math.PI / 8]}
            azimuth={[-Math.PI, Math.PI]}
          >
            <IPhone scale={10.5} position={[0, 0.3, 0]} />
          </PresentationControls>

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
