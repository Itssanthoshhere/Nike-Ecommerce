import { pgTable, text, timestamp, uuid, integer, numeric, jsonb, real } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { z } from 'zod';
import { products } from './products';
import { colors } from './filters/colors';
import { sizes } from './filters/sizes';
import { productImages } from './images';
import { orderItems } from './orders';
import { cartItems } from './carts';

export const productVariants = pgTable('product_variants', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('product_id').references(() => products.id, { onDelete: 'cascade' }).notNull(),
  sku: text('sku').notNull().unique(),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  salePrice: numeric('sale_price', { precision: 10, scale: 2 }),
  colorId: uuid('color_id').references(() => colors.id, { onDelete: 'restrict' }).notNull(),
  sizeId: uuid('size_id').references(() => sizes.id, { onDelete: 'restrict' }).notNull(),
  inStock: integer('in_stock').notNull().default(0),
  weight: real('weight'),
  dimensions: jsonb('dimensions'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const productVariantsRelations = relations(productVariants, ({ one, many }) => ({
  product: one(products, {
    fields: [productVariants.productId],
    references: [products.id],
  }),
  color: one(colors, {
    fields: [productVariants.colorId],
    references: [colors.id],
  }),
  size: one(sizes, {
    fields: [productVariants.sizeId],
    references: [sizes.id],
  }),
  images: many(productImages),
  orderItems: many(orderItems),
  cartItems: many(cartItems),
}));

export const insertVariantSchema = z.object({
  productId: z.string().uuid(),
  sku: z.string().min(1),
  price: z.string(),
  salePrice: z.string().optional().nullable(),
  colorId: z.string().uuid(),
  sizeId: z.string().uuid(),
  inStock: z.number().int().nonnegative().optional(),
  weight: z.number().optional().nullable(),
  dimensions: z
    .object({
      length: z.number(),
      width: z.number(),
      height: z.number(),
    })
    .partial()
    .optional()
    .nullable(),
  createdAt: z.date().optional(),
});
export const selectVariantSchema = insertVariantSchema.extend({
  id: z.string().uuid(),
});
export type InsertVariant = z.infer<typeof insertVariantSchema>;
export type SelectVariant = z.infer<typeof selectVariantSchema>;
