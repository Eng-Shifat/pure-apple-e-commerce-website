"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/types";

interface WishlistStore {
  items: Product[];
  addItem:    (product: Product) => void;
  removeItem: (productId: string) => void;
  toggle:     (product: Product) => void;
  isWished:   (productId: string) => boolean;
  clear:      () => void;
  count:      () => number;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem(product) {
        set((s) => {
          if (s.items.find((i) => i.id === product.id)) return s;
          return { items: [...s.items, product] };
        });
      },

      removeItem(productId) {
        set((s) => ({ items: s.items.filter((i) => i.id !== productId) }));
      },

      toggle(product) {
        get().isWished(product.id)
          ? get().removeItem(product.id)
          : get().addItem(product);
      },

      isWished(productId) {
        return get().items.some((i) => i.id === productId);
      },

      clear() {
        set({ items: [] });
      },

      count() {
        return get().items.length;
      },
    }),
    { name: "pure-apple-wishlist" }
  )
);
