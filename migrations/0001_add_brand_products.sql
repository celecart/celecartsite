CREATE TABLE IF NOT EXISTS "brand_products" (
  "id" serial PRIMARY KEY NOT NULL,
  "brand_id" integer NOT NULL,
  "name" text NOT NULL,
  "description" text,
  "category" text,
  "product_category" text,
  "image_url" text NOT NULL,
  "price" text,
  "website" text,
  "purchase_link" text,
  "rating" integer,
  "is_active" boolean DEFAULT true NOT NULL,
  "is_featured" boolean DEFAULT false NOT NULL,
  "created_at" text NOT NULL DEFAULT now(),
  "updated_at" text NOT NULL DEFAULT now(),
  "metadata" jsonb
);