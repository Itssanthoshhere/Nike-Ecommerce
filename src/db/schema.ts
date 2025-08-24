import { pgTable, serial, text, integer, decimal, timestamp, boolean } from 'drizzle-orm/pg-core';

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  category: text('category').notNull(),
  brand: text('brand').notNull(),
  imageUrl: text('image_url').notNull(),
  sizes: text('sizes').array().notNull(),
  colors: text('colors').array().notNull(),
  inStock: boolean('in_stock').default(true),
  rating: decimal('rating', { precision: 3, scale: 2 }).default('0.00'),
  reviewCount: integer('review_count').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
