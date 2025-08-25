"use client";

import Image from "next/image";
import { useEffect, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { useCartStore } from "@/store/cart.store";
import type { GetCartResult } from "@/lib/actions/cart";
import CartSummary from "@/components/CartSummary";

type Props = {
  initialCart: GetCartResult;
  onCheckout: () => Promise<void>;
  onRemove: (cartItemId: string) => Promise<GetCartResult>;
  onUpdate: (cartItemId: string, update: { quantity?: number; variantId?: string }) => Promise<GetCartResult>;
};

export default function CartClient({ initialCart, onCheckout, onRemove, onUpdate }: Props) {
  const { items, subtotal, count, setCart, removeItemOptimistic, updateItemQtyOptimistic } = useCartStore();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setCart(initialCart);
  }, [initialCart, setCart]);

  const handleRemove = (id: string) => {
    removeItemOptimistic(id);
    startTransition(async () => setCart(await onRemove(id)));
  };

  const handleQty = (id: string, qty: number) => {
    updateItemQtyOptimistic(id, qty);
    startTransition(async () => setCart(await onUpdate(id, { quantity: qty })));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="mb-6 text-2xl font-semibold text-dark-900">Cart</h1>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-8">
          {items.length === 0 && <p className="text-body">Your cart is empty.</p>}
          {items.map((it) => (
            <div key={it.cartItemId} className="flex items-start gap-6">
              <div className="h-28 w-40 flex-shrink-0 overflow-hidden rounded-md bg-light-200">
                {it.imageUrl && (
                  <Image src={it.imageUrl} alt={it.title} width={160} height={112} className="h-full w-full object-cover" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-dark-900 font-medium">{it.title}</p>
                {it.subtitle && <p className="text-sm text-dark-600">{it.subtitle}</p>}
                <div className="mt-2 flex items-center gap-6 text-sm">
                  {it.size && <span>Size {it.size}</span>}
                  <div className="inline-flex items-center rounded-full border border-light-300">
                    <button onClick={() => handleQty(it.cartItemId, Math.max(1, it.quantity - 1))} className="px-3 py-1">−</button>
                    <span className="px-3 py-1">{it.quantity}</span>
                    <button onClick={() => handleQty(it.cartItemId, it.quantity + 1)} className="px-3 py-1">+</button>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-3">
                <p className="text-dark-900">${(it.price * it.quantity).toFixed(2)}</p>
                <button aria-label="Remove" onClick={() => handleRemove(it.cartItemId)} className="text-red-600 hover:text-red-700">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
        <aside className="lg:col-span-4">
          <CartSummary cartId={initialCart.cartId} subtotal={subtotal} />
        </aside>
      </div>
    </div>
  );
}


