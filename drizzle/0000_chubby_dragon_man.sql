CREATE TABLE "pdf_exports" (
	"id" text PRIMARY KEY NOT NULL,
	"status" varchar(20) NOT NULL,
	"source_url" text,
	"temp_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp,
	"error" text
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text
);
