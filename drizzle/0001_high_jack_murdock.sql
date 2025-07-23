CREATE TABLE "pdf_exports" (
	"id" serial PRIMARY KEY NOT NULL,
	"token" text NOT NULL,
	"pdf_url" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp NOT NULL,
	CONSTRAINT "pdf_exports_token_unique" UNIQUE("token")
);
