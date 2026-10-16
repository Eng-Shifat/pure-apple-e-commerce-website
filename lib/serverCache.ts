// SAVE PATH: lib/serverCache.ts
// Tiny in-memory cache for API responses (server side)
// - একই products query বারবার Supabase-এ না গিয়ে কয়েক সেকেন্ড memory থেকে যায়
// - product বা order বদলালে clearCache() দিয়ে সাথে সাথে মুছে যায়

type Entry = { exp: number; data: unknown };
const store = new Map<string, Entry>();
const MAX_ENTRIES = 200;

export function cacheGet<T>(key: string): T | undefined {
  const e = store.get(key);
  if (!e) return undefined;
  if (e.exp < Date.now()) { store.delete(key); return undefined; }
  return e.data as T;
}

export function cacheSet(key: string, data: unknown, ttlMs = 20_000) {
  if (store.size >= MAX_ENTRIES) store.delete(store.keys().next().value as string);
  store.set(key, { exp: Date.now() + ttlMs, data });
}

/** prefix দিলে শুধু সেই key গুলো, না দিলে সব */
export function clearCache(prefix = "") {
  if (!prefix) return store.clear();
  for (const k of Array.from(store.keys())) if (k.startsWith(prefix)) store.delete(k);
}
