import { pgTable, check, serial, text, jsonb, boolean, integer, unique } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const brands = pgTable("brands", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	description: text(),
	imageUrl: text("image_url").notNull(),
	celebWearers: jsonb("celeb_wearers").notNull(),
}, (table) => [
	check("brands_id_not_null", sql`NOT NULL id`),
	check("brands_name_not_null", sql`NOT NULL name`),
	check("brands_image_url_not_null", sql`NOT NULL image_url`),
	check("brands_celeb_wearers_not_null", sql`NOT NULL celeb_wearers`),
]);

export const categories = pgTable("categories", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	description: text().notNull(),
	imageUrl: text("image_url").notNull(),
}, (table) => [
	check("categories_id_not_null", sql`NOT NULL id`),
	check("categories_name_not_null", sql`NOT NULL name`),
	check("categories_description_not_null", sql`NOT NULL description`),
	check("categories_image_url_not_null", sql`NOT NULL image_url`),
]);

export const celebrities = pgTable("celebrities", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	profession: text().notNull(),
	imageUrl: text("image_url").notNull(),
	description: text(),
	category: text().notNull(),
	userId: integer("user_id"),
	isActive: boolean("is_active").default(true).notNull(),
	isElite: boolean("is_elite").default(false).notNull(),
	managerInfo: jsonb("manager_info"),
	stylingDetails: jsonb("styling_details"),
}, (table) => [
	check("celebrities_id_not_null", sql`NOT NULL id`),
	check("celebrities_name_not_null", sql`NOT NULL name`),
	check("celebrities_profession_not_null", sql`NOT NULL profession`),
	check("celebrities_image_url_not_null", sql`NOT NULL image_url`),
	check("celebrities_category_not_null", sql`NOT NULL category`),
	check("celebrities_is_active_not_null", sql`NOT NULL is_active`),
	check("celebrities_is_elite_not_null", sql`NOT NULL is_elite`),
]);

export const celebrityBrands = pgTable("celebrity_brands", {
	id: serial().primaryKey().notNull(),
	celebrityId: integer("celebrity_id").notNull(),
	brandId: integer("brand_id").notNull(),
	description: text(),
	itemType: text("item_type"),
	categoryId: integer("category_id"),
	imagePosition: jsonb("image_position").notNull(),
	equipmentSpecs: jsonb("equipment_specs"),
	occasionPricing: jsonb("occasion_pricing"),
	relationshipStartYear: integer("relationship_start_year"),
	grandSlamAppearances: jsonb("grand_slam_appearances"),
}, (table) => [
	check("celebrity_brands_id_not_null", sql`NOT NULL id`),
	check("celebrity_brands_celebrity_id_not_null", sql`NOT NULL celebrity_id`),
	check("celebrity_brands_brand_id_not_null", sql`NOT NULL brand_id`),
	check("celebrity_brands_image_position_not_null", sql`NOT NULL image_position`),
]);

export const celebrityProducts = pgTable("celebrity_products", {
	id: serial().primaryKey().notNull(),
	celebrityId: integer("celebrity_id").notNull(),
	name: text().notNull(),
	description: text(),
	category: text().notNull(),
	imageUrl: text("image_url").notNull(),
	price: text(),
	location: text(),
	website: text(),
	purchaseLink: text("purchase_link"),
	rating: integer(),
	isActive: boolean("is_active").default(true).notNull(),
	isFeatured: boolean("is_featured").default(false).notNull(),
	createdAt: text("created_at").default('now()').notNull(),
	updatedAt: text("updated_at").default('now()').notNull(),
	metadata: jsonb(),
}, (table) => [
	check("celebrity_products_id_not_null", sql`NOT NULL id`),
	check("celebrity_products_celebrity_id_not_null", sql`NOT NULL celebrity_id`),
	check("celebrity_products_name_not_null", sql`NOT NULL name`),
	check("celebrity_products_category_not_null", sql`NOT NULL category`),
	check("celebrity_products_image_url_not_null", sql`NOT NULL image_url`),
	check("celebrity_products_is_active_not_null", sql`NOT NULL is_active`),
	check("celebrity_products_is_featured_not_null", sql`NOT NULL is_featured`),
	check("celebrity_products_created_at_not_null", sql`NOT NULL created_at`),
	check("celebrity_products_updated_at_not_null", sql`NOT NULL updated_at`),
]);

export const permissions = pgTable("permissions", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	description: text(),
}, (table) => [
	check("permissions_id_not_null", sql`NOT NULL id`),
	check("permissions_name_not_null", sql`NOT NULL name`),
]);

