"use client";

import { useEffect, useState } from "react";
import { Timer } from "lucide-react";

function calc(target: string) {
  const diff = new Date(target).getTime() - Date.now();
  if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0, done: true };
  const t = Math.floor(diff / 1000);
  return {
    d: Math.floor(t / 86400),
    h: Math.floor((t % 86400) / 3600),
    m: Math.floor((t % 3600) / 60),
    s: t % 60,
    done: false,
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Countdown to `target`. Calls onDone once when it reaches zero
 * (parent uses it to switch to the next offer automatically).
 */
export default function OfferCountdown({
  target, label = "Ends in", dark = false, onDone,
}: {
  target: string;
  label?: string;
  dark?: boolean;
  onDone?: () => void;
}) {
  const [t, setT] = useState<ReturnType<typeof calc> | null>(null);

  useEffect(() => {
    setT(calc(target));
    let fired = false;
    const id = setInterval(() => {
      const next = calc(target);
      setT(next);
      if (next.done && !fired) { fired = true; onDone?.(); clearInterval(id); }
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  if (!t) return <div className="h-7" />; // hydration-safe placeholder
  if (t.done) return null;

  const units = [
    ...(t.d > 0 ? [{ v: t.d, l: "d" }] : []),
    { v: t.h, l: "h" }, { v: t.m, l: "m" }, { v: t.s, l: "s" },
  ];

  return (
    <div className="flex items-center gap-1.5">
      <Timer size={13} className={dark ? "text-white/70" : "text-orange-500"} />
      <span className={`text-[11px] font-semibold ${dark ? "text-white/70" : "text-gray-500"}`}>{label}</span>
      <div className="flex items-center gap-1">
        {units.map((u) => (
          <span key={u.l}
            className={`inline-flex items-baseline justify-center gap-px min-w-[30px] px-1.5 h-7 rounded-md font-mono text-[13px] font-extrabold leading-7 ${
              dark ? "bg-white/15 text-white" : "bg-gray-900 text-white"
            }`}>
            {pad(u.v)}<span className="text-[9px] font-semibold opacity-60">{u.l}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
