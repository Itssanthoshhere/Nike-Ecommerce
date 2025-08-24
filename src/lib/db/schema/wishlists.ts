import { pgTable, uuid, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { z } from 'zod';
import { users } from './user';
import { products } from './products';

export const wishlists = pgTable('wishlists', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  productId: uuid('product_id').references(() => products.id, { onDelete: 'cascade' }).notNull(),
  addedAt: timestamp('added_at').defaultNow().notNull(),
}, (t) => ({
  uniq: uniqueIndex('wishlists_user_product_uniq').on(t.userId, t.productId),
}));

export const wishlistsRelations = relations(wishlists, ({ one }) => ({
  user: one(users, {
    fields: [wishlists.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [wishlists.productId],
    references: [products.id],
  }),
}));

export const insertWishlistSchema = z.object({
  userId: z.string().uuid(),
  productId: z.string().uuid(),
  addedAt: z.date().optional(),
});
export const selectWishlistSchema = insertWishlistSchema.extend({
  id: z.string().uuid(),
});
export type InsertWishlist = z.infer<typeof insertWishlistSchema>;
export type SelectWishlist = z.infer<typeof selectWishlistSchema>;
