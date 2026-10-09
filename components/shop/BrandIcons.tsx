/**
 * BrandIcons — inline SVG logos for all 10 phone brands.
 * Each returns a raw <svg> so it works everywhere (sidebar, navbar, cards).
 * Size is controlled by className / width / height props on the wrapper.
 */

import React from "react";

// ─────────────────────────────────────────────────────────────────────────────
// Individual logo components
// ─────────────────────────────────────────────────────────────────────────────

export function AppleLogo({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 814 1000" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.8 0 663.3 0 541.4 0 319.7 133.3 202.1 264.3 202.1c70.7 0 130.5 46.4 174.8 46.4 42.7 0 109.6-49.1 192.5-49.1 30.8 0 130.5 2.9 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z" />
    </svg>
  );
}

export function SamsungLogo({ className = "w-16 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 209 35" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M26.6 14.2c-.4-4.5-3.8-6.6-8.3-6.6-4 0-7.4 1.8-7.4 5.4 0 3.2 2.3 4.6 6.4 5.5l4.1.9c5.4 1.2 9.6 3.5 9.6 9.2 0 7.1-6.2 9.8-12.9 9.8-7.2 0-13.2-3.4-13.5-11.3h5.4c.3 4.9 3.7 6.9 8.5 6.9 4.5 0 7.8-2 7.8-5.7 0-3.3-2.9-4.9-7.1-5.8l-4-.9C8.8 20 5 17.6 5 11.9 5 5.3 11.1 3 17.2 3c6.8 0 12.6 3.1 12.8 11.2h-3.4zm29.5 21.8L54.4 30H41.7l-1.7 6H34l11-31h6l11 31h-6zm-7.4-24.8l-4.6 14.6h9.2l-4.6-14.6zm46.3 24.8V9.5l-.2.1-9.7 26.4H80l-9.6-26.4-.2-.1v26.4h-4.9V5h7.5L82 29.6 91 5h7.5v31h-3.5zm31.3.7c-7 0-13-3.2-13.5-10.8h5.5c.4 4.8 3.9 6.5 8.2 6.5 4 0 7.3-1.8 7.3-5.4 0-3-2.4-4.5-5.8-5.3l-5-1.1c-5-1.1-9.3-3.5-9.3-9.6C114.7 4.6 120.9 3 126.7 3c6.4 0 12.4 2.8 12.7 10.3h-5.4c-.3-4.4-3.5-6-7.6-6-3.8 0-6.8 1.6-6.8 5.1 0 3 2.4 4.4 6.4 5.3l4.2.9c5.7 1.3 9.6 3.7 9.6 9.4 0 7.1-6 9.5-13.8 9.5zm42.3-.7v-13.3h-14.8v13.3H149V5h4.8v13h14.8V5h4.9v31h-4.9zm27.8.7c-9.3 0-14.5-6.1-14.5-16.2V5h5v16.4c0 6.8 3 10.5 9.5 10.5s9.5-3.7 9.5-10.5V5h5v15.5c0 10.1-5.2 16.2-14.5 16.2zm46.9-.7l-16.6-23-.2.1v22.9H222V5h4.8l16.5 22.7.2-.1V5h4.8v31h-4.9z" fill="currentColor"/>
    </svg>
  );
}

export function OnePlusLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="20" fill="#EF1B25"/>
      <text x="50" y="68" fontSize="58" fontWeight="900" textAnchor="middle" fill="white" fontFamily="Arial,sans-serif">1+</text>
    </svg>
  );
}

export function RedmiLogo({ className = "w-16 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 40" className={className} xmlns="http://www.w3.org/2000/svg">
      <g fill="currentColor">
        {/* Xiaomi "mi" rabbit-ear logo mark */}
        <rect x="2" y="8" width="22" height="24" rx="5" fill="currentColor" opacity="0.15"/>
        <rect x="5" y="11" width="6" height="10" rx="2" fill="currentColor"/>
        <rect x="13" y="11" width="6" height="10" rx="2" fill="currentColor"/>
        <rect x="5" y="24" width="14" height="5" rx="2" fill="currentColor"/>
        {/* "Redmi" text */}
        <text x="28" y="29" fontSize="18" fontWeight="700" fontFamily="Arial,sans-serif" fill="currentColor">Redmi</text>
      </g>
    </svg>
  );
}

