"use client";

import { ShoppingBag } from "lucide-react";
import { useTransition } from "react";
import { useVariantStore } from "@/store/variant";
import { addCartItem, type GetCartResult } from "@/lib/actions/cart";
import { useCartStore } from "@/store/cart.store";

type Props = {
  productId: string;
  variantIdsByColorIndex?: string[];
  variantId?: string;
};

export default function AddToCartButton({ productId, variantIdsByColorIndex, variantId }: Props) {
  const selectedIndex = useVariantStore((s) => s.getSelected(productId, 0));
  const setCart = useCartStore((s) => s.setCart);
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    const chosen = variantId ?? variantIdsByColorIndex?.[selectedIndex];
    if (!chosen) return;
    startTransition(async () => {
      const cart: GetCartResult = await addCartItem(chosen, 1);
      setCart(cart);
    });
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="flex items-center justify-center gap-2 rounded-full bg-dark-900 px-6 py-4 text-body-medium text-light-100 transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-dark-500] disabled:opacity-60"
    >
      <ShoppingBag className="h-5 w-5" />
      {isPending ? "Adding…" : "Add to Bag"}
    </button>
  );
}


