import {

  users,

  type User,

  type InsertUser,

  celebrities,

  type Celebrity,

  type InsertCelebrity,

  brands,

  type Brand,

  type InsertBrand,

  celebrityBrands,

  type CelebrityBrand,

  type InsertCelebrityBrand,

  categories,

  type Category,

  type InsertCategory,

  tournaments,

  type Tournament,

  type InsertTournament,

  tournamentOutfits,

  type TournamentOutfit,

  type InsertTournamentOutfit,

  plans,

  type Plan,

  type InsertPlan,

  blogs,

  type Blog,

  type InsertBlog

} from "@shared/schema";

import { 

  mockCelebrities, 

  mockBrands, 

  mockCelebrityBrands, 

  mockCategories, 

  mockTournaments, 

  mockTournamentOutfits 

} from "@shared/data";

import { roles, permissions, rolePermissions, userRoles, type Role, type InsertRole, type Permission, type InsertPermission, type RolePermission, type InsertRolePermission, type UserRole, type InsertUserRole, celebrityProducts, type CelebrityProduct, type InsertCelebrityProduct } from "@shared/schema";

import { db } from "./db";

import { eq, and, desc, sql } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";


type UserActivity = {

  userId: number;

  type: string;

  timestamp: number;

  details?: any;

};



// Interface for all storage operations

export interface IStorage {

  // User operations

  getUser(id: number): Promise<User | undefined>;

  getUserByUsername(username: string): Promise<User | undefined>;

  getUserByEmail(email: string): Promise<User | undefined>;

  getUserByGoogleId(googleId: string): Promise<User | undefined>;

  createUser(user: InsertUser): Promise<User>;

  updateUserPasswordByEmail(email: string, password: string): Promise<boolean>;

  // Password reset operations

  storePasswordResetToken(userId: number, token: string, expiresAt: number): Promise<boolean>;

  verifyPasswordResetToken(userId: number, token: string): Promise<boolean>;

  updateUserPassword(userId: number, password: string): Promise<boolean>;

  clearPasswordResetToken(userId: number): Promise<boolean>;

  

  // Celebrity operations

  getCelebrities(): Promise<Celebrity[]>;

  getCelebrityById(id: number): Promise<Celebrity | undefined>;

  getCelebrityByUserId(userId: number): Promise<Celebrity | undefined>;

  getCelebritiesByCategory(category: string): Promise<Celebrity[]>;

  createCelebrity(celebrity: InsertCelebrity): Promise<Celebrity>;

  createCelebrityWithId(celebrity: InsertCelebrity, id: number): Promise<Celebrity>;

  updateCelebrity(id: number, celebrity: InsertCelebrity): Promise<Celebrity | undefined>;

  deleteCelebrity(id: number): Promise<boolean>;

  

  // Brand operations

  getBrands(): Promise<Brand[]>;

  getBrandById(id: number): Promise<Brand | undefined>;

  createBrand(brand: InsertBrand): Promise<Brand>;

  

  // CelebrityBrand operations

  getCelebrityBrands(celebrityId: number): Promise<CelebrityBrand[]>;

  createCelebrityBrand(celebrityBrand: InsertCelebrityBrand): Promise<CelebrityBrand>;

  

  // Category operations

  getCategories(): Promise<Category[]>;

  getCategoryById(id: number): Promise<Category | undefined>;

  createCategory(category: InsertCategory): Promise<Category>;

  updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined>;

  deleteCategory(id: number): Promise<boolean>;

  

  // Plan operations

  getPlans(): Promise<Plan[]>;

  getPlanById(id: number): Promise<Plan | undefined>;

  createPlan(plan: InsertPlan): Promise<Plan>;

  updatePlan(id: number, plan: Partial<InsertPlan>): Promise<Plan | undefined>;

  deletePlan(id: number): Promise<boolean>;

  

  // Tournament operations

  getTournaments(): Promise<Tournament[]>;

  getTournamentById(id: number): Promise<Tournament | undefined>;

  createTournament(tournament: InsertTournament): Promise<Tournament>;

  

  // TournamentOutfit operations

  getTournamentOutfits(): Promise<TournamentOutfit[]>;

  getTournamentOutfitById(id: number): Promise<TournamentOutfit | undefined>;

  getTournamentOutfitsByCelebrity(celebrityId: number): Promise<TournamentOutfit[]>;

  getTournamentOutfitsByTournament(tournamentId: number): Promise<TournamentOutfit[]>;

  createTournamentOutfit(tournamentOutfit: InsertTournamentOutfit): Promise<TournamentOutfit>;

  

  // Users list

  getUsers(): Promise<User[]>;

  // Add missing user update/delete operations for CRUD

  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;

  deleteUser(id: number): Promise<boolean>;

  

  // Roles CRUD

  getRoles(): Promise<Role[]>;

  getRoleById(id: number): Promise<Role | undefined>;

  createRole(role: InsertRole): Promise<Role>;

  updateRole(id: number, role: InsertRole): Promise<Role | undefined>;

  deleteRole(id: number): Promise<boolean>;

  

  // Permissions CRUD

  getPermissions(): Promise<Permission[]>;

  getPermissionById(id: number): Promise<Permission | undefined>;

  createPermission(permission: InsertPermission): Promise<Permission>;

  updatePermission(id: number, permission: InsertPermission): Promise<Permission | undefined>;

  deletePermission(id: number): Promise<boolean>;

  

  // Role-Permissions mapping

  getRolePermissions(roleId: number): Promise<RolePermission[]>;

  addPermissionToRole(roleId: number, permissionId: number): Promise<RolePermission>;

  removePermissionFromRole(roleId: number, permissionId: number): Promise<boolean>;

  

  // User-Roles mapping

  getUserRoles(userId: number): Promise<UserRole[]>;

  assignRoleToUser(userId: number, roleId: number): Promise<UserRole>;

  removeRoleFromUser(userId: number, roleId: number): Promise<boolean>;

  // User activity logging

  logUserActivity(activity: UserActivity): Promise<UserActivity>;

  getUserActivitiesByType(userId: number, activityType: string, limit?: number): Promise<UserActivity[]>;

  getUserActivities(userId: number, limit?: number): Promise<UserActivity[]>;

  getRecentActivities(limit?: number): Promise<UserActivity[]>;

  deleteUserActivities(userId: number): Promise<boolean>;

}



export class MemStorage implements IStorage {

  private users: Map<number, User>;

  private celebrities: Map<number, Celebrity>;

  private brands: Map<number, Brand>;

  private celebrityBrands: Map<number, CelebrityBrand>;

  private categories: Map<number, Category>;

  private tournaments: Map<number, Tournament>;

  private tournamentOutfits: Map<number, TournamentOutfit>;

  private plans: Map<number, Plan>;

  // Roles & Permissions storage

  private roles: Map<number, Role>;

  private permissions: Map<number, Permission>;

  private rolePermissions: Map<number, RolePermission>;

  private userRoles: Map<number, UserRole>;

  private userActivities: Map<number, UserActivity[]> = new Map();

  private blogs: Map<number, Blog> = new Map();

  private celebrityProducts: Map<number, CelebrityProduct> = new Map();

  

  private userId: number = 1;

  private celebrityId: number = 1;

  private brandId: number = 1;

  private celebrityBrandId: number = 1;

  private categoryId: number = 1;

  private tournamentId: number = 1;

  private tournamentOutfitId: number = 1;

  private planId: number = 1;

  // Counters for roles & permissions

  private roleId: number = 1;

  private permissionId: number = 1;

  private rolePermissionId: number = 1;

  private userRoleId: number = 1;



  constructor() {

    this.users = new Map();

    this.celebrities = new Map();

    this.brands = new Map();

    this.celebrityBrands = new Map();

    this.categories = new Map();

    this.tournaments = new Map();

    this.tournamentOutfits = new Map();

    this.plans = new Map();

    

    // Initialize maps for roles & permissions

    this.roles = new Map();

    this.permissions = new Map();

    this.rolePermissions = new Map();

    this.userRoles = new Map();

    

    // Initialize with mock data

    this.initializeMockData();

  }



