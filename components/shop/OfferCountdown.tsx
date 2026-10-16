// SAVE PATH: components/shop/OfferCountdown.tsx
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
  target, label = "Ends in", dark = false, big = false, onDone,
}: {
  target: string;
  label?: string;
  dark?: boolean;
  /** big = boro boxed digits with Hours / Min / Sec label (offer card-er jonno) */
  big?: boolean;
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
    ...(t.d > 0 ? [{ v: t.d, l: "d", name: "Days" }] : []),
    { v: t.h, l: "h", name: "Hours" }, { v: t.m, l: "m", name: "Min" }, { v: t.s, l: "s", name: "Sec" },
  ];

  if (big) {
    return (
      <div className="flex flex-col gap-1.5">
        <span className={`flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider ${dark ? "text-white/80" : "text-gray-500"}`}>
          <Timer size={12} /> {label}
        </span>
        <div className="flex items-start gap-1.5">
          {units.map((u, i) => (
            <div key={u.l} className="flex items-start gap-1.5">
              <div className="flex flex-col items-center">
                <span className={`flex items-center justify-center w-[52px] h-[52px] sm:w-14 sm:h-14 rounded-xl font-mono text-2xl sm:text-[26px] font-black tabular-nums leading-none shadow-md ring-1 ${
                  dark ? "bg-white text-gray-900 ring-white/40" : "bg-gray-900 text-white ring-gray-900"
                }`}>
                  {pad(u.v)}
                </span>
                <span className={`mt-1 text-[9px] font-bold uppercase tracking-widest ${dark ? "text-white/80" : "text-gray-400"}`}>{u.name}</span>
              </div>
              {i < units.length - 1 && <span className={`mt-3 text-xl font-black ${dark ? "text-white/70" : "text-gray-400"}`}>:</span>}
            </div>
          ))}
        </div>
      </div>
    );
  }

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
