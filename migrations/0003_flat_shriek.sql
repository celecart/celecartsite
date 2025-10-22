CREATE TABLE "celebrity_products" (
	"id" serial PRIMARY KEY NOT NULL,
	"celebrity_id" integer NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"category" text NOT NULL,
	"image_url" text NOT NULL,
	"price" text,
	"location" text,
	"website" text,
	"purchase_link" text,
	"rating" integer,
	"is_active" boolean DEFAULT true NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"created_at" text DEFAULT 'now()' NOT NULL,
	"updated_at" text DEFAULT 'now()' NOT NULL,
	"metadata" jsonb
);
