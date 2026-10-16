// SAVE PATH: lib/cachedFetch.ts
"use client";
// Browser side: একই URL একসাথে/কিছুক্ষণের মধ্যে বারবার ডাকলে network-এ একবারই যায়।
// Page বদলে ফিরে এলে (Home → Product → Home) data সাথে সাথে চলে আসে।

type Item = { exp: number; promise: Promise<unknown> };
const mem = new Map<string, Item>();

export function cachedJson<T = unknown>(url: string, ttlMs = 45_000): Promise<T> {
  const hit = mem.get(url);
  if (hit && hit.exp > Date.now()) return hit.promise as Promise<T>;

  const promise = fetch(url)
    .then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.json(); })
    .catch((e) => { mem.delete(url); throw e; });

  mem.set(url, { exp: Date.now() + ttlMs, promise });
  return promise as Promise<T>;
}

export function invalidateCached(prefix = "") {
  for (const k of Array.from(mem.keys())) if (!prefix || k.startsWith(prefix)) mem.delete(k);
}