  private initializeMockData() {

    // Use rawCelebritiesExport directly from shared/data.ts

    // This ensures we get the most up-to-date list including MrBeast

    

    // Load celebrities

    for (const celebrity of mockCelebrities) {

      // Ensure all celebrities have required properties initialized

      const celebWithDefaults = {

        ...celebrity,

        stylingDetails: celebrity.stylingDetails || null,

        isElite: false // Initialize all celebrities as non-elite by default

      };

      this.celebrities.set(celebrity.id, celebWithDefaults);

      if (celebrity.id >= this.celebrityId) {

        this.celebrityId = celebrity.id + 1;

      }

    }

    

    // Load brands

    for (const brand of mockBrands) {

      this.brands.set(brand.id, brand);

      if (brand.id >= this.brandId) {

        this.brandId = brand.id + 1;

      }

    }

    

    // Load celebrity-brand relationships

    for (const cb of mockCelebrityBrands) {

      this.celebrityBrands.set(cb.id, cb);

      if (cb.id >= this.celebrityBrandId) {

        this.celebrityBrandId = cb.id + 1;

      }

    }

    

    // Load categories

    for (const category of mockCategories) {

      this.categories.set(category.id, category);

      if (category.id >= this.categoryId) {

        this.categoryId = category.id + 1;

      }

    }

    

    // Load tournaments

    for (const tournament of mockTournaments) {

      this.tournaments.set(tournament.id, tournament);

      if (tournament.id >= this.tournamentId) {

        this.tournamentId = tournament.id + 1;

      }

    }

    

    // Initialize with no plans by default

    this.planId = 1;

    // Load tournament outfits

    for (const outfit of mockTournamentOutfits) {

      this.tournamentOutfits.set(outfit.id, outfit);

      if (outfit.id >= this.tournamentOutfitId) {

        this.tournamentOutfitId = outfit.id + 1;

      }

    }

  }



  // User operations

  async getUser(id: number): Promise<User | undefined> {

    return this.users.get(id);

  }



  async getUserByUsername(username: string): Promise<User | undefined> {

    return Array.from(this.users.values()).find(

      (user) => user.username === username,

    );

  }



  async getUserByEmail(email: string): Promise<User | undefined> {

    return Array.from(this.users.values()).find(

      (user) => user.email === email,

    );

  }



  async getUserByGoogleId(googleId: string): Promise<User | undefined> {

    return Array.from(this.users.values()).find(

      (user) => user.googleId === googleId,

    );

  }



  async createUser(insertUser: InsertUser): Promise<User> {

    const id = this.userId++;

    const user: User = { ...insertUser, id };

    this.users.set(id, user);

    return user;

  }



  async updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined> {

    const existing = this.users.get(id);

    if (!existing) return undefined;

    // Merge existing user with provided partial updates

    const updated: User = { ...existing, ...user, id: existing.id };

    this.users.set(id, updated);

    return updated;

  }



  async deleteUser(id: number): Promise<boolean> {

    return this.users.delete(id);

  }



  async updateUserPasswordByEmail(email: string, password: string): Promise<boolean> {

    const user = await this.getUserByEmail(email);

    if (!user) return false;

    const updated: User = { ...user, password };

    this.users.set(user.id, updated);

    return true;

  }



  async storePasswordResetToken(userId: number, token: string, expiresAt: number): Promise<boolean> {

    const user = await this.getUser(userId);

    if (!user) return false;

    const updated: User = { ...user, resetToken: token, resetTokenExpires: expiresAt } as User;

    this.users.set(user.id, updated);

    return true;

  }



  async verifyPasswordResetToken(userId: number, token: string): Promise<boolean> {

    const user = await this.getUser(userId);

    if (!user || !('resetToken' in user)) return false;

    const now = Date.now();

    return (user as any).resetToken === token && typeof (user as any).resetTokenExpires === 'number' && (user as any).resetTokenExpires > now;

  }



  async updateUserPassword(userId: number, password: string): Promise<boolean> {

    const user = await this.getUser(userId);

    if (!user) return false;

    const updated: User = { ...user, password };

    this.users.set(user.id, updated);

    return true;

  }



  async clearPasswordResetToken(userId: number): Promise<boolean> {

    const user = await this.getUser(userId);

    if (!user) return false;

    const updated: User = { ...user } as User;

    delete (updated as any).resetToken;

    delete (updated as any).resetTokenExpires;

    this.users.set(user.id, updated);

    return true;

  }



  // Celebrity operations

  async getCelebrities(): Promise<Celebrity[]> {

    return Array.from(this.celebrities.values());

  }

  

  async getCelebrityById(id: number): Promise<Celebrity | undefined> {

    return this.celebrities.get(id);

  }

  async getCelebrityByUserId(userId: number): Promise<Celebrity | undefined> {

    return Array.from(this.celebrities.values()).find(celebrity => celebrity.userId === userId);

  }

  

  async getCelebritiesByCategory(category: string): Promise<Celebrity[]> {

    return Array.from(this.celebrities.values()).filter(

      (celeb) => celeb.category === category

    );

  }

  

  async createCelebrity(insertCelebrity: InsertCelebrity): Promise<Celebrity> {

    const id = this.celebrityId++;

    

    // Safely handle stylingDetails with proper typing

    let stylingDetails = null;

    if (Array.isArray(insertCelebrity.stylingDetails)) {

      stylingDetails = insertCelebrity.stylingDetails.map(item => ({

        occasion: item.occasion,

        outfit: {

          designer: item.outfit.designer,

          price: item.outfit.price,

          details: item.outfit.details,

          purchaseLink: item.outfit.purchaseLink

        },

        hairStylist: item.hairStylist || undefined,

        makeupArtist: item.makeupArtist || undefined,

        image: item.image || undefined

      }));

    }

    

    // Ensure managerInfo is properly typed

    const managerInfo = (insertCelebrity.managerInfo && 

      typeof insertCelebrity.managerInfo === 'object' && 

      'name' in insertCelebrity.managerInfo) 

      ? insertCelebrity.managerInfo as { name: string; agency: string; email: string; phone: string; bookingInquiries: string; }

      : null;

    

    const celebrity: any = {

      id,

      name: insertCelebrity.name,

      profession: insertCelebrity.profession,

      imageUrl: insertCelebrity.imageUrl,

      description: insertCelebrity.description ?? null,

      category: insertCelebrity.category,

      isElite: insertCelebrity.isElite ?? false,

      managerInfo,

      stylingDetails,
      styleNotes: insertCelebrity.styleNotes ?? null
    };

    

    (celebrity as any).isActive = insertCelebrity.isActive ?? true;
    (celebrity as any).isActive = insertCelebrity.isActive ?? true;
    this.celebrities.set(id, celebrity);

    return celebrity;

  }

  

  async createCelebrityWithId(insertCelebrity: InsertCelebrity, id: number): Promise<Celebrity> {

    // Check if ID already exists

    if (this.celebrities.has(id)) {

      throw new Error(`Celebrity with ID ${id} already exists`);

    }

    

    // Update celebrityId counter if necessary

    if (id >= this.celebrityId) {

      this.celebrityId = id + 1;

    }

    

    // Safely handle stylingDetails with proper typing

    let stylingDetails = null;

    if (Array.isArray(insertCelebrity.stylingDetails)) {

      stylingDetails = insertCelebrity.stylingDetails.map(item => ({

        occasion: item.occasion,

        outfit: {

          designer: item.outfit.designer,

          price: item.outfit.price,

          details: item.outfit.details,

          purchaseLink: item.outfit.purchaseLink

        },

        hairStylist: item.hairStylist || undefined,

        makeupArtist: item.makeupArtist || undefined,

        image: item.image || undefined

      }));

    }

    

    // Ensure managerInfo is properly typed

    const managerInfo = (insertCelebrity.managerInfo && 

      typeof insertCelebrity.managerInfo === 'object' && 

      'name' in insertCelebrity.managerInfo) 

      ? insertCelebrity.managerInfo as { name: string; agency: string; email: string; phone: string; bookingInquiries: string; }

      : null;

    

    const celebrity: any = {

      id,

      name: insertCelebrity.name,

      profession: insertCelebrity.profession,

      imageUrl: insertCelebrity.imageUrl,

      description: insertCelebrity.description ?? null,

      category: insertCelebrity.category,

      isElite: insertCelebrity.isElite ?? false,

      managerInfo,

      stylingDetails,
      styleNotes: insertCelebrity.styleNotes ?? null
    };

    

    this.celebrities.set(id, celebrity);

    return celebrity;

  }

  

  async deleteCelebrity(id: number): Promise<boolean> {

    return this.celebrities.delete(id);

  }

  

