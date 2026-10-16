"use client";

// Payment logo — /public/payment logo/{COD,bkash,nagad}.png
// ছবি না পেলে নিজে থেকেই text badge দেখাবে (UI ভাঙবে না)

import { useState } from "react";

const FILES = { cod: "COD.png", bkash: "bkash.png", nagad: "nagad.png" } as const;
const LABEL = { cod: "COD", bkash: "bKash", nagad: "Nagad" } as const;
const FALLBACK_BG = { cod: "bg-green-600", bkash: "bg-pink-600", nagad: "bg-orange-500" } as const;

export default function PayLogo({ type, size = 40, className = "" }: { type: keyof typeof FILES; size?: number; className?: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span
        className={`inline-flex items-center justify-center rounded-lg text-white font-extrabold ${FALLBACK_BG[type]} ${className}`}
        style={{ width: size, height: size, fontSize: Math.max(9, size / 4) }}
      >
        {LABEL[type]}
      </span>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={encodeURI(`/payment logo/${FILES[type]}`)}
      alt={LABEL[type]}
      width={size}
      height={size}
      onError={() => setFailed(true)}
      className={`object-contain ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
