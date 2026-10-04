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

const MODEL_URL = "/models/iphone.glb";
const ENV_URL = "/models/studio.hdr";
const SPLASH_EVENT = "pure-apple:splash-done";

function Placeholder() {
  return (
    <div className="w-full h-[270px] sm:h-[360px] lg:w-[420px] lg:h-[500px] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
    </div>
  );
}

export default function PhoneModelLazy() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let idleId: number | undefined;
    let fallbackTimer: ReturnType<typeof setTimeout> | undefined;

    // 1) Warm the network cache right away. This costs no main-thread time,
    //    so the files are already downloaded when the 3D scene starts.
    fetch(MODEL_URL, { priority: "low" } as RequestInit).catch(() => {});
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
  }, []);

  if (!ready) return <Placeholder />;

  return (
    <Suspense fallback={<Placeholder />}>
      <PhoneModel />
    </Suspense>
  );
}