  async updateCelebrity(id: number, insertCelebrity: InsertCelebrity): Promise<Celebrity | undefined> {

    const existingCelebrity = this.celebrities.get(id);

    if (!existingCelebrity) {

      return undefined;

    }

    

    // Safely handle stylingDetails with proper typing

    let stylingDetails = null;

    if (Array.isArray(insertCelebrity.stylingDetails)) {

      stylingDetails = insertCelebrity.stylingDetails.map(item => ({

        occasion: item.occasion,

        outfit: {

          designer: item.outfit.designer,

          price: item.outfit.price,

          details: item.outfit.details,

          purchaseLink: item.outfit.purchaseLink

        },

        hairStylist: item.hairStylist || undefined,

        makeupArtist: item.makeupArtist || undefined,

        image: item.image || undefined

      }));

    }

    

    // Ensure managerInfo is properly typed

    const managerInfo = (insertCelebrity.managerInfo && 

      typeof insertCelebrity.managerInfo === 'object' && 

      'name' in insertCelebrity.managerInfo) 

      ? insertCelebrity.managerInfo as { name: string; agency: string; email: string; phone: string; bookingInquiries: string; }

      : null;

    

    const updatedCelebrity: Celebrity = {

      id,

      name: insertCelebrity.name,

      profession: insertCelebrity.profession,

      imageUrl: insertCelebrity.imageUrl,

      description: insertCelebrity.description ?? null,

      category: insertCelebrity.category,

      isElite: insertCelebrity.isElite ?? false,

      managerInfo,

      stylingDetails,
      styleNotes: insertCelebrity.styleNotes ?? null
    };

    

    (updatedCelebrity as any).isActive = insertCelebrity.isActive ?? (existingCelebrity as any).isActive ?? true;
    this.celebrities.set(id, updatedCelebrity);

    return updatedCelebrity;

  }

  

  // Brand operations

  async getBrands(): Promise<Brand[]> {

    return Array.from(this.brands.values());

  }

  

  async getBrandById(id: number): Promise<Brand | undefined> {

    return this.brands.get(id);

  }

  

  async createBrand(insertBrand: InsertBrand): Promise<Brand> {

    const id = this.brandId++;

    

    // Ensure celebWearers is properly typed as string[]

    const celebWearers = Array.isArray(insertBrand.celebWearers) 

      ? insertBrand.celebWearers.filter(item => typeof item === 'string')

      : [];

      

    const brand: Brand = { 

      ...insertBrand, 

      id,

      description: insertBrand.description ?? null,

      celebWearers: celebWearers

    };

    this.brands.set(id, brand);

    return brand;

  }

  

  // CelebrityBrand operations

  async getCelebrityBrands(celebrityId: number): Promise<CelebrityBrand[]> {

    return Array.from(this.celebrityBrands.values()).filter(

      (cb) => cb.celebrityId === celebrityId

    );

  }

  

  async createCelebrityBrand(insertCelebrityBrand: InsertCelebrityBrand): Promise<CelebrityBrand> {

    const id = this.celebrityBrandId++;

    

    // Handle equipment specs properly

    let equipmentSpecs = null;

    if (insertCelebrityBrand.equipmentSpecs) {

      equipmentSpecs = {

        weight: typeof insertCelebrityBrand.equipmentSpecs.weight === 'string' ? insertCelebrityBrand.equipmentSpecs.weight : undefined,

        material: typeof insertCelebrityBrand.equipmentSpecs.material === 'string' ? insertCelebrityBrand.equipmentSpecs.material : undefined,

        stringTension: typeof insertCelebrityBrand.equipmentSpecs.stringTension === 'string' ? insertCelebrityBrand.equipmentSpecs.stringTension : undefined,

        size: typeof insertCelebrityBrand.equipmentSpecs.size === 'string' ? insertCelebrityBrand.equipmentSpecs.size : undefined,

        color: typeof insertCelebrityBrand.equipmentSpecs.color === 'string' ? insertCelebrityBrand.equipmentSpecs.color : undefined,

        releaseYear: typeof insertCelebrityBrand.equipmentSpecs.releaseYear === 'number' ? insertCelebrityBrand.equipmentSpecs.releaseYear : undefined

      };

    }

    

    // Ensure grandSlamAppearances is an array of strings

    const grandSlamAppearances = Array.isArray(insertCelebrityBrand.grandSlamAppearances) 

      ? insertCelebrityBrand.grandSlamAppearances.filter(item => typeof item === 'string') 

      : [];

    

    // Handle occasionPricing with proper typing

    let occasionPricing = null;

    if (insertCelebrityBrand.occasionPricing && typeof insertCelebrityBrand.occasionPricing === 'object') {

      occasionPricing = Object.fromEntries(

        Object.entries(insertCelebrityBrand.occasionPricing).map(([key, value]) => [

          key,

          {

            price: typeof value?.price === 'string' ? value.price : '',

            discount: typeof value?.discount === 'string' ? value.discount : undefined,

            availableColors: Array.isArray(value?.availableColors) ? value.availableColors.filter(item => typeof item === 'string') : undefined,

            customOptions: Array.isArray(value?.customOptions) ? value.customOptions.filter(item => typeof item === 'string') : undefined,

            limitedEdition: typeof value?.limitedEdition === 'boolean' ? value.limitedEdition : undefined

          }

        ])

      );

    }

    

    const celebrityBrand: CelebrityBrand = { 

      ...insertCelebrityBrand, 

      id,

      description: insertCelebrityBrand.description ?? null,

      itemType: insertCelebrityBrand.itemType ?? null,

      categoryId: insertCelebrityBrand.categoryId ?? null,

      equipmentSpecs: equipmentSpecs,

      occasionPricing: occasionPricing,

      relationshipStartYear: insertCelebrityBrand.relationshipStartYear ?? null,

      grandSlamAppearances: grandSlamAppearances

    };

    this.celebrityBrands.set(id, celebrityBrand);

    return celebrityBrand;

  }

  

  // Category operations

  async getCategories(): Promise<Category[]> {

    return Array.from(this.categories.values());

  }

  

  async getCategoryById(id: number): Promise<Category | undefined> {

    return this.categories.get(id);

  }

  

  async createCategory(insertCategory: InsertCategory): Promise<Category> {

    const id = this.categoryId++;

    const category: Category = { ...insertCategory, id };

    this.categories.set(id, category);

    return category;

  }

  

  async updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined> {

    const existing = this.categories.get(id);

    if (!existing) return undefined;

    const updated: Category = { ...existing, ...category, id: existing.id };

    this.categories.set(id, updated);

    return updated;

  }

  

  async deleteCategory(id: number): Promise<boolean> {

    return this.categories.delete(id);

  }

  

  // Plans CRUD

  async getPlans(): Promise<Plan[]> {

    return Array.from(this.plans.values());

  }

  

  async getPlanById(id: number): Promise<Plan | undefined> {

    return this.plans.get(id);

  }

  

  async createPlan(insertPlan: InsertPlan): Promise<Plan> {

    const plan: Plan = {

      id: this.planId++,

      name: insertPlan.name,

      imageUrl: insertPlan.imageUrl,

      price: insertPlan.price,

      discount: insertPlan.discount ?? null,

      isActive: insertPlan.isActive,

      features: insertPlan.features,

    } as unknown as Plan;

    this.plans.set(plan.id, plan);

    return plan;

  }

  

  async updatePlan(id: number, plan: Partial<InsertPlan>): Promise<Plan | undefined> {

    const existing = this.plans.get(id);

    if (!existing) return undefined;

    const updated: Plan = {

      ...existing,

      name: plan.name ?? existing.name,

      imageUrl: plan.imageUrl ?? existing.imageUrl,

      price: plan.price ?? existing.price,

      discount: plan.discount ?? existing.discount,

      isActive: plan.isActive ?? existing.isActive,

      features: plan.features ?? existing.features,

    } as unknown as Plan;

    this.plans.set(id, updated);

    return updated;

  }

  

  async deletePlan(id: number): Promise<boolean> {

    return this.plans.delete(id);

  }

  

  // Tournament operations

  async getTournaments(): Promise<Tournament[]> {

    return Array.from(this.tournaments.values());

  }

  

  async getTournamentById(id: number): Promise<Tournament | undefined> {

    return this.tournaments.get(id);

  }

  

  async createTournament(insertTournament: InsertTournament): Promise<Tournament> {

    const id = this.tournamentId++;

    const tournament: Tournament = { 

      ...insertTournament, 

      id,

      description: insertTournament.description ?? null

    };

    this.tournaments.set(id, tournament);

    return tournament;

  }

  

  // TournamentOutfit operations

  async getTournamentOutfits(): Promise<TournamentOutfit[]> {

    return Array.from(this.tournamentOutfits.values());

  }

  

