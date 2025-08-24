import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const guests = pgTable('guests', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionToken: text('session_token').unique().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  expiresAt: timestamp('expires_at').notNull(),
});
