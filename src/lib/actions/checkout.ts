"use server";

import { stripe } from "@/lib/stripe/client";
import { db } from "@/lib/db";
import { and, eq, sql } from "drizzle-orm";
import { carts, cartItems, productVariants, products } from "@/lib/db/schema";
import { getCart } from "@/lib/actions/cart";
import { getCurrentUser, createGuestSession, guestSession } from "@/lib/auth/actions";

export async function createStripeCheckoutSession(cartId?: string) {
  const { cartId: activeCartId, items, subtotal } = await getCart();
  const targetCartId = cartId ?? activeCartId;
  if (!items.length) {
    throw new Error("Cart is empty");
  }

  const line_items = items.map((i) => ({
    quantity: i.quantity,
    price_data: {
      currency: "usd",
      unit_amount: Math.round(i.price * 100),
      product_data: {
        name: i.title,
      },
    },
  }));

  const successUrl = `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${process.env.NEXT_PUBLIC_APP_URL}/cart`;

  const user = await getCurrentUser();
  const guest = await guestSession();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items,
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      cartId: targetCartId,
      userId: user?.id ?? "",
      guestToken: guest.sessionToken ?? "",
    },
  });

  return { url: session.url! };
}