  async getTournamentOutfitById(id: number): Promise<TournamentOutfit | undefined> {

    return this.tournamentOutfits.get(id);

  }

  

  async getTournamentOutfitsByCelebrity(celebrityId: number): Promise<TournamentOutfit[]> {

    return Array.from(this.tournamentOutfits.values()).filter(

      (outfit) => outfit.celebrityId === celebrityId

    );

  }

  

  async getTournamentOutfitsByTournament(tournamentId: number): Promise<TournamentOutfit[]> {

    return Array.from(this.tournamentOutfits.values()).filter(

      (outfit) => outfit.tournamentId === tournamentId

    );

  }

  

  async createTournamentOutfit(insertTournamentOutfit: InsertTournamentOutfit): Promise<TournamentOutfit> {

    const id = this.tournamentOutfitId++;

    

    // Process outfitDetails safely

    let outfitDetails: { 

      mainColor: string; 

      accentColor?: string; 

      specialFeatures?: string; 

      designInspiration?: string; 

    } | undefined = undefined;

    

    if (insertTournamentOutfit.outfitDetails) {

      outfitDetails = {

        mainColor: insertTournamentOutfit.outfitDetails.mainColor,

        accentColor: typeof insertTournamentOutfit.outfitDetails.accentColor === 'string' 

          ? insertTournamentOutfit.outfitDetails.accentColor 

          : undefined,

        specialFeatures: typeof insertTournamentOutfit.outfitDetails.specialFeatures === 'string' 

          ? insertTournamentOutfit.outfitDetails.specialFeatures 

          : undefined,

        designInspiration: typeof insertTournamentOutfit.outfitDetails.designInspiration === 'string' 

          ? insertTournamentOutfit.outfitDetails.designInspiration 

          : undefined

      };

    }

    

    // Ensure associatedBrands is an array of numbers

    const associatedBrands = Array.isArray(insertTournamentOutfit.associatedBrands)

      ? insertTournamentOutfit.associatedBrands.filter(id => typeof id === 'number')

      : [];

    

    const tournamentOutfit: TournamentOutfit = { 

      ...insertTournamentOutfit, 

      id,

      description: insertTournamentOutfit.description ?? null,

      result: insertTournamentOutfit.result ?? null,

      outfitDetails: outfitDetails || { mainColor: 'Not specified' },

      associatedBrands: associatedBrands

    };

    

    this.tournamentOutfits.set(id, tournamentOutfit);

    return tournamentOutfit;

  }



  // Users list

  async getUsers(): Promise<User[]> {

    return Array.from(this.users.values());

  }



  // Roles CRUD

  async getRoles(): Promise<Role[]> {

    return Array.from(this.roles.values());

  }

  async getRoleById(id: number): Promise<Role | undefined> {

    return this.roles.get(id);

  }

  async createRole(insertRole: InsertRole): Promise<Role> {

    const id = this.roleId++;

    const role: Role = { id, name: insertRole.name, description: (insertRole as any).description ?? null } as any;

    this.roles.set(id, role);

    return role;

  }

  async updateRole(id: number, insertRole: InsertRole): Promise<Role | undefined> {

    const existing = this.roles.get(id);

    if (!existing) return undefined;

    const updated: Role = { ...existing, name: insertRole.name ?? existing.name, description: (insertRole as any).description ?? existing.description } as any;

    this.roles.set(id, updated);

    return updated;

  }

  async deleteRole(id: number): Promise<boolean> {

    for (const [rpId, rp] of Array.from(this.rolePermissions.entries())) {

      if (rp.roleId === id) this.rolePermissions.delete(rpId);

    }

    for (const [urId, ur] of Array.from(this.userRoles.entries())) {

      if (ur.roleId === id) this.userRoles.delete(urId);

    }

    return this.roles.delete(id);

  }



  // Permissions CRUD

  async getPermissions(): Promise<Permission[]> {

    return Array.from(this.permissions.values());

  }

  async getPermissionById(id: number): Promise<Permission | undefined> {

    return this.permissions.get(id);

  }

  async createPermission(insertPermission: InsertPermission): Promise<Permission> {

    const id = this.permissionId++;

    const permission: Permission = { id, name: insertPermission.name, description: (insertPermission as any).description ?? null } as any;

    this.permissions.set(id, permission);

    return permission;

  }

  async updatePermission(id: number, insertPermission: InsertPermission): Promise<Permission | undefined> {

    const existing = this.permissions.get(id);

    if (!existing) return undefined;

    const updated: Permission = { ...existing, name: insertPermission.name ?? existing.name, description: (insertPermission as any).description ?? existing.description } as any;

    this.permissions.set(id, updated);

    return updated;

  }

  async deletePermission(id: number): Promise<boolean> {

    for (const [rpId, rp] of Array.from(this.rolePermissions.entries())) {

      if (rp.permissionId === id) this.rolePermissions.delete(rpId);

    }

    return this.permissions.delete(id);

  }



  // Role-Permissions mapping

  async getRolePermissions(roleId: number): Promise<RolePermission[]> {

    return Array.from(this.rolePermissions.values()).filter(rp => rp.roleId === roleId);

  }

  async addPermissionToRole(roleId: number, permissionId: number): Promise<RolePermission> {

    const existing = Array.from(this.rolePermissions.values()).find(rp => rp.roleId === roleId && rp.permissionId === permissionId);

    if (existing) return existing;

    const id = this.rolePermissionId++;

    const rp: RolePermission = { id, roleId, permissionId } as any;

    this.rolePermissions.set(id, rp);

    return rp;

  }

  async removePermissionFromRole(roleId: number, permissionId: number): Promise<boolean> {

    const found = Array.from(this.rolePermissions.entries()).find(([rid, rp]) => rp.roleId === roleId && rp.permissionId === permissionId);

    if (!found) return false;

    const [id] = found;

    return this.rolePermissions.delete(id);

  }



  // User-Roles mapping

  async getUserRoles(userId: number): Promise<UserRole[]> {

    return Array.from(this.userRoles.values()).filter(ur => ur.userId === userId);

  }

  async assignRoleToUser(userId: number, roleId: number): Promise<UserRole> {

    const existing = Array.from(this.userRoles.values()).find(ur => ur.userId === userId && ur.roleId === roleId);

    if (existing) return existing;

    const id = this.userRoleId++;

    const ur: UserRole = { id, userId, roleId } as any;

    this.userRoles.set(id, ur);

    return ur;

  }

  async removeRoleFromUser(userId: number, roleId: number): Promise<boolean> {

    const found = Array.from(this.userRoles.entries()).find(([rid, ur]) => ur.userId === userId && ur.roleId === roleId);

    if (!found) return false;

    const [id] = found;

    return this.userRoles.delete(id);

  }



  // Activity logging

  async logUserActivity(activity: UserActivity): Promise<UserActivity> {

    const list = this.userActivities.get(activity.userId) || [];

    const record: UserActivity = { ...activity, timestamp: activity.timestamp ?? Date.now() };

    list.push(record);

    this.userActivities.set(activity.userId, list);

    return record;

  }



  async getUserActivitiesByType(userId: number, activityType: string, limit: number = 50): Promise<UserActivity[]> {

    const list = this.userActivities.get(userId) || [];

    return list.filter(a => a.type === activityType).sort((a, b) => b.timestamp - a.timestamp).slice(0, limit);

  }



  async getUserActivities(userId: number, limit: number = 50): Promise<UserActivity[]> {

    const list = this.userActivities.get(userId) || [];

    return list.sort((a, b) => b.timestamp - a.timestamp).slice(0, limit);

  }



  async getRecentActivities(limit: number = 50): Promise<UserActivity[]> {

    const all: UserActivity[] = [];

    for (const arr of this.userActivities.values()) {

      all.push(...arr);

    }

    return all.sort((a, b) => b.timestamp - a.timestamp).slice(0, limit);

  }



  async deleteUserActivities(userId: number): Promise<boolean> {

    const existed = this.userActivities.has(userId);

    this.userActivities.delete(userId);

    return existed;

  }

}



export let storage: IStorage = new MemStorage();



export function setUseDbStorage(useDb: boolean) {
  if (useDb && db) {
    storage = new PgStorage(db);
    return;
  }
  storage = new MemStorage();
}



