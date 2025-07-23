import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name'),
});

export const pdf_exports = pgTable('pdf_exports', {
  id: serial('id').primaryKey(),
  token: text('token').notNull().unique(),
  pdf_url: text('pdf_url').notNull(),
  created_at: timestamp('created_at').notNull().defaultNow(),
  expires_at: timestamp('expires_at').notNull(),
});
