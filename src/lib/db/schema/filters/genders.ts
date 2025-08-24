import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { z } from 'zod';
import { relations } from 'drizzle-orm';
import { products } from '../products';

export const genders = pgTable('genders', {
  id: uuid('id').primaryKey().defaultRandom(),
  label: text('label').notNull(),
  slug: text('slug').notNull().unique(),
});

export const gendersRelations = relations(genders, ({ many }) => ({
  products: many(products),
}));

export const insertGenderSchema = z.object({
  label: z.string().min(1),
  slug: z.string().min(1),
});
export const selectGenderSchema = insertGenderSchema.extend({
  id: z.string().uuid(),
});
export type InsertGender = z.infer<typeof insertGenderSchema>;
export type SelectGender = z.infer<typeof selectGenderSchema>;
