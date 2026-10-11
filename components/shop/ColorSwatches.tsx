"use client";

import type { ColorVariant } from "@/lib/phoneCatalog";

interface Props {
  colors: ColorVariant[];
  active: number;
  onSelect: (index: number) => void;
  size?: number;   // dot diameter in px
  max?: number;    // max dots before "+N"
}

export default function ColorSwatches({ colors, active, onSelect, size = 14, max = 5 }: Props) {
  if (!colors || colors.length === 0) return null;

  const shown = colors.slice(0, max);
  const extra = colors.length - shown.length;

  return (
    <div className="flex items-center gap-1.5 mt-1.5" role="radiogroup" aria-label="Color">
      {shown.map((c, i) => (
        <button
          key={c.name}
          type="button"
          role="radio"
          aria-checked={i === active}
          aria-label={c.name}
          title={c.name}
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onSelect(i); }}
          className={`rounded-full border transition-all duration-150 hover:scale-110 active:scale-95 shrink-0
            ${i === active ? "border-gray-900 ring-2 ring-offset-1 ring-gray-900/70" : "border-gray-300"}`}
          style={{ width: size, height: size, backgroundColor: c.hex }}
        />
      ))}
      {extra > 0 && <span className="text-[9px] text-gray-400 font-medium">+{extra}</span>}
      <span className="ml-0.5 text-[9px] text-gray-400 truncate">{colors[active]?.name}</span>
    </div>
  );
}
