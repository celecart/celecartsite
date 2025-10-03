import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const celebrities = pgTable("celebrities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  profession: text("profession").notNull(),
  imageUrl: text("image_url").notNull(),
  description: text("description"),
  category: text("category").notNull(), // e.g., "Red Carpet", "Street Style", etc.
  isElite: boolean("is_elite").default(false).notNull(), // Premium/Elite profile status
  managerInfo: jsonb("manager_info").$type<{
    name: string;
    agency: string;
    email: string;
    phone: string;
    bookingInquiries: string;
  } | null>(),
  stylingDetails: jsonb("styling_details").$type<{
    occasion: string;
    outfit: {
      designer: string;
      price: string;
      details: string;
      purchaseLink?: string;
    };
    hairStylist?: {
      name: string;
      instagram?: string;
      website?: string;
      details?: string;
    };
    makeupArtist?: {
      name: string;
      instagram?: string;
      website?: string;
      details?: string;
    };
    image?: string;
  }[] | null>(),
});

export const insertCelebritySchema = createInsertSchema(celebrities).pick({
  name: true,
  profession: true,
  imageUrl: true,
  description: true,
  category: true,
  isElite: true,
  managerInfo: true,
  stylingDetails: true,
});

export type InsertCelebrity = z.infer<typeof insertCelebritySchema>;
export type Celebrity = typeof celebrities.$inferSelect;

export const brands = pgTable("brands", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  imageUrl: text("image_url").notNull(),
  celebWearers: jsonb("celeb_wearers").notNull().$type<string[]>(), // Array of celebrity initials
});

export const insertBrandSchema = createInsertSchema(brands).pick({
  name: true,
  description: true,
  imageUrl: true,
  celebWearers: true,
});

export type InsertBrand = z.infer<typeof insertBrandSchema>;
export type Brand = typeof brands.$inferSelect;

export const celebrityBrands = pgTable("celebrity_brands", {
  id: serial("id").primaryKey(),
  celebrityId: integer("celebrity_id").notNull(),
  brandId: integer("brand_id").notNull(),
  description: text("description"),
  itemType: text("item_type"), // e.g., "Racquet", "Shoes", "Watch", etc.
  categoryId: integer("category_id"), // References the occasion/category
  imagePosition: jsonb("image_position").notNull().$type<{ top: string; left: string }>(), // Position for hotspot on image
  equipmentSpecs: jsonb("equipment_specs").$type<{
    weight?: string;
    material?: string;
    stringTension?: string;
    size?: string;
    color?: string;
    releaseYear?: number;
    price?: string;
    purchaseLink?: string;
    stockStatus?: string;
    serialNumber?: string;
    ratings?: {
      quality?: number;
      comfort?: number;
      style?: number;
      value?: number;
    };
  }>(), // Technical specifications for equipment
  occasionPricing: jsonb("occasion_pricing").$type<{
    [key: string]: {
      price: string;
      discount?: string;
      availableColors?: string[];
      customOptions?: string[];
      limitedEdition?: boolean;
    }
  }>(), // Pricing for different occasions/categories
  relationshipStartYear: integer("relationship_start_year"), // When the endorsement began
  grandSlamAppearances: jsonb("grand_slam_appearances").$type<string[]>(), // Where this equipment/brand was used
});

export const insertCelebrityBrandSchema = createInsertSchema(celebrityBrands).pick({
  celebrityId: true,
  brandId: true,
  description: true,
  itemType: true,
  categoryId: true,
  imagePosition: true,
  equipmentSpecs: true,
  occasionPricing: true,
  relationshipStartYear: true,
  grandSlamAppearances: true,
});

export type InsertCelebrityBrand = z.infer<typeof insertCelebrityBrandSchema>;
export type CelebrityBrand = typeof celebrityBrands.$inferSelect;

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
});

export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  description: true,
  imageUrl: true,
});

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

// Original users table - keeping it for authentication if needed
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("user"),
  permissions: jsonb("permissions").notNull().$type<string[]>(),
  imageUrl: text("image_url"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Tennis tournament specific tables
export const tournaments = pgTable("tournaments", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  surfaceType: text("surface_type").notNull(), // Clay, Grass, Hard, etc.
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  description: text("description"),
  imageUrl: text("image_url").notNull(),
  tier: text("tier").notNull(), // Grand Slam, Masters 1000, etc.
});

export const insertTournamentSchema = createInsertSchema(tournaments).pick({
  name: true,
  location: true,
  surfaceType: true,
  startDate: true,
  endDate: true,
  description: true,
  imageUrl: true,
  tier: true,
});

export type InsertTournament = z.infer<typeof insertTournamentSchema>;
export type Tournament = typeof tournaments.$inferSelect;

// Celebrity tournament performances and outfits
export const tournamentOutfits = pgTable("tournament_outfits", {
  id: serial("id").primaryKey(),
  celebrityId: integer("celebrity_id").notNull(),
  tournamentId: integer("tournament_id").notNull(),
  year: integer("year").notNull(),
  description: text("description"),
  imageUrl: text("image_url").notNull(),
  result: text("result"), // Winner, Runner-up, Semi-finalist, etc.
  outfitDetails: jsonb("outfit_details").notNull().$type<{
    mainColor: string;
    accentColor?: string;
    specialFeatures?: string;
    designInspiration?: string;
  }>(),
  associatedBrands: jsonb("associated_brands").notNull().$type<number[]>(), // Array of brand IDs
});

export const insertTournamentOutfitSchema = createInsertSchema(tournamentOutfits).pick({
  celebrityId: true,
  tournamentId: true,
  year: true,
  description: true,
  imageUrl: true,
  result: true,
  outfitDetails: true,
  associatedBrands: true,
});

export type InsertTournamentOutfit = z.infer<typeof insertTournamentOutfitSchema>;
export type TournamentOutfit = typeof tournamentOutfits.$inferSelect;
