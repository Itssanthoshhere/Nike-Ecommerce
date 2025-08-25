"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { GetCartResult } from "@/lib/actions/cart";

export type CartStateItem = {
  cartItemId: string;
  variantId: string;
  productId: string;
  title: string;
  subtitle?: string | null;
  imageUrl: string | null;
  price: number;
  quantity: number;
  size?: string | null;
  color?: string | null;
};

type CartState = {
  cartId: string | null;
  items: CartStateItem[];
  subtotal: number;
  count: number;
  setCart: (cart: GetCartResult) => void;
  removeItemOptimistic: (cartItemId: string) => void;
  updateItemQtyOptimistic: (cartItemId: string, qty: number) => void;
  clear: () => void;
};

const computeCount = (items: CartStateItem[]) =>
  items.reduce((acc, it) => acc + it.quantity, 0);

export const useCartStore = create<CartState>()(
  devtools((set) => ({
    cartId: null,
    items: [],
    subtotal: 0,
    count: 0,
    setCart: (cart) =>
      set({
        cartId: cart.cartId,
        items: cart.items,
        subtotal: cart.subtotal,
        count: computeCount(cart.items),
      }),
    removeItemOptimistic: (cartItemId) =>
      set((s) => {
        const items = s.items.filter((i) => i.cartItemId !== cartItemId);
        return { items, subtotal: items.reduce((a, i) => a + i.price * i.quantity, 0), count: computeCount(items) };
      }),
    updateItemQtyOptimistic: (cartItemId, qty) =>
      set((s) => {
        const items = s.items.map((i) => (i.cartItemId === cartItemId ? { ...i, quantity: qty } : i));
        return { items, subtotal: items.reduce((a, i) => a + i.price * i.quantity, 0), count: computeCount(items) };
      }),
    clear: () => set({ cartId: null, items: [], subtotal: 0, count: 0 }),
  }))
);


