"use client";
import { useEffect, useState } from "react";
import type { Product } from "@/types";

export function useProducts(featured = false) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState<string | null>(null);

  useEffect(() => {
    const url = featured ? "/api/products?featured=true" : "/api/products";
    fetch(url)
      .then((r) => r.json())
      .then((d) => setProducts(d.products ?? []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [featured]);

  return { products, loading, error };
}
