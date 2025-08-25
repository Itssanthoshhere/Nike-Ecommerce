"use client";

import { useTransition } from "react";
import { createStripeCheckoutSession } from "@/lib/actions/checkout";

type Props = {
  cartId: string;
  subtotal: number;
};

export default function CartSummary({ cartId, subtotal }: Props) {
  const [isPending, startTransition] = useTransition();

  const onCheckout = () => {
    startTransition(async () => {
      const { url } = await createStripeCheckoutSession(cartId);
      if (url) window.location.href = url;
    });
  };

  return (
    <div className="rounded-2xl bg-light-100 p-6">
      <h2 className="mb-4 text-lg font-semibold">Summary</h2>
      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
        <div className="flex items-center justify-between"><span>Estimated Delivery & Handling</span><span>$2.00</span></div>
        <hr className="my-2 border-light-300" />
        <div className="flex items-center justify-between font-medium"><span>Total</span><span>${(subtotal + 2).toFixed(2)}</span></div>
      </div>
      <button onClick={onCheckout} disabled={isPending || subtotal <= 0} className="mt-6 w-full rounded-full bg-dark-900 px-6 py-3 text-white hover:bg-dark-800 disabled:opacity-60">
        {isPending ? "Redirecting…" : "Proceed to Checkout"}
      </button>
    </div>
  );
}