export const plans = pgTable("plans", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	imageUrl: text("image_url").notNull(),
	price: text().notNull(),
	discount: text(),
	isActive: boolean("is_active").default(true).notNull(),
	features: jsonb().notNull(),
}, (table) => [
	check("plans_id_not_null", sql`NOT NULL id`),
	check("plans_name_not_null", sql`NOT NULL name`),
	check("plans_image_url_not_null", sql`NOT NULL image_url`),
	check("plans_price_not_null", sql`NOT NULL price`),
	check("plans_is_active_not_null", sql`NOT NULL is_active`),
	check("plans_features_not_null", sql`NOT NULL features`),
]);

export const rolePermissions = pgTable("role_permissions", {
	id: serial().primaryKey().notNull(),
	roleId: integer("role_id").notNull(),
	permissionId: integer("permission_id").notNull(),
}, (table) => [
	check("role_permissions_id_not_null", sql`NOT NULL id`),
	check("role_permissions_role_id_not_null", sql`NOT NULL role_id`),
	check("role_permissions_permission_id_not_null", sql`NOT NULL permission_id`),
]);

export const roles = pgTable("roles", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	description: text(),
}, (table) => [
	check("roles_id_not_null", sql`NOT NULL id`),
	check("roles_name_not_null", sql`NOT NULL name`),
]);

export const tournamentOutfits = pgTable("tournament_outfits", {
	id: serial().primaryKey().notNull(),
	celebrityId: integer("celebrity_id").notNull(),
	tournamentId: integer("tournament_id").notNull(),
	year: integer().notNull(),
	description: text(),
	imageUrl: text("image_url").notNull(),
	result: text(),
	outfitDetails: jsonb("outfit_details").notNull(),
	associatedBrands: jsonb("associated_brands").notNull(),
}, (table) => [
	check("tournament_outfits_id_not_null", sql`NOT NULL id`),
	check("tournament_outfits_celebrity_id_not_null", sql`NOT NULL celebrity_id`),
	check("tournament_outfits_tournament_id_not_null", sql`NOT NULL tournament_id`),
	check("tournament_outfits_year_not_null", sql`NOT NULL year`),
	check("tournament_outfits_image_url_not_null", sql`NOT NULL image_url`),
	check("tournament_outfits_outfit_details_not_null", sql`NOT NULL outfit_details`),
	check("tournament_outfits_associated_brands_not_null", sql`NOT NULL associated_brands`),
]);

export const tournaments = pgTable("tournaments", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	location: text().notNull(),
	surfaceType: text("surface_type").notNull(),
	startDate: text("start_date").notNull(),
	endDate: text("end_date").notNull(),
	description: text(),
	imageUrl: text("image_url").notNull(),
	tier: text().notNull(),
}, (table) => [
	check("tournaments_id_not_null", sql`NOT NULL id`),
	check("tournaments_name_not_null", sql`NOT NULL name`),
	check("tournaments_location_not_null", sql`NOT NULL location`),
	check("tournaments_surface_type_not_null", sql`NOT NULL surface_type`),
	check("tournaments_start_date_not_null", sql`NOT NULL start_date`),
	check("tournaments_end_date_not_null", sql`NOT NULL end_date`),
	check("tournaments_image_url_not_null", sql`NOT NULL image_url`),
	check("tournaments_tier_not_null", sql`NOT NULL tier`),
]);

export const userRoles = pgTable("user_roles", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	roleId: integer("role_id").notNull(),
}, (table) => [
	check("user_roles_id_not_null", sql`NOT NULL id`),
	check("user_roles_user_id_not_null", sql`NOT NULL user_id`),
	check("user_roles_role_id_not_null", sql`NOT NULL role_id`),
]);

export const users = pgTable("users", {
	id: serial().primaryKey().notNull(),
	username: text().notNull(),
	password: text(),
	email: text(),
	googleId: text("google_id"),
	displayName: text("display_name"),
	profilePicture: text("profile_picture"),
	firstName: text("first_name"),
	lastName: text("last_name"),
	phone: text(),
\tprofession: text(),
\tdescription: text(),
\tcategory: text(),
\tinstagram: text(),
\ttwitter: text(),
\tyoutube: text(),
\ttiktok: text(),
	accountStatus: text("account_status").default('Active').notNull(),
	source: text().default('local').notNull(),
	resetToken: text("reset_token"),
	resetTokenExpires: integer("reset_token_expires"),
}, (table) => [
	unique("users_username_unique").on(table.username),
	unique("users_email_unique").on(table.email),
	unique("users_google_id_unique").on(table.googleId),
	check("users_id_not_null", sql`NOT NULL id`),
	check("users_username_not_null", sql`NOT NULL username`),
	check("users_account_status_not_null", sql`NOT NULL account_status`),
	check("users_source_not_null", sql`NOT NULL source`),
]);

