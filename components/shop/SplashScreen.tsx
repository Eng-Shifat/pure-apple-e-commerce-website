"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function SplashScreen() {
  const [phase, setPhase] = useState<"enter" | "hold" | "exit" | "done">("enter");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"), 400);
    const t2 = setTimeout(() => setPhase("exit"), 2000);
    const t3 = setTimeout(() => setPhase("done"), 2700);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        background: "linear-gradient(160deg, #fff7f0 0%, #ffffff 55%, #fffbe6 100%)",
        transition: "opacity 0.65s ease",
        opacity: phase === "exit" ? 0 : 1,
        pointerEvents: phase === "exit" ? "none" : "auto",
      }}
    >
      {/* Soft blobs */}
      <div style={{ position:"absolute", top:"-80px", left:"-80px", width:300, height:300, borderRadius:"50%", background:"radial-gradient(circle, rgba(249,115,22,0.09) 0%, transparent 70%)", pointerEvents:"none" }} />
      <div style={{ position:"absolute", bottom:"-60px", right:"-60px", width:260, height:260, borderRadius:"50%", background:"radial-gradient(circle, rgba(234,179,8,0.1) 0%, transparent 70%)", pointerEvents:"none" }} />
      <div style={{ position:"absolute", top:"25%", right:"-40px", width:180, height:180, borderRadius:"50%", background:"radial-gradient(circle, rgba(34,197,94,0.07) 0%, transparent 70%)", pointerEvents:"none" }} />

      {/* Logo + tagline */}
      <div
        style={{
          display: "flex", flexDirection: "column",
          alignItems: "center", gap: 20,
          transition: "opacity 0.6s ease, transform 0.7s cubic-bezier(0.34,1.56,0.64,1)",
          opacity: phase === "enter" ? 0 : 1,
          transform: phase === "enter" ? "scale(0.65) translateY(28px)" : "scale(1) translateY(0)",
        }}
      >
        {/* Spinning ring behind logo */}
        <div style={{ position: "relative", width: 180, height: 180, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {/* Animated ring */}
          <svg
            width={180} height={180}
            viewBox="0 0 180 180"
            style={{
              position: "absolute", inset: 0,
              animation: "pa-spin 4s linear infinite",
            }}
          >
            <defs>
              <linearGradient id="rg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="45%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#eab308" />
              </linearGradient>
            </defs>
            <circle cx="90" cy="90" r="85" fill="none" stroke="url(#rg)" strokeWidth="4"
              strokeDasharray="160 375" strokeLinecap="round" />
            <circle cx="90" cy="90" r="85" fill="none" stroke="url(#rg)" strokeWidth="2.5"
              strokeDasharray="80 455" strokeDashoffset="260" strokeLinecap="round"
              style={{ animationDirection:"reverse" }} />
          </svg>

          {/* Actual logo PNG */}
          <div
            style={{
              position: "relative", width: 140, height: 140,
              animation: "pa-pulse 3s ease-in-out infinite",
            }}
          >
            <Image
              src="/logo/pure-apple-logo.png"
              alt="Pure Apple"
              fill
              style={{ objectFit: "contain" }}
              sizes="140px"
              priority
            />
          </div>
        </div>

        {/* Tagline */}
        <p
          style={{
            fontSize: 14, color: "#9ca3af", fontStyle: "italic", margin: 0,
            transition: "opacity 0.5s ease 0.3s",
            opacity: phase === "hold" ? 1 : 0,
          }}
        >
          Better Tech, Brighter Tomorrow ✨
        </p>
      </div>

      {/* Progress bar */}
      <div style={{ position:"absolute", bottom:52, width:150, height:3, borderRadius:9999, background:"#f3f4f6", overflow:"hidden" }}>
        <div style={{
          height:"100%", borderRadius:9999,
          background:"linear-gradient(90deg, #f97316, #eab308, #22c55e)",
          transition:"width 1.9s cubic-bezier(0.4,0,0.2,1)",
          width: phase === "enter" ? "0%" : phase === "hold" ? "80%" : "100%",
        }} />
      </div>

      {/* Dot indicators */}
      <div style={{ position:"absolute", bottom:28, display:"flex", gap:6 }}>
        {[0,1,2].map(i => (
          <div key={i} style={{
            width:6, height:6, borderRadius:"50%",
            transition:"background 0.4s ease",
            background: i === 0 ? "#f97316" : phase === "hold" && i === 1 ? "#eab308" : phase === "exit" && i === 2 ? "#22c55e" : "#e5e7eb",
          }} />
        ))}
      </div>

      {/* Keyframe styles */}
      <style>{`
        @keyframes pa-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes pa-pulse {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}