// Postgres-backed storage implementation for users, roles, permissions, mappings
export class PgStorage implements IStorage {
  private mem: MemStorage; // delegate non-user entities to existing in-memory impl
  private userActivities: Map<number, UserActivity[]> = new Map();
  constructor(private readonly _db: NodePgDatabase) {
    this.mem = new MemStorage();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const rows = await this._db.select().from(users).where(eq(users.id, id)).limit(1);
    return rows[0];
  }
  async getUserByUsername(username: string): Promise<User | undefined> {
    const rows = await this._db.select().from(users).where(eq(users.username, username)).limit(1);
    return rows[0];
  }
  async getUserByEmail(email: string): Promise<User | undefined> {
    const rows = await this._db.select().from(users).where(eq(users.email, email)).limit(1);
    return rows[0];
  }
  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    const rows = await this._db.select().from(users).where(eq(users.googleId, googleId)).limit(1);
    return rows[0];
  }
  async createUser(insertUser: InsertUser): Promise<User> {
    const toInsert: InsertUser = {
      username: insertUser.username,
      password: insertUser.password,
      email: insertUser.email,
      googleId: insertUser.googleId,
      displayName: insertUser.displayName,
      profilePicture: insertUser.profilePicture,
      firstName: insertUser.firstName,
      lastName: insertUser.lastName,
      phone: insertUser.phone,
      accountStatus: insertUser.accountStatus ?? "Active",
      source: insertUser.source ?? "local",
      resetToken: (insertUser as any).resetToken,
      resetTokenExpires: (insertUser as any).resetTokenExpires,
    } as any;
    const rows = await this._db.insert(users).values(toInsert).returning();
    return rows[0] as User;
  }
  async updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined> {
    const setObj: any = {};
    for (const [k, v] of Object.entries(user)) {
      if (v !== undefined) {
        // Handle empty strings for unique fields that should be null instead
        if ((k === 'googleId' || k === 'email') && v === '') {
          setObj[k] = null;
        } else {
          setObj[k] = v;
        }
      }
    }
    const rows = await this._db.update(users).set(setObj).where(eq(users.id, id)).returning();
    return rows[0];
  }
  async deleteUser(id: number): Promise<boolean> {
    const rows = await this._db.delete(users).where(eq(users.id, id)).returning({ id: users.id });
    return rows.length > 0;
  }
  async updateUserPasswordByEmail(email: string, password: string): Promise<boolean> {
    const rows = await this._db.update(users).set({ password }).where(eq(users.email, email)).returning({ id: users.id });
    return rows.length > 0;
  }
  async storePasswordResetToken(userId: number, token: string, expiresAt: number): Promise<boolean> {
    const rows = await this._db.update(users).set({ resetToken: token, resetTokenExpires: expiresAt }).where(eq(users.id, userId)).returning({ id: users.id });
    return rows.length > 0;
  }
  async verifyPasswordResetToken(userId: number, token: string): Promise<boolean> {
    const rows = await this._db.select({ resetToken: users.resetToken, resetTokenExpires: users.resetTokenExpires }).from(users).where(eq(users.id, userId)).limit(1);
    const r = rows[0] as any;
    if (!r) return false;
    const now = Date.now();
    const expiresNum = typeof r.resetTokenExpires === 'number' ? r.resetTokenExpires : undefined;
    return !!r.resetToken && r.resetToken === token && !!expiresNum && expiresNum > now;
  }
  async updateUserPassword(userId: number, password: string): Promise<boolean> {
    const rows = await this._db.update(users).set({ password }).where(eq(users.id, userId)).returning({ id: users.id });
    return rows.length > 0;
  }
  async clearPasswordResetToken(userId: number): Promise<boolean> {
    const rows = await this._db.update(users).set({ resetToken: null, resetTokenExpires: null }).where(eq(users.id, userId)).returning({ id: users.id });
    return rows.length > 0;
  }

  // Celebrity operations (database-backed)
  async getCelebrities(): Promise<Celebrity[]> {
    const rows = await this._db.select().from(celebrities);
    return rows.map(row => ({
      id: row.id,
      name: row.name,
      profession: row.profession,
      imageUrl: row.imageUrl,
      description: row.description,
      category: row.category,
      userId: row.userId,
      isActive: row.isActive,
      isElite: row.isElite,
      managerInfo: row.managerInfo as any,
      stylingDetails: row.stylingDetails as any,
      styleNotes: row.styleNotes
    }));
  }

  async getCelebrityById(id: number): Promise<Celebrity | undefined> {
    const rows = await this._db.select().from(celebrities).where(eq(celebrities.id, id));
    if (rows.length === 0) return undefined;
    const row = rows[0];
    return {
      id: row.id,
      name: row.name,
      profession: row.profession,
      imageUrl: row.imageUrl,
      description: row.description,
      category: row.category,
      userId: row.userId,
      isActive: row.isActive,
      isElite: row.isElite,
      managerInfo: row.managerInfo as any,
      stylingDetails: row.stylingDetails as any,
      styleNotes: row.styleNotes
    };
  }

  async getCelebrityByUserId(userId: number): Promise<Celebrity | undefined> {
    const rows = await this._db.select().from(celebrities).where(eq(celebrities.userId, userId));
    if (rows.length === 0) return undefined;
    const row = rows[0];
    return {
      id: row.id,
      name: row.name,
      profession: row.profession,
      imageUrl: row.imageUrl,
      description: row.description,
      category: row.category,
      userId: row.userId,
      isActive: row.isActive,
      isElite: row.isElite,
      managerInfo: row.managerInfo as any,
      stylingDetails: row.stylingDetails as any,
      styleNotes: row.styleNotes
    };
  }

  async getCelebritiesByCategory(category: string): Promise<Celebrity[]> {
    const rows = await this._db.select().from(celebrities).where(eq(celebrities.category, category));
    return rows.map(row => ({
      id: row.id,
      name: row.name,
      profession: row.profession,
      imageUrl: row.imageUrl,
      description: row.description,
      category: row.category,
      userId: row.userId,
      isActive: row.isActive,
      isElite: row.isElite,
      managerInfo: row.managerInfo as any,
      stylingDetails: row.stylingDetails as any,
      styleNotes: row.styleNotes
    }));
  }

  async createCelebrity(celebrity: InsertCelebrity): Promise<Celebrity> {
    const rows = await this._db.insert(celebrities).values({
      name: celebrity.name,
      profession: celebrity.profession,
      imageUrl: celebrity.imageUrl || '/placeholder-celebrity.jpg',
      description: celebrity.description,
      category: celebrity.category,
      userId: celebrity.userId,
      isActive: celebrity.isActive ?? true,
      isElite: celebrity.isElite ?? false,
      managerInfo: celebrity.managerInfo,
      stylingDetails: celebrity.stylingDetails,
      styleNotes: celebrity.styleNotes ?? null
    }).returning();
    
    const row = rows[0];
    return {
      id: row.id,
      name: row.name,
      profession: row.profession,
      imageUrl: row.imageUrl,
      description: row.description,
      category: row.category,
      userId: row.userId,
      isActive: row.isActive,
      isElite: row.isElite,
      managerInfo: row.managerInfo as any,
      stylingDetails: row.stylingDetails as any,
      styleNotes: row.styleNotes
    };
  }

  async createCelebrityWithId(celebrity: InsertCelebrity, id: number): Promise<Celebrity> {
    // Check if ID already exists
    const existing = await this.getCelebrityById(id);
    if (existing) {
      throw new Error(`Celebrity with ID ${id} already exists`);
    }
    
    const rows = await this._db.insert(celebrities).values({
      id,
      name: celebrity.name,
      profession: celebrity.profession,
      imageUrl: celebrity.imageUrl || '/placeholder-celebrity.jpg',
      description: celebrity.description,
      category: celebrity.category,
      userId: celebrity.userId,
      isActive: celebrity.isActive ?? true,
      isElite: celebrity.isElite ?? false,
      managerInfo: celebrity.managerInfo,
      stylingDetails: celebrity.stylingDetails,
      styleNotes: celebrity.styleNotes ?? null
    }).returning();
    
    const row = rows[0];
    return {
      id: row.id,
      name: row.name,
      profession: row.profession,
      imageUrl: row.imageUrl,
      description: row.description,
      category: row.category,
      userId: row.userId,
      isActive: row.isActive,
      isElite: row.isElite,
      managerInfo: row.managerInfo as any,
      stylingDetails: row.stylingDetails as any,
      styleNotes: row.styleNotes
    };
  }

  async updateCelebrity(id: number, celebrity: InsertCelebrity): Promise<Celebrity | undefined> {
    const rows = await this._db.update(celebrities)
      .set({
        name: celebrity.name,
        profession: celebrity.profession,
        imageUrl: celebrity.imageUrl,
        description: celebrity.description,
        category: celebrity.category,
        userId: celebrity.userId,
        isActive: celebrity.isActive,
        isElite: celebrity.isElite,
        managerInfo: celebrity.managerInfo,
        stylingDetails: celebrity.stylingDetails,
        styleNotes: celebrity.styleNotes ?? null
    })
      .where(eq(celebrities.id, id))
      .returning();
    
    if (rows.length === 0) return undefined;
    const row = rows[0];
    return {
      id: row.id,
      name: row.name,
      profession: row.profession,
      imageUrl: row.imageUrl,
      description: row.description,
      category: row.category,
      userId: row.userId,
      isActive: row.isActive,
      isElite: row.isElite,
      managerInfo: row.managerInfo as any,
      stylingDetails: row.stylingDetails as any,
      styleNotes: row.styleNotes
    };
  }

  async deleteCelebrity(id: number): Promise<boolean> {
    const rows = await this._db.delete(celebrities).where(eq(celebrities.id, id)).returning();
    return rows.length > 0;
  }

  // Brand operations (delegate)
  async getBrands(): Promise<Brand[]> { return this.mem.getBrands(); }
  async getBrandById(id: number): Promise<Brand | undefined> { return this.mem.getBrandById(id); }
  async createBrand(brand: InsertBrand): Promise<Brand> { return this.mem.createBrand(brand); }

  // CelebrityBrand operations (delegate)
  async getCelebrityBrands(celebrityId: number): Promise<CelebrityBrand[]> { return this.mem.getCelebrityBrands(celebrityId); }
  async createCelebrityBrand(celebrityBrand: InsertCelebrityBrand): Promise<CelebrityBrand> { return this.mem.createCelebrityBrand(celebrityBrand); }

  // Category operations (delegate)
  async getCategories(): Promise<Category[]> { return this.mem.getCategories(); }
  async getCategoryById(id: number): Promise<Category | undefined> { return this.mem.getCategoryById(id); }
  async createCategory(category: InsertCategory): Promise<Category> { return this.mem.createCategory(category); }
  async updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined> { return this.mem.updateCategory(id, category); }
  async deleteCategory(id: number): Promise<boolean> { return this.mem.deleteCategory(id); }

  // Plan operations (Postgres-backed)
  async getPlans(): Promise<Plan[]> {
    return await this._db.select().from(plans);
  }

  async getPlanById(id: number): Promise<Plan | undefined> {
    const rows = await this._db.select().from(plans).where(eq(plans.id, id)).limit(1);
    return rows[0] as Plan | undefined;
  }

  async createPlan(plan: InsertPlan): Promise<Plan> {
    const toInsert: InsertPlan = {
      name: plan.name,
      imageUrl: plan.imageUrl,
      price: plan.price,
      discount: plan.discount ?? null,
      isActive: plan.isActive,
      features: plan.features,
    } as any;
    const rows = await (this._db as any).insert(plans).values(toInsert).returning();
    return rows[0] as Plan;
  }

  async updatePlan(id: number, plan: Partial<InsertPlan>): Promise<Plan | undefined> {
    const setObj: any = {};
    if (plan.name !== undefined) setObj.name = plan.name;
    if (plan.imageUrl !== undefined) setObj.imageUrl = plan.imageUrl;
    if (plan.price !== undefined) setObj.price = plan.price;
    if (plan.discount !== undefined) setObj.discount = plan.discount;
    if (plan.isActive !== undefined) setObj.isActive = plan.isActive;
    if (plan.features !== undefined) setObj.features = plan.features;
    const rows = await (this._db as any).update(plans).set(setObj).where(eq(plans.id, id)).returning();
    return rows[0] as Plan | undefined;
  }

  async deletePlan(id: number): Promise<boolean> {
    const rows = await (this._db as any).delete(plans).where(eq(plans.id, id)).returning({ id: plans.id });
    return rows.length > 0;
  }

  // Tournament operations (delegate)
  async getTournaments(): Promise<Tournament[]> { return this.mem.getTournaments(); }
  async getTournamentById(id: number): Promise<Tournament | undefined> { return this.mem.getTournamentById(id); }
  async createTournament(tournament: InsertTournament): Promise<Tournament> { return this.mem.createTournament(tournament); }

  // TournamentOutfit operations (delegate)
  async getTournamentOutfits(): Promise<TournamentOutfit[]> { return this.mem.getTournamentOutfits(); }
  async getTournamentOutfitById(id: number): Promise<TournamentOutfit | undefined> { return this.mem.getTournamentOutfitById(id); }
  async getTournamentOutfitsByCelebrity(celebrityId: number): Promise<TournamentOutfit[]> { return this.mem.getTournamentOutfitsByCelebrity(celebrityId); }
  async getTournamentOutfitsByTournament(tournamentId: number): Promise<TournamentOutfit[]> { return this.mem.getTournamentOutfitsByTournament(tournamentId); }
  async createTournamentOutfit(tournamentOutfit: InsertTournamentOutfit): Promise<TournamentOutfit> { return this.mem.createTournamentOutfit(tournamentOutfit); }

  // Users list
  async getUsers(): Promise<User[]> {
    return await this._db.select().from(users);
  }

  // Roles CRUD
  async getRoles(): Promise<Role[]> { return await this._db.select().from(roles); }
  async getRoleById(id: number): Promise<Role | undefined> {
    const rows = await this._db.select().from(roles).where(eq(roles.id, id)).limit(1);
    return rows[0];
  }
  async createRole(insertRole: InsertRole): Promise<Role> {
    const rows = await this._db.insert(roles).values({ name: insertRole.name, description: (insertRole as any).description }).returning();
    return rows[0] as Role;
  }
  async updateRole(id: number, insertRole: InsertRole): Promise<Role | undefined> {
    const rows = await this._db.update(roles).set({ name: insertRole.name, description: (insertRole as any).description }).where(eq(roles.id, id)).returning();
    return rows[0] as Role | undefined;
  }
  async deleteRole(id: number): Promise<boolean> {
    const rows = await this._db.delete(roles).where(eq(roles.id, id)).returning({ id: roles.id });
    await this._db.delete(rolePermissions).where(eq(rolePermissions.roleId, id));
    await this._db.delete(userRoles).where(eq(userRoles.roleId, id));
    return rows.length > 0;
  }

  // Permissions CRUD
  async getPermissions(): Promise<Permission[]> { return await this._db.select().from(permissions); }
  async getPermissionById(id: number): Promise<Permission | undefined> {
    const rows = await this._db.select().from(permissions).where(eq(permissions.id, id)).limit(1);
    return rows[0];
  }
  async createPermission(insertPermission: InsertPermission): Promise<Permission> {
    const rows = await this._db.insert(permissions).values({ name: insertPermission.name, description: (insertPermission as any).description }).returning();
    return rows[0] as Permission;
  }
  async updatePermission(id: number, insertPermission: InsertPermission): Promise<Permission | undefined> {
    const rows = await this._db.update(permissions).set({ name: insertPermission.name, description: (insertPermission as any).description }).where(eq(permissions.id, id)).returning();
    return rows[0] as Permission | undefined;
  }
  async deletePermission(id: number): Promise<boolean> {
    const rows = await this._db.delete(permissions).where(eq(permissions.id, id)).returning({ id: permissions.id });
    await this._db.delete(rolePermissions).where(eq(rolePermissions.permissionId, id));
    return rows.length > 0;
  }

  // Role-Permissions mapping
  async getRolePermissions(roleId: number): Promise<RolePermission[]> {
    return await this._db.select().from(rolePermissions).where(eq(rolePermissions.roleId, roleId));
  }
  async addPermissionToRole(roleId: number, permissionId: number): Promise<RolePermission> {
    const existing = await this._db.select().from(rolePermissions).where(and(eq(rolePermissions.roleId, roleId), eq(rolePermissions.permissionId, permissionId))).limit(1);
    if (existing[0]) return existing[0] as RolePermission;
    const rows = await this._db.insert(rolePermissions).values({ roleId, permissionId }).returning();
    return rows[0] as RolePermission;
  }
  async removePermissionFromRole(roleId: number, permissionId: number): Promise<boolean> {
    const rows = await this._db.delete(rolePermissions).where(and(eq(rolePermissions.roleId, roleId), eq(rolePermissions.permissionId, permissionId))).returning({ id: rolePermissions.id });
    return rows.length > 0;
  }

  // User-Roles mapping
  async getUserRoles(userId: number): Promise<UserRole[]> {
    return await this._db.select().from(userRoles).where(eq(userRoles.userId, userId));
  }
  async assignRoleToUser(userId: number, roleId: number): Promise<UserRole> {
    const existing = await this._db.select().from(userRoles).where(and(eq(userRoles.userId, userId), eq(userRoles.roleId, roleId))).limit(1);
    if (existing[0]) return existing[0] as UserRole;
    const rows = await this._db.insert(userRoles).values({ userId, roleId }).returning();
    return rows[0] as UserRole;
  }
  async removeRoleFromUser(userId: number, roleId: number): Promise<boolean> {
    const rows = await this._db.delete(userRoles).where(and(eq(userRoles.userId, userId), eq(userRoles.roleId, roleId))).returning({ id: userRoles.id });
    return rows.length > 0;
  }

  // Activity logging (in-memory for now)
  async logUserActivity(activity: UserActivity): Promise<UserActivity> {
    const list = this.userActivities.get(activity.userId) || [];
    const record: UserActivity = { ...activity, timestamp: activity.timestamp ?? Date.now() };
    list.push(record);
    this.userActivities.set(activity.userId, list);
    return record;
  }
  async getUserActivitiesByType(userId: number, activityType: string, limit: number = 50): Promise<UserActivity[]> {
    const list = this.userActivities.get(userId) || [];
    return list.filter(a => a.type === activityType).sort((a, b) => b.timestamp - a.timestamp).slice(0, limit);
  }
  async getUserActivities(userId: number, limit: number = 50): Promise<UserActivity[]> {
    const list = this.userActivities.get(userId) || [];
    return list.sort((a, b) => b.timestamp - a.timestamp).slice(0, limit);
  }
  async getRecentActivities(limit: number = 50): Promise<UserActivity[]> {
    const all: UserActivity[] = [];
    for (const arr of this.userActivities.values()) all.push(...arr);
    return all.sort((a, b) => b.timestamp - a.timestamp).slice(0, limit);
  }
  async deleteUserActivities(userId: number): Promise<boolean> {
    const existed = this.userActivities.has(userId);
    this.userActivities.delete(userId);
    return existed;
  }

  // Blog CRUD operations
  async createBlog(blog: InsertBlog): Promise<Blog> {
    const now = new Date().toISOString();
    const blogData = {
      ...blog,
      createdAt: now,
      updatedAt: now,
    };
    
    if (this._db) {
      const rows = await this._db.insert(blogs).values(blogData).returning();
      return rows[0] as Blog;
    } else {
      // In-memory storage fallback
      const id = Math.max(0, ...Array.from(this.blogs.keys())) + 1;
      const newBlog: Blog = { id, ...blogData };
      this.blogs.set(id, newBlog);
      return newBlog;
    }
  }

  async getBlogById(id: number): Promise<Blog | null> {
    if (this._db) {
      const rows = await this._db.select().from(blogs).where(eq(blogs.id, id)).limit(1);
      if (rows.length === 0) return null;
      
      const blog = rows[0];
      // Populate author information
      const author = await this._db.select().from(users).where(eq(users.id, blog.authorId)).limit(1);
      
      return {
        ...blog,
        author: author[0] ? {
          id: author[0].id,
          displayName: author[0].displayName || author[0].username,
          email: author[0].email
        } : null
      };
    } else {
      const blog = this.blogs.get(id);
      if (!blog) return null;
      
      // Populate author information for in-memory storage
      const author = this.users.get(blog.authorId);
      return {
        ...blog,
        author: author ? {
          id: author.id,
          displayName: author.displayName || author.username,
          email: author.email
        } : null
      };
    }
  }

  async getAllBlogs(limit: number = 50, offset: number = 0): Promise<Blog[]> {
    if (this._db) {
      const blogResults = await this._db.select().from(blogs)
        .orderBy(desc(blogs.createdAt))
        .limit(limit)
        .offset(offset);
      
      // Populate author information for each blog
      const blogsWithAuthors = await Promise.all(
        blogResults.map(async (blog) => {
          const author = await this._db.select().from(users).where(eq(users.id, blog.authorId)).limit(1);
          return {
            ...blog,
            author: author[0] ? {
              id: author[0].id,
              displayName: author[0].displayName || author[0].username,
              email: author[0].email
            } : null
          };
        })
      );
      
      return blogsWithAuthors;
    } else {
      const allBlogs = Array.from(this.blogs.values());
      const sortedBlogs = allBlogs
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(offset, offset + limit);
      
      // Populate author information for in-memory storage
      return sortedBlogs.map(blog => {
        const author = this.users.get(blog.authorId);
        return {
          ...blog,
          author: author ? {
            id: author.id,
            displayName: author.displayName || author.username,
            email: author.email
          } : null
        };
      });
    }
  }

  async getPublishedBlogs(limit: number = 50, offset: number = 0): Promise<Blog[]> {
    if (this._db) {
      const blogResults = await this._db.select().from(blogs)
        .where(eq(blogs.isPublished, true))
        .orderBy(desc(blogs.publishedAt))
        .limit(limit)
        .offset(offset);
      
      // Populate author information for each blog
      const blogsWithAuthors = await Promise.all(
        blogResults.map(async (blog) => {
          const author = await this._db.select().from(users).where(eq(users.id, blog.authorId)).limit(1);
          return {
            ...blog,
            author: author[0] ? {
              id: author[0].id,
              displayName: author[0].displayName || author[0].username,
              email: author[0].email
            } : null
          };
        })
      );
      
      return blogsWithAuthors;
    } else {
      const allBlogs = Array.from(this.blogs.values());
      const filteredBlogs = allBlogs
        .filter(blog => blog.isPublished)
        .sort((a, b) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime())
        .slice(offset, offset + limit);
      
      // Populate author information for in-memory storage
      return filteredBlogs.map(blog => {
        const author = this.users.get(blog.authorId);
        return {
          ...blog,
          author: author ? {
            id: author.id,
            displayName: author.displayName || author.username,
            email: author.email
          } : null
        };
      });
    }
  }

  async getBlogsByAuthor(authorId: number, limit: number = 50, offset: number = 0): Promise<Blog[]> {
    if (this._db) {
      const blogResults = await this._db.select().from(blogs)
        .where(eq(blogs.authorId, authorId))
        .orderBy(desc(blogs.createdAt))
        .limit(limit)
        .offset(offset);
      
      // Populate author information for each blog
      const blogsWithAuthors = await Promise.all(
        blogResults.map(async (blog) => {
          const author = await this._db.select().from(users).where(eq(users.id, blog.authorId)).limit(1);
          return {
            ...blog,
            author: author[0] ? {
              id: author[0].id,
              displayName: author[0].displayName || author[0].username,
              email: author[0].email
            } : null
          };
        })
      );
      
      return blogsWithAuthors;
    } else {
      const allBlogs = Array.from(this.blogs.values());
      const filteredBlogs = allBlogs
        .filter(blog => blog.authorId === authorId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(offset, offset + limit);
      
      // Populate author information for in-memory storage
      return filteredBlogs.map(blog => {
        const author = this.users.get(blog.authorId);
        return {
          ...blog,
          author: author ? {
            id: author.id,
            displayName: author.displayName || author.username,
            email: author.email
          } : null
        };
      });
    }
  }

  async getBlogsByCategory(category: string, limit: number = 50, offset: number = 0): Promise<Blog[]> {
    if (this._db) {
      const blogResults = await this._db.select().from(blogs)
        .where(eq(blogs.category, category))
        .orderBy(desc(blogs.createdAt))
        .limit(limit)
        .offset(offset);
      
      // Populate author information for each blog
      const blogsWithAuthors = await Promise.all(
        blogResults.map(async (blog) => {
          const author = await this._db.select().from(users).where(eq(users.id, blog.authorId)).limit(1);
          return {
            ...blog,
            author: author[0] ? {
              id: author[0].id,
              displayName: author[0].displayName || author[0].username,
              email: author[0].email
            } : null
          };
        })
      );
      
      return blogsWithAuthors;
    } else {
      const allBlogs = Array.from(this.blogs.values());
      const filteredBlogs = allBlogs
        .filter(blog => blog.category === category)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(offset, offset + limit);
      
      // Populate author information for in-memory storage
      return filteredBlogs.map(blog => {
        const author = this.users.get(blog.authorId);
        return {
          ...blog,
          author: author ? {
            id: author.id,
            displayName: author.displayName || author.username,
            email: author.email
          } : null
        };
      });
    }
  }

  async updateBlog(id: number, updates: Partial<InsertBlog>): Promise<Blog | null> {
    const now = new Date().toISOString();
    const updateData = {
      ...updates,
      updatedAt: now,
    };

    if (this._db) {
      const rows = await this._db.update(blogs)
        .set(updateData)
        .where(eq(blogs.id, id))
        .returning();
      return rows[0] as Blog || null;
    } else {
      const existing = this.blogs.get(id);
      if (!existing) return null;
      const updated = { ...existing, ...updateData };
      this.blogs.set(id, updated);
      return updated;
    }
  }

  async deleteBlog(id: number): Promise<boolean> {
    if (this._db) {
      const rows = await this._db.delete(blogs).where(eq(blogs.id, id)).returning({ id: blogs.id });
      return rows.length > 0;
    } else {
      return this.blogs.delete(id);
    }
  }

  async incrementBlogViews(id: number): Promise<Blog | null> {
    if (this._db) {
      const rows = await this._db.update(blogs)
        .set({ viewCount: sql`${blogs.viewCount} + 1` })
        .where(eq(blogs.id, id))
        .returning();
      return rows[0] as Blog || null;
    } else {
      const existing = this.blogs.get(id);
      if (!existing) return null;
      const updated = { ...existing, viewCount: existing.viewCount + 1 };
      this.blogs.set(id, updated);
      return updated;
    }
  }

  async incrementBlogLikes(id: number): Promise<Blog | null> {
    if (this._db) {
      const rows = await this._db.update(blogs)
        .set({ likes: sql`${blogs.likes} + 1` })
        .where(eq(blogs.id, id))
        .returning();
      return rows[0] as Blog || null;
    } else {
      const existing = this.blogs.get(id);
      if (!existing) return null;
      const updated = { ...existing, likes: existing.likes + 1 };
      this.blogs.set(id, updated);
      return updated;
    }
  }

  // Celebrity Products CRUD operations
  async getCelebrityProducts(celebrityId?: number): Promise<CelebrityProduct[]> {
    if (this._db) {
      try {
        let result;
        if (celebrityId) {
          result = await this._db.select().from(celebrityProducts).where(eq(celebrityProducts.celebrityId, celebrityId));
        } else {
          result = await this._db.select().from(celebrityProducts);
        }
        
        // Process imageUrl conversion for each product
        const processedResult = result.map((product) => {
          let processedImageUrl = product.imageUrl;
          
          // Handle empty array string case first
          if (typeof product.imageUrl === 'string' && product.imageUrl === '[]') {
            processedImageUrl = '';
          }
          // If imageUrl is a JSON string, try to parse it
          else if (typeof product.imageUrl === 'string' && product.imageUrl.startsWith('[')) {
            try {
              const parsedUrls = JSON.parse(product.imageUrl);
              // For display purposes, use the first image URL or empty string if array is empty
              processedImageUrl = Array.isArray(parsedUrls) && parsedUrls.length > 0 ? parsedUrls[0] : '';
            } catch (e) {
              console.error("Failed to parse imageUrl JSON:", product.imageUrl);
              processedImageUrl = '';
            }
          }
          
          return {
            ...product,
            imageUrl: processedImageUrl
          };
        });
        
        return processedResult;
      } catch (error) {
        console.error("Database query failed:", error);
        throw error;
      }
    } else {
      console.log("Using in-memory storage for celebrity products");
      // In-memory fallback
      if (celebrityId) {
        const result = Array.from(this.celebrityProducts.values()).filter(product => product.celebrityId === celebrityId);
        console.log("In-memory filtered result:", result);
        return result;
      } else {
        const result = Array.from(this.celebrityProducts.values());
        console.log("In-memory all products result:", result);
        return result;
      }
    }
  }

  async getCelebrityProductById(id: number): Promise<CelebrityProduct | null> {
    if (this._db) {
      const rows = await this._db.select().from(celebrityProducts).where(eq(celebrityProducts.id, id));
      if (rows.length === 0) return null;
      
      const product = rows[0] as CelebrityProduct;
      let processedImageUrl = product.imageUrl;
      
      // If imageUrl is a JSON string, try to parse it
      if (typeof product.imageUrl === 'string' && product.imageUrl.startsWith('[')) {
        try {
          const parsedUrls = JSON.parse(product.imageUrl);
          // For display purposes, use the first image URL or empty string if array is empty
          processedImageUrl = Array.isArray(parsedUrls) && parsedUrls.length > 0 ? parsedUrls[0] : '';
        } catch (e) {
          console.error("Failed to parse imageUrl JSON:", product.imageUrl);
          processedImageUrl = '';
        }
      }
      
      return {
        ...product,
        imageUrl: processedImageUrl
      };
    } else {
      return this.celebrityProducts.get(id) || null;
    }
  }

  async createCelebrityProduct(productData: InsertCelebrityProduct): Promise<CelebrityProduct> {
    console.log("Creating celebrity product with data:", productData);
    if (this._db) {
      try {
        console.log("Using database to create product");
        
        // Handle imageUrl - convert array to JSON string for database storage
        const processedData = {
          ...productData,
          imageUrl: Array.isArray(productData.imageUrl) 
            ? JSON.stringify(productData.imageUrl) 
            : productData.imageUrl || ''
        };
        
        const rows = await this._db.insert(celebrityProducts).values(processedData).returning();
        console.log("Database insert successful, rows:", rows);
        
        // Convert back to array format for response if needed
        const result = rows[0] as CelebrityProduct;
        if (result.imageUrl && result.imageUrl.startsWith('[')) {
          try {
            result.imageUrl = JSON.parse(result.imageUrl);
          } catch (e) {
            // Keep as string if parsing fails
          }
        }
        
        return result;
      } catch (error) {
        console.error("Database insert failed:", error);
        throw error;
      }
    } else {
      console.log("Using in-memory storage to create product");
      const id = Math.max(0, ...Array.from(this.celebrityProducts.keys())) + 1;
      const newProduct: CelebrityProduct = {
        id,
        ...productData,
        imageUrl: Array.isArray(productData.imageUrl) 
          ? productData.imageUrl.join(',') 
          : productData.imageUrl || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.celebrityProducts.set(id, newProduct);
      console.log("In-memory product created:", newProduct);
      return newProduct;
    }
  }

  async updateCelebrityProduct(id: number, updateData: Partial<InsertCelebrityProduct>): Promise<CelebrityProduct | null> {
    console.log("Updating celebrity product with ID:", id, "and data:", updateData);
    
    if (this._db) {
      // Handle imageUrl - convert array to JSON string for database storage
      const processedData = {
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      
      if (updateData.imageUrl !== undefined) {
        if (Array.isArray(updateData.imageUrl)) {
          processedData.imageUrl = updateData.imageUrl.length > 0 
            ? JSON.stringify(updateData.imageUrl) 
            : '[]';
        } else {
          processedData.imageUrl = updateData.imageUrl || '[]';
        }
        console.log("Processed imageUrl for database:", processedData.imageUrl);
      }
      
      console.log("Final processed data for update:", processedData);
      
      const rows = await this._db.update(celebrityProducts)
        .set(processedData)
        .where(eq(celebrityProducts.id, id))
        .returning();
        
      console.log("Database update result:", rows);
        
      if (rows.length === 0) return null;
      
      // Convert back to array format for response if needed
      const result = rows[0] as CelebrityProduct;
      if (result.imageUrl && (result.imageUrl.startsWith('[') || result.imageUrl.startsWith('['))) {
        try {
          result.imageUrl = JSON.parse(result.imageUrl);
        } catch (e) {
          // Keep as string if parsing fails
          result.imageUrl = [];
        }
      } else if (!result.imageUrl || result.imageUrl === '') {
        result.imageUrl = [];
      }
      
      console.log("Final result returned:", result);
      return result;
    } else {
      const existing = this.celebrityProducts.get(id);
      if (!existing) return null;
      
      const processedUpdateData = { ...updateData };
      if (updateData.imageUrl !== undefined) {
        processedUpdateData.imageUrl = Array.isArray(updateData.imageUrl) 
          ? updateData.imageUrl.join(',') 
          : updateData.imageUrl || '';
      }
      
      const updated = { ...existing, ...processedUpdateData, updatedAt: new Date().toISOString() };
      this.celebrityProducts.set(id, updated);
      return updated;
    }
  }

  async deleteCelebrityProduct(id: number): Promise<boolean> {
    if (this._db) {
      const rows = await this._db.delete(celebrityProducts).where(eq(celebrityProducts.id, id)).returning({ id: celebrityProducts.id });
      return rows.length > 0;
    } else {
      return this.celebrityProducts.delete(id);
    }
  }
}



