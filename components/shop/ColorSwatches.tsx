"use client";

import type { ColorVariant } from "@/lib/phoneCatalog";

interface Props {
  colors: ColorVariant[];
  active: number;
  onSelect: (index: number) => void;
  size?: number;   // dot diameter in px
  max?: number;    // max dots before "+N"
}

// Color name → CSS color mapping
const COLOR_HEX: Record<string, string> = {
  black:              "#111111",
  white:              "#F5F5F7",
  silver:             "#C0C0C0",
  gold:               "#D4AF37",
  burgundy:           "#800020",
  glacier:            "#A8D8EA",
  "desert titanium":  "#C4A882",
  "natural titanium": "#B8B0A6",
  "blue titanium":    "#4A6FA5",
  purple:             "#7C3AED",
  pink:               "#EC4899",
  green:              "#22C55E",
  yellow:             "#EAB308",
  red:                "#EF4444",
  midnight:           "#1C1C1E",
  starlight:          "#F2E9D8",
  blue:               "#3B82F6",
  "deep purple":      "#5B21B6",
  "sierra blue":      "#6DB4C7",
  coral:              "#FF6B6B",
  lavender:           "#A78BFA",
  teal:               "#14B8A6",
  orange:             "#F97316",
};

function colorToHex(name: string, hex?: string): string {
  if (hex && hex !== "") return hex;
  return COLOR_HEX[name.toLowerCase()] ?? "#9CA3AF";
}

export default function ColorSwatches({ colors, active, onSelect, size = 14, max = 5 }: Props) {
  if (!colors || colors.length === 0) return null;

  const shown = colors.slice(0, max);
  const extra = colors.length - shown.length;
  const hasAnyImage = colors.some(c => c.image);

  return (
    <div className="flex items-center gap-1.5 mt-1.5 flex-wrap" role="radiogroup" aria-label="Color">
      {shown.map((c, i) => {
        const isActive = i === active;
        const resolvedHex = colorToHex(c.name, c.hex);
        const isLight = ["white", "starlight", "silver", "glacier", "yellow", "#F5F5F7", "#F2E9D8", "#A8D8EA", "#EAB308"].some(
          v => c.name.toLowerCase() === v || resolvedHex === v
        );
        return (
          <button
            key={c.name}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={c.name}
            title={c.name}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onSelect(i); }}
            className={`rounded-full border-2 transition-all duration-150 hover:scale-125 active:scale-95 shrink-0 relative
              ${isActive
                ? isLight ? "border-gray-600 ring-2 ring-offset-1 ring-gray-600" : "border-gray-900 ring-2 ring-offset-1 ring-gray-900/70"
                : isLight ? "border-gray-300 hover:border-gray-500" : "border-gray-200 hover:border-gray-400"
              }`}
            style={{ width: size + 2, height: size + 2, backgroundColor: resolvedHex }}
          >
            {/* active checkmark for dark colors */}
            {isActive && !isLight && (
              <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <svg width="7" height="7" viewBox="0 0 7 7" fill="none">
                  <path d="M1 3.5L2.8 5.5L6 1.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            )}
          </button>
        );
      })}
      {extra > 0 && <span className="text-[9px] text-gray-400 font-medium">+{extra}</span>}
      {/* Active color name — image আছে কিনা indicator সহ */}
      <span className="ml-0.5 text-[9px] text-gray-400 truncate flex items-center gap-1">
        {colors[active]?.name}
        {hasAnyImage && colors[active]?.image && (
          <span className="text-orange-400">📷</span>
        )}
      </span>
    </div>
  );
}
