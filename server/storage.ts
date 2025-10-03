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
  type InsertTournamentOutfit
} from "@shared/schema";
import { 
  mockCelebrities, 
  mockBrands, 
  mockCelebrityBrands, 
  mockCategories, 
  mockTournaments, 
  mockTournamentOutfits 
} from "@shared/data";

// Interface for all storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getUsers(): Promise<User[]>;
  updateUserRole(id: number, role: 'user' | 'admin'): Promise<User | undefined>;
  updateUserPermissions(id: number, permissions: string[]): Promise<User | undefined>;
  // Add profile update method
  updateUserProfile(id: number, data: { username?: string; imageUrl?: string }): Promise<User | undefined>;
  
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
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private celebrities: Map<number, Celebrity>;
  private brands: Map<number, Brand>;
  private celebrityBrands: Map<number, CelebrityBrand>;
  private categories: Map<number, Category>;
  private tournaments: Map<number, Tournament>;
  private tournamentOutfits: Map<number, TournamentOutfit>;
  
  private userId: number = 1;
  private celebrityId: number = 1;
  private brandId: number = 1;
  private celebrityBrandId: number = 1;
  private categoryId: number = 1;
  private tournamentId: number = 1;
  private tournamentOutfitId: number = 1;

  constructor() {
    this.users = new Map();
    this.celebrities = new Map();
    this.brands = new Map();
    this.celebrityBrands = new Map();
    this.categories = new Map();
    this.tournaments = new Map();
    this.tournamentOutfits = new Map();
    
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

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { 
      id, 
      username: insertUser.username, 
      password: insertUser.password, 
      role: 'user', 
      permissions: [],
      imageUrl: (insertUser as any).imageUrl ?? undefined
    };
    this.users.set(id, user);
    return user;
  }

  async getUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async updateUserRole(id: number, role: 'user' | 'admin'): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    const updated: User = { ...user, role };
    this.users.set(id, updated);
    return updated;
  }

  async updateUserPermissions(id: number, permissions: string[]): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    const updated: User = { ...user, permissions };
    this.users.set(id, updated);
    return updated;
  }
  
  // New: updateUserProfile (username, imageUrl)
  async updateUserProfile(id: number, data: { username?: string; imageUrl?: string }): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    const updated: User = { 
      ...user, 
      username: data.username ?? user.username, 
      imageUrl: data.imageUrl ?? (user as any).imageUrl 
    };
    this.users.set(id, updated);
    return updated;
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
}

export const storage = new MemStorage();
