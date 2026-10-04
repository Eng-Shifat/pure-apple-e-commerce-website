"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function SplashScreen() {
  const [phase, setPhase] = useState<"enter" | "hold" | "exit" | "done">("enter");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"), 100);
    const t2 = setTimeout(() => setPhase("exit"), 2200);
    const t3 = setTimeout(() => setPhase("done"), 2900);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  if (phase === "done") return null;

  const shown = phase !== "enter";

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        background: "#ffffff",
        transition: "opacity 0.7s ease",
        opacity: phase === "exit" ? 0 : 1,
        pointerEvents: phase === "exit" ? "none" : "auto",
      }}
    >
      {/* Logo — apple + leaf only, revealed top → bottom */}
      <div
        style={{
          position: "relative",
          width: "min(220px, 56vw)",
          aspectRatio: "2319 / 2368",
          transition: "transform 1.4s cubic-bezier(0.22, 1, 0.36, 1)",
          transform: shown ? "scale(1)" : "scale(0.9)",
        }}
      >
        <Image
          src="/logo/pure-apple-logo.svg"
          alt="Pure Apple"
          fill
          priority
          sizes="220px"
          style={{
            objectFit: "contain",
            clipPath: shown ? "inset(0 0 0 0)" : "inset(0 0 100% 0)",
            opacity: shown ? 1 : 0,
            transition:
              "clip-path 1.5s cubic-bezier(0.65, 0, 0.35, 1), opacity 0.5s ease",
          }}
        />
      </div>

      {/* Tagline */}
      <p
        style={{
          marginTop: 28,
          fontSize: 12,
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          color: "#9ca3af",
          fontWeight: 500,
          transition: "opacity 0.8s ease 1.1s, transform 0.8s ease 1.1s",
          opacity: shown ? 1 : 0,
          transform: shown ? "translateY(0)" : "translateY(8px)",
        }}
      >
        Better Tech, Brighter Tomorrow
      </p>

      {/* Slim progress line */}
      <div
        style={{
          position: "absolute", bottom: 56, width: 120, height: 2,
          borderRadius: 9999, background: "#f3f4f6", overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%", borderRadius: 9999, background: "#fb5724",
            transition: "width 2s cubic-bezier(0.4, 0, 0.2, 1)",
            width: phase === "enter" ? "0%" : "100%",
          }}
        />
      </div>
    </div>
  );
}
