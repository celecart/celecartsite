-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "brands" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"image_url" text NOT NULL,
	"celeb_wearers" jsonb NOT NULL,
	CONSTRAINT "brands_id_not_null" CHECK (NOT NULL id),
	CONSTRAINT "brands_name_not_null" CHECK (NOT NULL name),
	CONSTRAINT "brands_image_url_not_null" CHECK (NOT NULL image_url),
	CONSTRAINT "brands_celeb_wearers_not_null" CHECK (NOT NULL celeb_wearers)
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"image_url" text NOT NULL,
	CONSTRAINT "categories_id_not_null" CHECK (NOT NULL id),
	CONSTRAINT "categories_name_not_null" CHECK (NOT NULL name),
	CONSTRAINT "categories_description_not_null" CHECK (NOT NULL description),
	CONSTRAINT "categories_image_url_not_null" CHECK (NOT NULL image_url)
);
--> statement-breakpoint
CREATE TABLE "celebrities" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"profession" text NOT NULL,
	"image_url" text NOT NULL,
	"description" text,
	"category" text NOT NULL,
	"is_elite" boolean DEFAULT false NOT NULL,
	"manager_info" jsonb,
	"styling_details" jsonb,
	CONSTRAINT "celebrities_id_not_null" CHECK (NOT NULL id),
	CONSTRAINT "celebrities_name_not_null" CHECK (NOT NULL name),
	CONSTRAINT "celebrities_profession_not_null" CHECK (NOT NULL profession),
	CONSTRAINT "celebrities_image_url_not_null" CHECK (NOT NULL image_url),
	CONSTRAINT "celebrities_category_not_null" CHECK (NOT NULL category),
	CONSTRAINT "celebrities_is_elite_not_null" CHECK (NOT NULL is_elite)
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
	"grand_slam_appearances" jsonb,
	CONSTRAINT "celebrity_brands_id_not_null" CHECK (NOT NULL id),
	CONSTRAINT "celebrity_brands_celebrity_id_not_null" CHECK (NOT NULL celebrity_id),
	CONSTRAINT "celebrity_brands_brand_id_not_null" CHECK (NOT NULL brand_id),
	CONSTRAINT "celebrity_brands_image_position_not_null" CHECK (NOT NULL image_position)
);
--> statement-breakpoint
CREATE TABLE "permissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	CONSTRAINT "permissions_id_not_null" CHECK (NOT NULL id),
	CONSTRAINT "permissions_name_not_null" CHECK (NOT NULL name)
);
--> statement-breakpoint
CREATE TABLE "plans" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"image_url" text NOT NULL,
	"price" text NOT NULL,
	"discount" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"features" jsonb NOT NULL,
	CONSTRAINT "plans_id_not_null" CHECK (NOT NULL id),
	CONSTRAINT "plans_name_not_null" CHECK (NOT NULL name),
	CONSTRAINT "plans_image_url_not_null" CHECK (NOT NULL image_url),
	CONSTRAINT "plans_price_not_null" CHECK (NOT NULL price),
	CONSTRAINT "plans_is_active_not_null" CHECK (NOT NULL is_active),
	CONSTRAINT "plans_features_not_null" CHECK (NOT NULL features)
);
--> statement-breakpoint
CREATE TABLE "role_permissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"role_id" integer NOT NULL,
	"permission_id" integer NOT NULL,
	CONSTRAINT "role_permissions_id_not_null" CHECK (NOT NULL id),
	CONSTRAINT "role_permissions_role_id_not_null" CHECK (NOT NULL role_id),
	CONSTRAINT "role_permissions_permission_id_not_null" CHECK (NOT NULL permission_id)
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	CONSTRAINT "roles_id_not_null" CHECK (NOT NULL id),
	CONSTRAINT "roles_name_not_null" CHECK (NOT NULL name)
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
	"associated_brands" jsonb NOT NULL,
	CONSTRAINT "tournament_outfits_id_not_null" CHECK (NOT NULL id),
	CONSTRAINT "tournament_outfits_celebrity_id_not_null" CHECK (NOT NULL celebrity_id),
	CONSTRAINT "tournament_outfits_tournament_id_not_null" CHECK (NOT NULL tournament_id),
	CONSTRAINT "tournament_outfits_year_not_null" CHECK (NOT NULL year),
	CONSTRAINT "tournament_outfits_image_url_not_null" CHECK (NOT NULL image_url),
	CONSTRAINT "tournament_outfits_outfit_details_not_null" CHECK (NOT NULL outfit_details),
	CONSTRAINT "tournament_outfits_associated_brands_not_null" CHECK (NOT NULL associated_brands)
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
	"tier" text NOT NULL,
	CONSTRAINT "tournaments_id_not_null" CHECK (NOT NULL id),
	CONSTRAINT "tournaments_name_not_null" CHECK (NOT NULL name),
	CONSTRAINT "tournaments_location_not_null" CHECK (NOT NULL location),
	CONSTRAINT "tournaments_surface_type_not_null" CHECK (NOT NULL surface_type),
	CONSTRAINT "tournaments_start_date_not_null" CHECK (NOT NULL start_date),
	CONSTRAINT "tournaments_end_date_not_null" CHECK (NOT NULL end_date),
	CONSTRAINT "tournaments_image_url_not_null" CHECK (NOT NULL image_url),
	CONSTRAINT "tournaments_tier_not_null" CHECK (NOT NULL tier)
);
--> statement-breakpoint
CREATE TABLE "user_roles" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"role_id" integer NOT NULL,
	CONSTRAINT "user_roles_id_not_null" CHECK (NOT NULL id),
	CONSTRAINT "user_roles_user_id_not_null" CHECK (NOT NULL user_id),
	CONSTRAINT "user_roles_role_id_not_null" CHECK (NOT NULL role_id)
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
	CONSTRAINT "users_google_id_unique" UNIQUE("google_id"),
	CONSTRAINT "users_id_not_null" CHECK (NOT NULL id),
	CONSTRAINT "users_username_not_null" CHECK (NOT NULL username),
	CONSTRAINT "users_account_status_not_null" CHECK (NOT NULL account_status),
	CONSTRAINT "users_source_not_null" CHECK (NOT NULL source)
);

*/