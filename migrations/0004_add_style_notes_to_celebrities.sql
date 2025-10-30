-- Add style_notes column to celebrities table if it doesn't exist
ALTER TABLE "celebrities" ADD COLUMN IF NOT EXISTS "style_notes" text;

-- Optionally, backfill existing rows with NULL (implicit default)
-- UPDATE "celebrities" SET "style_notes" = NULL WHERE "style_notes" IS NULL;