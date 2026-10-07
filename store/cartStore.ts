"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/types";

export interface CartLine {
  product: Product;
  quantity: number;
}

interface CartStore {
  lines: CartLine[];
  addItem: (product: Product, qty?: number) => void;
  removeItem: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  total: () => number;
  count: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      lines: [],

      addItem(product, qty = 1) {
        set((s) => {
          const existing = s.lines.find((l) => l.product.id === product.id);
          if (existing) {
            return {
              lines: s.lines.map((l) =>
                l.product.id === product.id
                  ? { ...l, quantity: l.quantity + qty }
                  : l
              ),
            };
          }
          return { lines: [...s.lines, { product, quantity: qty }] };
        });
      },

      removeItem(productId) {
        set((s) => ({ lines: s.lines.filter((l) => l.product.id !== productId) }));
      },

      updateQty(productId, qty) {
        if (qty < 1) {
          get().removeItem(productId);
          return;
        }
        set((s) => ({
          lines: s.lines.map((l) =>
            l.product.id === productId ? { ...l, quantity: qty } : l
          ),
        }));
      },

      clearCart() {
        set({ lines: [] });
      },

      total() {
        return get().lines.reduce((sum, l) => sum + l.product.price * l.quantity, 0);
      },

      count() {
        return get().lines.reduce((sum, l) => sum + l.quantity, 0);
      },
    }),
    { name: "pure-apple-cart" }
  )
);
