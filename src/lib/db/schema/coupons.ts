import { pgEnum, pgTable, uuid, text, numeric, timestamp, integer } from 'drizzle-orm/pg-core';
import { z } from 'zod';

export const discountTypeEnum = pgEnum('discount_type', ['percentage', 'fixed']);

export const coupons = pgTable('coupons', {
  id: uuid('id').primaryKey().defaultRandom(),
  code: text('code').notNull().unique(),
  discountType: discountTypeEnum('discount_type').notNull(),
  discountValue: numeric('discount_value').notNull(),
  expiresAt: timestamp('expires_at'),
  maxUsage: integer('max_usage').notNull().default(0),
  usedCount: integer('used_count').notNull().default(0),
});

export const insertCouponSchema = z.object({
  code: z.string().min(1),
  discountType: z.enum(['percentage', 'fixed']),
  discountValue: z.number(),
  expiresAt: z.date().optional().nullable(),
  maxUsage: z.number().int().nonnegative().optional(),
  usedCount: z.number().int().nonnegative().optional(),
});
export const selectCouponSchema = insertCouponSchema.extend({
  id: z.string().uuid(),
});
export type InsertCoupon = z.infer<typeof insertCouponSchema>;
export type SelectCoupon = z.infer<typeof selectCouponSchema>;
