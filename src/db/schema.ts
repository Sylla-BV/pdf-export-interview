import { pgTable, text, timestamp, varchar, serial } from "drizzle-orm/pg-core"

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name"),
})

// Add our PDF exports table
export const pdfExports = pgTable("pdf_exports", {
  id: text("id").primaryKey(),
  status: varchar("status", { length: 20 }).notNull(),
  sourceUrl: text("source_url"),
  tempUrl: text("temp_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  expiresAt: timestamp("expires_at"),
  error: text("error"),
})
