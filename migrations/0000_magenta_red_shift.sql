CREATE TABLE "brands" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"image_url" text NOT NULL,
	"celeb_wearers" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"image_url" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "celebrities" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"profession" text NOT NULL,
	"image_url" text NOT NULL,
	"description" text,
	"category" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"is_elite" boolean DEFAULT false NOT NULL,
	"manager_info" jsonb,
	"styling_details" jsonb
);
--> statement-breakpoint
CREATE TABLE "celebrity_brands" (
	"id" serial PRIMARY KEY NOT NULL,
	"celebrity_id" integer NOT NULL,
	"brand_id" integer NOT NULL,
	"description" text,
	"item_type" text,
	"category_id" integer,
	"image_position" jsonb NOT NULL,
	"equipment_specs" jsonb,
	"occasion_pricing" jsonb,
	"relationship_start_year" integer,
	"grand_slam_appearances" jsonb
);
--> statement-breakpoint
CREATE TABLE "permissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE "plans" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"image_url" text NOT NULL,
	"price" text NOT NULL,
	"discount" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"features" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "role_permissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"role_id" integer NOT NULL,
	"permission_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE "tournament_outfits" (
	"id" serial PRIMARY KEY NOT NULL,
	"celebrity_id" integer NOT NULL,
	"tournament_id" integer NOT NULL,
	"year" integer NOT NULL,
	"description" text,
	"image_url" text NOT NULL,
	"result" text,
	"outfit_details" jsonb NOT NULL,
	"associated_brands" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tournaments" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"location" text NOT NULL,
	"surface_type" text NOT NULL,
	"start_date" text NOT NULL,
	"end_date" text NOT NULL,
	"description" text,
	"image_url" text NOT NULL,
	"tier" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_roles" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"role_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text,
	"email" text,
	"google_id" text,
	"display_name" text,
	"profile_picture" text,
	"first_name" text,
	"last_name" text,
	"phone" text,
	"account_status" text DEFAULT 'Active' NOT NULL,
	"source" text DEFAULT 'local' NOT NULL,
	"reset_token" text,
	"reset_token_expires" integer,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_google_id_unique" UNIQUE("google_id")
);
