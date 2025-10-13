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
  userActivities,
  type UserActivity,
  type InsertUserActivity
} from "@shared/schema";
import { 
  mockCelebrities, 
  mockBrands, 
  mockCelebrityBrands, 
  mockCategories, 
  mockTournaments, 
  mockTournamentOutfits 
} from "@shared/data";
import { type Role, type InsertRole, type Permission, type InsertPermission, type RolePermission, type InsertRolePermission, type UserRole, type InsertUserRole } from "@shared/schema";

// Interface for all storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByGoogleId(googleId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPasswordByEmail(email: string, password: string): Promise<boolean>;
  
  // Celebrity operations
  getCelebrities(): Promise<Celebrity[]>;
  getCelebrityById(id: number): Promise<Celebrity | undefined>;
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
  
  // Password reset token operations
  storePasswordResetToken(userId: number, token: string, expiry: Date): Promise<void>;
  verifyPasswordResetToken(userId: number, token: string): Promise<boolean>;
  clearPasswordResetToken(userId: number): Promise<void>;
  updateUserPassword(userId: number, newPassword: string): Promise<boolean>;
  
  // User Activity operations
  logUserActivity(activity: InsertUserActivity): Promise<UserActivity>;
  getUserActivities(userId: number, limit?: number): Promise<UserActivity[]>;
  getUserActivitiesByType(userId: number, activityType: string, limit?: number): Promise<UserActivity[]>;
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
  // Password reset tokens storage
  private passwordResetTokens: Map<number, { token: string; expiry: Date }>;
  // User activities storage
  private userActivities: Map<number, UserActivity>;
  
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
  // Counter for user activities
  private userActivityId: number = 1;

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
    this.passwordResetTokens = new Map();
    this.userActivities = new Map();
    
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

  // Celebrity operations
  async getCelebrities(): Promise<Celebrity[]> {
    return Array.from(this.celebrities.values());
  }
  
  async getCelebrityById(id: number): Promise<Celebrity | undefined> {
    return this.celebrities.get(id);
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
    
    const celebrity: Celebrity = {
      id,
      name: insertCelebrity.name,
      profession: insertCelebrity.profession,
      imageUrl: insertCelebrity.imageUrl,
      description: insertCelebrity.description ?? null,
      category: insertCelebrity.category,
      isElite: insertCelebrity.isElite ?? false,
      managerInfo,
      stylingDetails
    };
    
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
    
    const celebrity: Celebrity = {
      id,
      name: insertCelebrity.name,
      profession: insertCelebrity.profession,
      imageUrl: insertCelebrity.imageUrl,
      description: insertCelebrity.description ?? null,
      category: insertCelebrity.category,
      isElite: insertCelebrity.isElite ?? false,
      managerInfo,
      stylingDetails
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
      stylingDetails
    };
    
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
      imageUrl: insertPlan.imageUrl,
      price: insertPlan.price,
      discount: insertPlan.discount ?? null,
    } as unknown as Plan;
    this.plans.set(plan.id, plan);
    return plan;
  }
  
  async updatePlan(id: number, plan: Partial<InsertPlan>): Promise<Plan | undefined> {
    const existing = this.plans.get(id);
    if (!existing) return undefined;
    const updated: Plan = {
      ...existing,
      imageUrl: plan.imageUrl ?? existing.imageUrl,
      price: plan.price ?? existing.price,
      discount: plan.discount ?? existing.discount,
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
    return Array.from(this.users.values()).sort((a, b) => b.id - a.id);
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

  // Password reset token operations
  async storePasswordResetToken(userId: number, token: string, expiry: Date): Promise<void> {
    this.passwordResetTokens.set(userId, { token, expiry });
  }

  async verifyPasswordResetToken(userId: number, token: string): Promise<boolean> {
    const stored = this.passwordResetTokens.get(userId);
    if (!stored) return false;
    
    // Check if token matches and hasn't expired
    if (stored.token !== token || stored.expiry < new Date()) {
      // Clean up expired token
      this.passwordResetTokens.delete(userId);
      return false;
    }
    
    return true;
  }

  async clearPasswordResetToken(userId: number): Promise<void> {
    this.passwordResetTokens.delete(userId);
  }

  async updateUserPassword(userId: number, newPassword: string): Promise<boolean> {
    const user = this.users.get(userId);
    if (!user) return false;
    
    // Update the user's password
    const updatedUser: User = { ...user, password: newPassword };
    this.users.set(userId, updatedUser);
    return true;
  }

  // User Activity operations
  async logUserActivity(activity: InsertUserActivity): Promise<UserActivity> {
    const newActivity: UserActivity = {
      id: this.userActivityId++,
      userId: activity.userId,
      activityType: activity.activityType,
      entityType: activity.entityType || null,
      entityId: activity.entityId || null,
      entityName: activity.entityName || null,
      metadata: activity.metadata || null,
      timestamp: new Date()
    };
    
    this.userActivities.set(newActivity.id, newActivity);
    return newActivity;
  }

  async getUserActivities(userId: number, limit: number = 50): Promise<UserActivity[]> {
    const activities = Array.from(this.userActivities.values())
      .filter(activity => activity.userId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
    
    return activities;
  }

  async getUserActivitiesByType(userId: number, activityType: string, limit: number = 50): Promise<UserActivity[]> {
    const activities = Array.from(this.userActivities.values())
      .filter(activity => activity.userId === userId && activity.activityType === activityType)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
    
    return activities;
  }

  async getRecentActivities(limit: number = 100): Promise<UserActivity[]> {
    const activities = Array.from(this.userActivities.values())
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
    
    return activities;
  }

  async deleteUserActivities(userId: number): Promise<boolean> {
    const activitiesToDelete = Array.from(this.userActivities.entries())
      .filter(([_, activity]) => activity.userId === userId);
    
    for (const [id, _] of activitiesToDelete) {
      this.userActivities.delete(id);
    }
    
    return true;
  }
}

export const storage = new MemStorage();
