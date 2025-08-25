"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  carts,
  cartItems,
  guests,
  productImages,
  productVariants,
  products,
  sizes,
  colors,
  genders,
  type SelectCart,
} from "@/lib/db/schema";
import { createGuestSession, getCurrentUser } from "@/lib/auth/actions";

type CartListItem = {
  id: string;
  cartItemId: string;
  variantId: string;
  productId: string;
  title: string;
  subtitle?: string | null;
  price: number;
  imageUrl: string | null;
  size?: string | null;
  color?: string | null;
  quantity: number;
};

export type GetCartResult = {
  cartId: string;
  items: CartListItem[];
  subtotal: number;
};

async function getOrCreateActiveCart(): Promise<SelectCart> {
  const user = await getCurrentUser();
  const cookieStore = await cookies();
  const guestToken = (await cookieStore).get("guest_session")?.value ?? null;

  // Ensure guest session exists when there is no user
  if (!user && !guestToken) {
    await createGuestSession();
  }

  const refreshedGuestToken = (await cookieStore).get("guest_session")?.value ?? null;

  // If user logged-in and there is a guest cart, merge it
  if (user && refreshedGuestToken) {
    await mergeGuestCartToUserCart(user.id, refreshedGuestToken);
    // After merge, cookie is removed inside merge function
  }

  // Fetch or create cart for current identity
  if (user) {
    const existing = await db.query.carts.findFirst({
      where: eq(carts.userId, user.id),
    });
    if (existing) return existing;
    const inserted = await db.insert(carts).values({ userId: user.id }).returning();
    return inserted[0]!;
  }

  const g = await db.query.guests.findFirst({
    where: eq(guests.sessionToken, refreshedGuestToken!),
  });
  if (!g) {
    const newSession = await createGuestSession();
    const again = await db.query.guests.findFirst({
      where: eq(guests.sessionToken, newSession.sessionToken!),
    });
    if (!again) throw new Error("Failed to initialize guest session");
    const res = await db.insert(carts).values({ guestId: again.id }).returning();
    return res[0]!;
  }
  const existing = await db.query.carts.findFirst({ where: eq(carts.guestId, g.id) });
  if (existing) return existing;
  const created = await db.insert(carts).values({ guestId: g.id }).returning();
  return created[0]!;
}

async function mergeGuestCartToUserCart(userId: string, guestToken: string) {
  const cookieStore = await cookies();
  const g = await db.query.guests.findFirst({ where: eq(guests.sessionToken, guestToken) });
  if (!g) {
    (await cookieStore).delete("guest_session");
    return;
  }

  const userCart = await db.query.carts.findFirst({ where: eq(carts.userId, userId) });
  const guestCart = await db.query.carts.findFirst({ where: eq(carts.guestId, g.id) });
  if (!guestCart) {
    await db.delete(guests).where(eq(guests.id, g.id));
    (await cookieStore).delete("guest_session");
    return;
  }

  const finalUserCart = userCart
    ? userCart
    : (await db.insert(carts).values({ userId }).returning())[0]!;

  const guestItems = await db.select().from(cartItems).where(eq(cartItems.cartId, guestCart.id));

  if (guestItems.length) {
    const existingUserItems = await db
      .select()
      .from(cartItems)
      .where(eq(cartItems.cartId, finalUserCart.id));

    for (const gi of guestItems) {
      const dupe = existingUserItems.find((ui) => ui.productVariantId === gi.productVariantId);
      if (dupe) {
        await db
          .update(cartItems)
          .set({ quantity: dupe.quantity + gi.quantity })
          .where(eq(cartItems.id, dupe.id));
      } else {
        await db
          .insert(cartItems)
          .values({ cartId: finalUserCart.id, productVariantId: gi.productVariantId, quantity: gi.quantity });
      }
    }
  }

  await db.delete(cartItems).where(eq(cartItems.cartId, guestCart.id));
  await db.delete(carts).where(eq(carts.id, guestCart.id));
  await db.delete(guests).where(eq(guests.id, g.id));
  (await cookieStore).delete("guest_session");
}

