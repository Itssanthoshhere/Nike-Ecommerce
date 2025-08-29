import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { z } from 'zod';
import { products } from './products';

export const collections = pgTable('collections', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const productCollections = pgTable('product_collections', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('product_id').references(() => products.id, { onDelete: 'cascade' }).notNull(),
  collectionId: uuid('collection_id').references(() => collections.id, { onDelete: 'cascade' }).notNull(),
});

export const collectionsRelations = relations(collections, ({ many }) => ({
  junctions: many(productCollections),
}));

export const productCollectionsRelations = relations(productCollections, ({ one }) => ({
  collection: one(collections, {
    fields: [productCollections.collectionId],
    references: [collections.id],
  }),
  product: one(products, {
    fields: [productCollections.productId],
    references: [products.id],
  }),
}));

export const insertCollectionSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  createdAt: z.date().optional(),
});
export const selectCollectionSchema = insertCollectionSchema.extend({
  id: z.string().uuid(),
});
export type InsertCollection = z.infer<typeof insertCollectionSchema>;
export type SelectCollection = z.infer<typeof selectCollectionSchema>;

export const insertProductCollectionSchema = z.object({
  productId: z.string().uuid(),
  collectionId: z.string().uuid(),
});
export const selectProductCollectionSchema = insertProductCollectionSchema.extend({
  id: z.string().uuid(),
});
export type InsertProductCollection = z.infer<typeof insertProductCollectionSchema>;
export type SelectProductCollection = z.infer<typeof selectProductCollectionSchema>;
