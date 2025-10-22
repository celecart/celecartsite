CREATE TABLE "blogs" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"excerpt" text,
	"image_url" text,
	"author_id" integer NOT NULL,
	"celebrity_id" integer,
	"category" text DEFAULT 'general' NOT NULL,
	"tags" jsonb,
	"is_published" boolean DEFAULT false NOT NULL,
	"published_at" text,
	"created_at" text DEFAULT 'now()' NOT NULL,
	"updated_at" text DEFAULT 'now()' NOT NULL,
	"view_count" integer DEFAULT 0 NOT NULL,
	"likes" integer DEFAULT 0 NOT NULL
);
