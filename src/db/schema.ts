import { pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name'),
});

export const pdfExports = pgTable('pdf_exports', {
  id: serial('id').primaryKey(),
  status: varchar('status', { length: 20 }).notNull().default('pending'),
  downloadUrl: text('download_url'),
  expiresAt: timestamp('expires_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}); 