export function RealmeLogo({ className = "w-16 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 130 40" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Realme stylised "R" mark */}
      <path d="M8 8 h10 a8 8 0 0 1 0 16 h-4 l8 8 h-6 l-8-8 v8 h-5 z" fill="currentColor"/>
      <text x="28" y="29" fontSize="17" fontWeight="700" fontFamily="Arial,sans-serif" fill="currentColor">realme</text>
    </svg>
  );
}

export function NothingLogo({ className = "w-16 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 40" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Nothing dot-matrix "N" */}
      {[0,6,12,18,24].map(y =>
        [0,6,12,18,24].map(x => {
          const on =
            (x === 0) ||
            (x === 24) ||
            (x === 6 && y === 6) ||
            (x === 12 && y === 12) ||
            (x === 18 && y === 18);
          return on ? (
            <rect key={`${x}-${y}`} x={x + 4} y={y + 8} width="4" height="4" rx="1" fill="currentColor" />
          ) : null;
        })
      )}
      <text x="38" y="29" fontSize="17" fontWeight="700" fontFamily="Arial,sans-serif" fill="currentColor">Nothing</text>
    </svg>
  );
}

export function MotorolaLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="48" fill="currentColor"/>
      <text x="50" y="66" fontSize="50" fontWeight="900" textAnchor="middle" fill="white" fontFamily="Arial,sans-serif">M</text>
    </svg>
  );
}

export function VivoLogo({ className = "w-14 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 40" className={className} xmlns="http://www.w3.org/2000/svg">
      <text x="5" y="30" fontSize="26" fontWeight="800" fontFamily="Arial,sans-serif" fill="currentColor" letterSpacing="-1">vivo</text>
    </svg>
  );
}

export function HonorLogo({ className = "w-16 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 130 40" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Honor diamond mark */}
      <polygon points="14,4 24,20 14,36 4,20" fill="none" stroke="currentColor" strokeWidth="2.5"/>
      <circle cx="14" cy="20" r="3" fill="currentColor"/>
      <text x="32" y="29" fontSize="17" fontWeight="700" fontFamily="Arial,sans-serif" fill="currentColor">HONOR</text>
    </svg>
  );
}

export function IqooLogo({ className = "w-14 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 110 40" className={className} xmlns="http://www.w3.org/2000/svg">
      <text x="4" y="30" fontSize="24" fontWeight="900" fontFamily="Arial,sans-serif" fill="currentColor" letterSpacing="1">iQOO</text>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Lookup map — use brand key (lowercase) → component
// ─────────────────────────────────────────────────────────────────────────────

type LogoProps = { className?: string };
type LogoComponent = React.FC<LogoProps>;

export const BRAND_LOGO_MAP: Record<string, LogoComponent> = {
  apple:    AppleLogo,
  samsung:  SamsungLogo,
  oneplus:  OnePlusLogo,
  redmi:    RedmiLogo,
  realme:   RealmeLogo,
  nothing:  NothingLogo,
  motorola: MotorolaLogo,
  vivo:     VivoLogo,
  honor:    HonorLogo,
  iqoo:     IqooLogo,
};

/** Render any brand logo by key. Falls back to brand name initial if unknown. */
export function BrandLogo({
  brand,
  className,
}: {
  brand: string;
  className?: string;
}) {
  const key = brand.toLowerCase();
  const Logo = BRAND_LOGO_MAP[key];
  if (!Logo) {
    return <span className={`font-bold text-sm ${className ?? ""}`}>{brand[0]}</span>;
  }
  return <Logo className={className} />;
}
