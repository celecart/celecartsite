-- Migration: Add Celebrity Vibes Events feature
-- Description: Add tables for celebrity vibes events where celebrities can showcase products for special occasions

-- Create celebrity_vibes_events table
CREATE TABLE IF NOT EXISTS "celebrity_vibes_events" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "event_type" TEXT NOT NULL,
  "image_url" TEXT NOT NULL,
  "start_date" TEXT NOT NULL,
  "end_date" TEXT NOT NULL,
  "is_active" BOOLEAN DEFAULT true NOT NULL,
  "is_featured" BOOLEAN DEFAULT false NOT NULL,
  "created_at" TEXT DEFAULT 'now()' NOT NULL,
  "updated_at" TEXT DEFAULT 'now()' NOT NULL,
  "metadata" JSONB,
  CONSTRAINT "celebrity_vibes_events_id_not_null" CHECK ("id" IS NOT NULL),
  CONSTRAINT "celebrity_vibes_events_name_not_null" CHECK ("name" IS NOT NULL),
  CONSTRAINT "celebrity_vibes_events_description_not_null" CHECK ("description" IS NOT NULL),
  CONSTRAINT "celebrity_vibes_events_event_type_not_null" CHECK ("event_type" IS NOT NULL),
  CONSTRAINT "celebrity_vibes_events_image_url_not_null" CHECK ("image_url" IS NOT NULL),
  CONSTRAINT "celebrity_vibes_events_start_date_not_null" CHECK ("start_date" IS NOT NULL),
  CONSTRAINT "celebrity_vibes_events_end_date_not_null" CHECK ("end_date" IS NOT NULL),
  CONSTRAINT "celebrity_vibes_events_is_active_not_null" CHECK ("is_active" IS NOT NULL),
  CONSTRAINT "celebrity_vibes_events_is_featured_not_null" CHECK ("is_featured" IS NOT NULL),
  CONSTRAINT "celebrity_vibes_events_created_at_not_null" CHECK ("created_at" IS NOT NULL),
  CONSTRAINT "celebrity_vibes_events_updated_at_not_null" CHECK ("updated_at" IS NOT NULL)
);

-- Create celebrity_event_products table (junction table)
CREATE TABLE IF NOT EXISTS "celebrity_event_products" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "event_id" INTEGER NOT NULL,
  "celebrity_id" INTEGER NOT NULL,
  "product_id" INTEGER NOT NULL,
  "display_order" INTEGER DEFAULT 0,
  "is_active" BOOLEAN DEFAULT true NOT NULL,
  "created_at" TEXT DEFAULT 'now()' NOT NULL,
  "notes" TEXT,
  CONSTRAINT "celebrity_event_products_id_not_null" CHECK ("id" IS NOT NULL),
  CONSTRAINT "celebrity_event_products_event_id_not_null" CHECK ("event_id" IS NOT NULL),
  CONSTRAINT "celebrity_event_products_celebrity_id_not_null" CHECK ("celebrity_id" IS NOT NULL),
  CONSTRAINT "celebrity_event_products_product_id_not_null" CHECK ("product_id" IS NOT NULL),
  CONSTRAINT "celebrity_event_products_is_active_not_null" CHECK ("is_active" IS NOT NULL),
  CONSTRAINT "celebrity_event_products_created_at_not_null" CHECK ("created_at" IS NOT NULL)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS "idx_celebrity_vibes_events_active" ON "celebrity_vibes_events" ("is_active");
CREATE INDEX IF NOT EXISTS "idx_celebrity_vibes_events_featured" ON "celebrity_vibes_events" ("is_featured");
CREATE INDEX IF NOT EXISTS "idx_celebrity_vibes_events_dates" ON "celebrity_vibes_events" ("start_date", "end_date");
CREATE INDEX IF NOT EXISTS "idx_celebrity_event_products_event" ON "celebrity_event_products" ("event_id");
CREATE INDEX IF NOT EXISTS "idx_celebrity_event_products_celebrity" ON "celebrity_event_products" ("celebrity_id");
CREATE INDEX IF NOT EXISTS "idx_celebrity_event_products_product" ON "celebrity_event_products" ("product_id");
