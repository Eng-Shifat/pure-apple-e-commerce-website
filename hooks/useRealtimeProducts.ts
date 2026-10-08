/**
 * useRealtimeProducts
 * ──────────────────────────────────────────────────────────────
 * Supabase Realtime subscription for the `products` table.
 *
 * – Initial load via REST API  (same as before)
 * – Listens for INSERT / UPDATE / DELETE events on `products`
 * – On any change: updates local state immediately (optimistic)
 *   and also does a background refetch to stay in sync
 *
 * Usage:
 *   const { products, loading, refresh } = useRealtimeProducts();
 *   const { products } = useRealtimeProducts({ available: true });
 */

"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";

export interface Product {
  id: string;
  name: string;
  variant?: string;
  price: number;
  original_price?: number;
  image: string;
  slug?: string;
  category?: string;
  condition?: string;
  badge?: string;
  badge_color?: string;
  is_featured?: boolean;
  is_available?: boolean;
  stock?: number;
  rating?: number;
  review_count?: number;
  spec_screen?: string;
  spec_ram?: string;
  spec_camera?: string;
  created_at?: string;
}

interface UseRealtimeProductsOptions {
  /** Only return available products */
  available?: boolean;
  /** Filter by category */
  category?: string;
  /** Filter by condition ("brand-new" | "pre-owned") */
  condition?: string;
  /** Only return featured products */
  featured?: boolean;
  /** Only return hot-deal products */
  deals?: boolean;
  /** Search query */
  q?: string;
}

interface UseRealtimeProductsReturn {
  products: Product[];
  loading: boolean;
  /** true while a background refetch is happening (after a realtime event) */
  syncing: boolean;
  refresh: () => Promise<void>;
}

function buildUrl(opts: UseRealtimeProductsOptions) {
  const params = new URLSearchParams();
  if (opts.available)  params.set("available",  "true");
  if (opts.category)   params.set("category",   opts.category);
  if (opts.condition)  params.set("condition",  opts.condition);
  if (opts.featured)   params.set("featured",   "true");
  if (opts.deals)      params.set("deals",      "true");
  if (opts.q)          params.set("q",          opts.q);
  const qs = params.toString();
  return `/api/products${qs ? `?${qs}` : ""}`;
}

export function useRealtimeProducts(
  opts: UseRealtimeProductsOptions = {}
): UseRealtimeProductsReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [syncing,  setSyncing]  = useState(false);

  // Keep opts stable in a ref so the subscription closure doesn't go stale
  const optsRef = useRef(opts);
  optsRef.current = opts;

  // Debounce timer for batching rapid realtime events
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchProducts = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setSyncing(true);

    try {
      const res  = await fetch(buildUrl(optsRef.current));
      const data = await res.json();
      setProducts(data.products ?? []);
    } catch {
      // network error — keep stale data
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchProducts(false);
  }, [fetchProducts]);

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel("products-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "products" },
        (payload) => {
          // ── Optimistic local update ───────────────────────────
          if (payload.eventType === "INSERT") {
            setProducts(prev => [payload.new as Product, ...prev]);
          }

          if (payload.eventType === "UPDATE") {
            setProducts(prev =>
              prev.map(p => p.id === (payload.new as Product).id
                ? { ...p, ...(payload.new as Product) }
                : p
              )
            );
          }

          if (payload.eventType === "DELETE") {
            setProducts(prev =>
              prev.filter(p => p.id !== (payload.old as { id: string }).id)
            );
          }

          // ── Debounced background refetch to stay fully in sync ─
          if (debounceRef.current) clearTimeout(debounceRef.current);
          debounceRef.current = setTimeout(() => {
            fetchProducts(true);
          }, 800);
        }
      )
      .subscribe();

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      supabase.removeChannel(channel);
    };
  }, [fetchProducts]);

  return {
    products,
    loading,
    syncing,
    refresh: () => fetchProducts(true),
  };
}