export async function getCart(): Promise<GetCartResult> {
  const cart = await getOrCreateActiveCart();

  const rows = await db
    .select({
      cartItemId: cartItems.id,
      variantId: productVariants.id,
      productId: products.id,
      title: products.name,
      price: productVariants.price,
      qty: cartItems.quantity,
      imageUrl: productImages.url,
      sizeName: sizes.name,
      colorName: colors.name,
      subtitle: genders.label,
    })
    .from(cartItems)
    .innerJoin(productVariants, eq(productVariants.id, cartItems.productVariantId))
    .innerJoin(products, eq(products.id, productVariants.productId))
    .leftJoin(productImages, and(eq(productImages.productId, products.id)))
    .leftJoin(sizes, eq(sizes.id, productVariants.sizeId))
    .leftJoin(colors, eq(colors.id, productVariants.colorId))
    .leftJoin(genders, eq(genders.id, products.genderId))
    .where(eq(cartItems.cartId, cart.id));

  const items: CartListItem[] = [];
  let subtotal = 0;
  for (const r of rows) {
    const priceNum = Number(r.price as unknown as string);
    subtotal += priceNum * r.qty;
    items.push({
      id: `${r.variantId}`,
      cartItemId: r.cartItemId,
      variantId: r.variantId,
      productId: r.productId,
      title: r.title,
      subtitle: r.subtitle ? `${r.subtitle} Shoes` : null,
      price: priceNum,
      imageUrl: r.imageUrl ?? null,
      size: r.sizeName ?? null,
      color: r.colorName ?? null,
      quantity: r.qty,
    });
  }

  return { cartId: cart.id, items, subtotal };
}

export async function addCartItem(variantId: string, quantity = 1) {
  const cart = await getOrCreateActiveCart();
  const existing = await db
    .select()
    .from(cartItems)
    .where(and(eq(cartItems.cartId, cart.id), eq(cartItems.productVariantId, variantId)));
  if (existing.length) {
    await db
      .update(cartItems)
      .set({ quantity: existing[0]!.quantity + quantity })
      .where(eq(cartItems.id, existing[0]!.id));
  } else {
    await db.insert(cartItems).values({ cartId: cart.id, productVariantId: variantId, quantity });
  }
  return getCart();
}

export async function updateCartItem(cartItemId: string, update: { quantity?: number; variantId?: string }) {
  if (update.quantity !== undefined && update.quantity < 1) {
    await db.delete(cartItems).where(eq(cartItems.id, cartItemId));
    return getCart();
  }

  if (update.variantId) {
    // Move to another variant; if it exists already, merge quantities
    const current = (await db.select().from(cartItems).where(eq(cartItems.id, cartItemId)))[0];
    if (!current) return getCart();
    const dupe = (await db
      .select()
      .from(cartItems)
      .where(and(eq(cartItems.cartId, current.cartId), eq(cartItems.productVariantId, update.variantId))))[0];
    if (dupe) {
      await db
        .update(cartItems)
        .set({ quantity: (update.quantity ?? current.quantity) + dupe.quantity })
        .where(eq(cartItems.id, dupe.id));
      await db.delete(cartItems).where(eq(cartItems.id, current.id));
      return getCart();
    }
    await db
      .update(cartItems)
      .set({ productVariantId: update.variantId, quantity: update.quantity ?? current.quantity })
      .where(eq(cartItems.id, cartItemId));
    return getCart();
  }

  if (update.quantity !== undefined) {
    await db.update(cartItems).set({ quantity: update.quantity }).where(eq(cartItems.id, cartItemId));
  }
  return getCart();
}

export async function removeCartItem(cartItemId: string) {
  await db.delete(cartItems).where(eq(cartItems.id, cartItemId));
  return getCart();
}

export async function clearCart() {
  const cart = await getOrCreateActiveCart();
  await db.delete(cartItems).where(eq(cartItems.cartId, cart.id));
  return getCart();
}

export async function proceedToCheckout() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth");
  }
  redirect("/checkout");
}


