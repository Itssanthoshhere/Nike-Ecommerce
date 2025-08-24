import { pgEnum, pgTable, timestamp, uuid, text } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { z } from 'zod';
import { orders } from './orders';

export const paymentMethodEnum = pgEnum('payment_method', ['stripe', 'paypal', 'cod']);
export const paymentStatusEnum = pgEnum('payment_status', ['initiated', 'completed', 'failed']);

export const payments = pgTable('payments', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id').references(() => orders.id, { onDelete: 'cascade' }).notNull(),
  method: paymentMethodEnum('method').notNull(),
  status: paymentStatusEnum('status').notNull().default('initiated'),
  paidAt: timestamp('paid_at'),
  transactionId: text('transaction_id'),
});

export const paymentsRelations = relations(payments, ({ one }) => ({
  order: one(orders, {
    fields: [payments.orderId],
    references: [orders.id],
  }),
}));

export const insertPaymentSchema = z.object({
  orderId: z.string().uuid(),
  method: z.enum(['stripe', 'paypal', 'cod']),
  status: z.enum(['initiated', 'completed', 'failed']).optional(),
  paidAt: z.date().optional().nullable(),
  transactionId: z.string().optional().nullable(),
});
export const selectPaymentSchema = insertPaymentSchema.extend({
  id: z.string().uuid(),
});
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type SelectPayment = z.infer<typeof selectPaymentSchema>;
