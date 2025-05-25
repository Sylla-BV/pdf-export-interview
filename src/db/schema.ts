import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const pdfExports = pgTable('pdf_exports', {
  id: serial('id').primaryKey(),
  fileName: text('file_name'),
  tempUrl: text('temp_url'),
  reference: text('reference'),
  createdAt: timestamp('created_at').defaultNow(),
});
