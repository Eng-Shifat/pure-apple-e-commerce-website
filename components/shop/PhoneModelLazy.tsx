// SAVE PATH: components/shop/PhoneModelLazy.tsx
"use client";

import { lazy, Suspense, useEffect, useState } from "react";

/**
 * Loads the heavy 3D phone (three.js + GLB + HDR ≈ 3 MB) AFTER the splash
 * screen starts fading, and only when the browser is idle.
 *
 * Why: parsing ~1 MB of three.js and the model used to freeze the page for
 * about a second while the splash screen was still animating.
 */
const PhoneModel = lazy(() => import("./PhoneModel"));

const ENV_URL = "/models/studio.hdr";

/**
 * Weak phone / slow network / data-saver → 3D আপনা-আপনি load হবে না
 * (≈ 2 MB download + three.js parse বাঁচে)। ইউজার চাইলে button চেপে চালাতে পারবে।
 */
function isLowEndDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  const n = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean; effectiveType?: string };
  };
  const slowNet = !!n.connection?.saveData || /^(slow-2g|2g|3g)$/.test(n.connection?.effectiveType ?? "");
  const lowMem = typeof n.deviceMemory === "number" && n.deviceMemory <= 4;
  const lowCpu = typeof n.hardwareConcurrency === "number" && n.hardwareConcurrency <= 4;
  const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  return slowNet || lowMem || lowCpu || !!reduced;
}
const SPLASH_EVENT = "pure-apple:splash-done";

function Placeholder({ fill }: { fill?: boolean }) {
  return (
    <div className={fill ? "absolute inset-0 flex items-center justify-center" : "w-full h-[270px] sm:h-[360px] lg:w-[420px] lg:h-[500px] flex items-center justify-center"}>
      <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin" />
    </div>
  );
}

export default function PhoneModelLazy({ fill = false, model }: { fill?: boolean; model: string }) {
  const [ready, setReady] = useState(false);
  // undefined = এখনো check হয়নি, true = weak device (tap করলে 3D চলবে)
  const [lowEnd, setLowEnd] = useState<boolean | undefined>(undefined);
  const [forced, setForced] = useState(false);

  useEffect(() => { setLowEnd(isLowEndDevice()); }, []);

  useEffect(() => {
    if (lowEnd === undefined) return;
    if (lowEnd && !forced) return; // download-ও শুরু করব না
    let cancelled = false;
    let idleId: number | undefined;
    let fallbackTimer: ReturnType<typeof setTimeout> | undefined;

    // 1) Warm the network cache right away. This costs no main-thread time,
    //    so the files are already downloaded when the 3D scene starts.
    fetch(model, { priority: "low" } as RequestInit).catch(() => {});
    fetch(ENV_URL, { priority: "low" } as RequestInit).catch(() => {});

    // 2) Mount the 3D scene once the splash is gone and the browser is idle.
    const mount = () => {
      if (cancelled) return;
      const w = window as any;
      if (w.requestIdleCallback) {
        idleId = w.requestIdleCallback(() => !cancelled && setReady(true), { timeout: 1200 });
      } else {
        fallbackTimer = setTimeout(() => !cancelled && setReady(true), 150);
      }
    };

    if ((window as any).__paSplashDone) {
      mount();
    } else {
      window.addEventListener(SPLASH_EVENT, mount, { once: true });
      // safety net: never wait forever
      fallbackTimer = setTimeout(mount, 6000);
    }

    return () => {
      cancelled = true;
      window.removeEventListener(SPLASH_EVENT, mount);
      if (idleId !== undefined) (window as any).cancelIdleCallback?.(idleId);
      if (fallbackTimer) clearTimeout(fallbackTimer);
    };
  }, [lowEnd, forced]);

  if (lowEnd && !forced) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <button
          type="button"
          onClick={() => setForced(true)}
          className="flex flex-col items-center gap-2 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur px-5 py-4 text-white transition active:scale-95"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-500 shadow-lg shadow-brand-500/40">
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white" aria-hidden><path d="M8 5v14l11-7z" /></svg>
          </span>
          <span className="text-xs font-bold tracking-wide">View in 3D</span>
        </button>
      </div>
    );
  }

  if (!ready) return <Placeholder fill={fill} />;

  return (
    <Suspense fallback={<Placeholder fill={fill} />}>
      <PhoneModel fill={fill} model={model} />
    </Suspense>
  );
}
