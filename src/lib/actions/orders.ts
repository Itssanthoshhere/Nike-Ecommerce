"use server";

import { db } from "@/lib/db";
import { orders, orderItems, payments, paymentStatusEnum } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { stripe } from "@/lib/stripe/client";

export async function createOrder(stripeSessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(stripeSessionId, {
    expand: ["line_items"],
  });

  const total = session.amount_total ?? 0;
  const userId = (session.metadata?.userId && session.metadata.userId.length) ? session.metadata.userId : null;

  const [order] = await db
    .insert(orders)
    .values({ userId, status: "paid", totalAmount: Number((total / 100).toFixed(2)) })
    .returning();

  const items = session.line_items?.data ?? [];
  for (const li of items) {
    const price = li.price?.unit_amount ?? 0;
    await db.insert(orderItems).values({
      orderId: order.id,
      productVariantId: "00000000-0000-0000-0000-000000000000", // unknown variant in this demo; real app should map
      quantity: li.quantity ?? 1,
      priceAtPurchase: Number(((price ?? 0) / 100).toFixed(2)),
    });
  }

  await db.insert(payments).values({
    orderId: order.id,
    method: "stripe",
    status: "completed",
    paidAt: new Date(),
    transactionId: stripeSessionId,
  });

  return order;
}

export async function getOrder(orderId: string) {
  const rows = await db.query.orders.findFirst({ where: eq(orders.id, orderId) });
  return rows ?? null;
}


