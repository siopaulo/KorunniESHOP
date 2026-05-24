"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  cartSubtotal,
  cartTotalItems,
  clampCartQuantity,
  resolveCartQuantityUpdate,
} from "@/lib/cart/calculations";

export interface CartLine {
  productId: string;
  slug: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  stockQuantity: number;
}

interface CartState {
  items: CartLine[];
  addItem: (item: Omit<CartLine, "quantity">, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  subtotal: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item, quantity = 1) => {
        set((state) => {
          const existing = state.items.find((i) => i.productId === item.productId);
          if (existing) {
            const nextQty = clampCartQuantity(
              existing.quantity,
              quantity,
              item.stockQuantity,
            );
            return {
              items: state.items.map((i) =>
                i.productId === item.productId ? { ...i, quantity: nextQty } : i,
              ),
            };
          }
          return {
            items: [
              ...state.items,
              { ...item, quantity: clampCartQuantity(0, quantity, item.stockQuantity) },
            ],
          };
        });
      },
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        })),
      updateQuantity: (productId, quantity) => {
        const resolved = resolveCartQuantityUpdate(
          quantity,
          get().items.find((i) => i.productId === productId)?.stockQuantity ?? quantity,
        );
        if (resolved === null) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId ? { ...i, quantity: resolved } : i,
          ),
        }));
      },
      clearCart: () => set({ items: [] }),
      totalItems: () => cartTotalItems(get().items),
      subtotal: () => cartSubtotal(get().items),
    }),
    { name: "korunni-cart" },
  ),
);
