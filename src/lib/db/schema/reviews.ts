import { pgTable, text, timestamp, uuid, integer } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';
import { z } from 'zod';
import { products } from './products';
import { users } from './user';

export const reviews = pgTable('reviews', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('product_id').references(() => products.id, { onDelete: 'cascade' }).notNull(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  rating: integer('rating').notNull(),
  comment: text('comment'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (t) => ({
  ratingRange: sql`CHECK (${t.rating.name} BETWEEN 1 AND 5)`,
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  product: one(products, {
    fields: [reviews.productId],
    references: [products.id],
  }),
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
}));

export const insertReviewSchema = z.object({
  productId: z.string().uuid(),
  userId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional().nullable(),
  createdAt: z.date().optional(),
});
export const selectReviewSchema = insertReviewSchema.extend({
  id: z.string().uuid(),
});
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type SelectReview = z.infer<typeof selectReviewSchema>;
