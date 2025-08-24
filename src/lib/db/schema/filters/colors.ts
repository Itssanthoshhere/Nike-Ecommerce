import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { z } from 'zod';
import { relations } from 'drizzle-orm';
import { productVariants } from '../variants';

export const colors = pgTable('colors', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  hexCode: text('hex_code').notNull(),
});

export const colorsRelations = relations(colors, ({ many }) => ({
  variants: many(productVariants),
}));

export const insertColorSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  hexCode: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
});
export const selectColorSchema = insertColorSchema.extend({
  id: z.string().uuid(),
});
export type InsertColor = z.infer<typeof insertColorSchema>;
export type SelectColor = z.infer<typeof selectColorSchema>;
