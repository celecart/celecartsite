import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertCelebritySchema, 
  insertBrandSchema, 
  insertCelebrityBrandSchema, 
  insertCategorySchema,
  insertTournamentSchema,
  insertTournamentOutfitSchema
} from "@shared/schema";
import { z } from "zod";
import multer from "multer";
import { analyzeStyle, generateOutfitRecommendations, getChatbotResponse, analyzeImageForSimilarOutfits } from "./services/openai";
// Import Anthropic services for enhanced AI features
import { 
  analyzeImageForFashion, 
  generatePersonalizedOutfitSuggestions, 
  getCelebrityStyleAnalysis,
  getAIFashionChatResponse,
  findMatchingCelebrityStyles
} from "./services/anthropic";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // AUTH ROUTES
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body as Record<string, string>;
      if (!email || !password) return res.status(400).json({ message: "Email and password are required" });
      const normalizedEmail = email.trim().toLowerCase();
      const user = await storage.getUserByUsername(normalizedEmail);
      if (!user) return res.status(401).json({ message: "Invalid credentials" });
      const salt = process.env.PASSWORD_SALT || "cele-salt";
      const hash = crypto.createHash("sha256").update(salt + password).digest("hex");
      if (hash !== user.password) return res.status(401).json({ message: "Invalid credentials" });
      (req.session as any).userId = user.id;
      (req.session as any).username = user.username;
      (req.session as any).role = user.role;
      (req.session as any).permissions = user.permissions;
      return res.json({ id: user.id, username: user.username, role: user.role, permissions: user.permissions, imageUrl: (user as any).imageUrl });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Failed to login" });
    }
  });

  app.get("/api/auth/me", async (req: Request, res: Response) => {
    try {
      const userId = (req.session as any)?.userId;
      if (!userId) {
        return res.status(200).json({ user: null });
      }
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(200).json({ user: null });
      }
      return res.json({ user: { id: user.id, username: user.username, role: user.role, permissions: user.permissions, imageUrl: (user as any).imageUrl } });
    } catch (error) {
      console.error("Me error:", error);
      return res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.post("/api/auth/logout", async (req: Request, res: Response) => {
    try {
      req.session.destroy((err) => {
        if (err) {
          console.error("Logout error:", err);
          return res.status(500).json({ message: "Failed to logout" });
        }
        res.json({ success: true });
      });
    } catch (error) {
      console.error("Logout error:", error);
      return res.status(500).json({ message: "Failed to logout" });
    }
  });
  
  // API routes - prefix with /api
  
  // Get all celebrities
  app.get("/api/celebrities", async (req: Request, res: Response) => {
    try {
      const celebrities = await storage.getCelebrities();
      res.json(celebrities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch celebrities" });
    }
  });
  
  // Get celebrity by ID
  app.get("/api/celebrities/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid celebrity ID" });
      }
      
      const celebrity = await storage.getCelebrityById(id);
      if (!celebrity) {
        return res.status(404).json({ message: "Celebrity not found" });
      }
      
      res.json(celebrity);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch celebrity" });
    }
  });
  
  // Get celebrities by category
  app.get("/api/celebrities/category/:category", async (req: Request, res: Response) => {
    try {
      const { category } = req.params;
      const celebrities = await storage.getCelebritiesByCategory(category);
      res.json(celebrities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch celebrities by category" });
    }
  });
  
  // Create celebrity
  app.post("/api/celebrities", async (req: Request, res: Response) => {
    try {
      const validatedData = insertCelebritySchema.parse(req.body);
      const celebrity = await storage.createCelebrity(validatedData);
      res.status(201).json(celebrity);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid celebrity data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create celebrity" });
    }
  });
  
  // Get all brands
  app.get("/api/brands", async (req: Request, res: Response) => {
    try {
      const brands = await storage.getBrands();
      res.json(brands);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch brands" });
    }
  });
  
  // Get brand by ID
  app.get("/api/brands/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid brand ID" });
      }
      
      const brand = await storage.getBrandById(id);
      if (!brand) {
        return res.status(404).json({ message: "Brand not found" });
      }
      
      res.json(brand);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch brand" });
    }
  });
  
  // Create brand
  app.post("/api/brands", async (req: Request, res: Response) => {
    try {
      const validatedData = insertBrandSchema.parse(req.body);
      const brand = await storage.createBrand(validatedData);
      res.status(201).json(brand);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid brand data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create brand" });
    }
  });
  
  // Get celebrity brands by celebrity ID
  app.get("/api/celebritybrands/:celebrityId", async (req: Request, res: Response) => {
    try {
      const celebrityId = parseInt(req.params.celebrityId);
      if (isNaN(celebrityId)) {
        return res.status(400).json({ message: "Invalid celebrity ID" });
      }
      
      const celebrityBrands = await storage.getCelebrityBrands(celebrityId);
      
      // Enrich with brand data and ensure proper null values for optional fields
      const enrichedData = await Promise.all(
        celebrityBrands.map(async (cb) => {
          const brand = await storage.getBrandById(cb.brandId);
          
          // Ensure required fields have proper null values instead of undefined
          return {
            ...cb,
            brand,
            categoryId: cb.categoryId ?? null,
            itemType: cb.itemType ?? null,
            description: cb.description ?? null,
            equipmentSpecs: cb.equipmentSpecs ?? null,
            occasionPricing: cb.occasionPricing ?? null,
            relationshipStartYear: cb.relationshipStartYear ?? null,
            grandSlamAppearances: cb.grandSlamAppearances ?? []
          };
        })
      );
      
      res.json(enrichedData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch celebrity brands" });
    }
  });
  
  // Create celebrity brand relationship
  app.post("/api/celebritybrands", async (req: Request, res: Response) => {
    try {
      const validatedData = insertCelebrityBrandSchema.parse(req.body);
      const celebrityBrand = await storage.createCelebrityBrand(validatedData);
      res.status(201).json(celebrityBrand);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid celebrity brand data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create celebrity brand relationship" });
    }
  });
  
  // Get all categories
  app.get("/api/categories", async (req: Request, res: Response) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });
  
  // Get category by ID
  app.get("/api/categories/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
      
      const category = await storage.getCategoryById(id);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch category" });
    }
  });
  
  // Create category
  app.post("/api/categories", async (req: Request, res: Response) => {
    try {
      const validatedData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(validatedData);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid category data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create category" });
    }
  });
  
  // Get all tournaments
  app.get("/api/tournaments", async (req: Request, res: Response) => {
    try {
      const tournaments = await storage.getTournaments();
      res.json(tournaments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tournaments" });
    }
  });
  
  // Get tournament by ID
  app.get("/api/tournaments/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid tournament ID" });
      }
      
      const tournament = await storage.getTournamentById(id);
      if (!tournament) {
        return res.status(404).json({ message: "Tournament not found" });
      }
      
      res.json(tournament);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tournament" });
    }
  });
  
  // Create tournament
  app.post("/api/tournaments", async (req: Request, res: Response) => {
    try {
      const validatedData = insertTournamentSchema.parse(req.body);
      const tournament = await storage.createTournament(validatedData);
      res.status(201).json(tournament);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid tournament data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create tournament" });
    }
  });
  
  // Get all tournament outfits
  app.get("/api/tournamentoutfits", async (req: Request, res: Response) => {
    try {
      const outfits = await storage.getTournamentOutfits();
      res.json(outfits);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tournament outfits" });
    }
  });
  
  // Get tournament outfit by ID
  app.get("/api/tournamentoutfits/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid tournament outfit ID" });
      }
      
      const outfit = await storage.getTournamentOutfitById(id);
      if (!outfit) {
        return res.status(404).json({ message: "Tournament outfit not found" });
      }
      
      res.json(outfit);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tournament outfit" });
    }
  });
  
  // Get tournament outfits by celebrity ID
  app.get("/api/tournamentoutfits/celebrity/:celebrityId", async (req: Request, res: Response) => {
    try {
      const celebrityId = parseInt(req.params.celebrityId);
      if (isNaN(celebrityId)) {
        return res.status(400).json({ message: "Invalid celebrity ID" });
      }
      
      const outfits = await storage.getTournamentOutfitsByCelebrity(celebrityId);
      
      // Enrich with tournament data
      const enrichedData = await Promise.all(
        outfits.map(async (outfit) => {
          const tournament = await storage.getTournamentById(outfit.tournamentId);
          return {
            ...outfit,
            tournament
          };
        })
      );
      
      res.json(enrichedData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch celebrity tournament outfits" });
    }
  });
  
  // Get tournament outfits by tournament ID
  app.get("/api/tournamentoutfits/tournament/:tournamentId", async (req: Request, res: Response) => {
    try {
      const tournamentId = parseInt(req.params.tournamentId);
      if (isNaN(tournamentId)) {
        return res.status(400).json({ message: "Invalid tournament ID" });
      }
      
      const outfits = await storage.getTournamentOutfitsByTournament(tournamentId);
      
      // Enrich with celebrity data
      const enrichedData = await Promise.all(
        outfits.map(async (outfit) => {
          const celebrity = await storage.getCelebrityById(outfit.celebrityId);
          return {
            ...outfit,
            celebrity
          };
        })
      );
      
      res.json(enrichedData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tournament outfits" });
    }
  });
  
  // Create tournament outfit
  app.post("/api/tournamentoutfits", async (req: Request, res: Response) => {
    try {
      const validatedData = insertTournamentOutfitSchema.parse(req.body);
      const outfit = await storage.createTournamentOutfit(validatedData);
      res.status(201).json(outfit);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid tournament outfit data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create tournament outfit" });
    }
  });

  // Set up multer for file uploads
  const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
  });

  // AI FEATURE 1: Style Analysis (Enhanced with Claude)
  app.get("/api/ai/style-analysis/:celebrityId", async (req: Request, res: Response) => {
    try {
      const celebrityId = parseInt(req.params.celebrityId);
      if (isNaN(celebrityId)) {
        return res.status(400).json({ message: "Invalid celebrity ID" });
      }
      
      const celebrity = await storage.getCelebrityById(celebrityId);
      if (!celebrity) {
        return res.status(404).json({ message: "Celebrity not found" });
      }
      
      const celebrityBrands = await storage.getCelebrityBrands(celebrityId);
      const enrichedBrands = await Promise.all(
        celebrityBrands.map(async (cb) => {
          const brand = await storage.getBrandById(cb.brandId);
          return { 
            ...cb, 
            brand,
            categoryId: cb.categoryId ?? null,
            itemType: cb.itemType ?? null,
            description: cb.description ?? null,
            equipmentSpecs: cb.equipmentSpecs ?? null,
            occasionPricing: cb.occasionPricing ?? null,
            relationshipStartYear: cb.relationshipStartYear ?? null,
            grandSlamAppearances: cb.grandSlamAppearances ?? []
          };
        })
      );
      
      let analysis;
      
      // Try using Anthropic Claude for enhanced analysis
      try {
        analysis = await getCelebrityStyleAnalysis(celebrity);
      } catch (claudeError) {
        console.error("Claude Style Analysis Error:", claudeError);
        // Fallback to OpenAI
        analysis = await analyzeStyle(celebrity, enrichedBrands);
      }
      
      res.json({ analysis });
    } catch (error) {
      console.error("AI style analysis error:", error);
      res.status(500).json({ message: "Failed to analyze style" });
    }
  });

  // AI FEATURE 2: Outfit Recommendations (Enhanced with Claude)
  app.post("/api/ai/outfit-recommendations", async (req: Request, res: Response) => {
    try {
      const { 
        userPreferences, 
        celebrityName, 
        occasion,
        weather,
        bodyType,
        eventFormality,
        ageGroup,
        budget
      } = req.body;
      
      if (!userPreferences || !celebrityName || !occasion) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      let recommendations;
      
      // Try using Anthropic Claude for enhanced personalized recommendations
      try {
        recommendations = await generatePersonalizedOutfitSuggestions(
          celebrityName,
          userPreferences,
          occasion,
          weather,
          bodyType,
          eventFormality,
          ageGroup,
          budget
        );
      } catch (claudeError) {
        console.error("Claude Outfit Recommendations Error:", claudeError);
        // Fallback to OpenAI
        recommendations = await generateOutfitRecommendations(
          userPreferences,
          celebrityName,
          occasion
        );
      }
      
      res.json({ recommendations });
    } catch (error) {
      console.error("AI outfit recommendations error:", error);
      res.status(500).json({ message: "Failed to generate outfit recommendations" });
    }
  });

  // AI FEATURE 3: Chatbot (Enhanced with Claude)
  app.post("/api/ai/chatbot", async (req: Request, res: Response) => {
    try {
      const { question, conversationHistory = [] } = req.body;
      
      if (!question) {
        return res.status(400).json({ message: "Question is required" });
      }
      
      let response;
      
      // Try using Anthropic Claude for enhanced chatbot capabilities
      try {
        response = await getAIFashionChatResponse(question, conversationHistory);
      } catch (claudeError) {
        console.error("Claude Chatbot Error:", claudeError);
        // Fallback to OpenAI
        response = await getChatbotResponse(question, conversationHistory);
      }
      
      res.json({ response });
    } catch (error) {
      console.error("AI chatbot error:", error);
      res.status(500).json({ message: "Failed to get chatbot response" });
    }
  });

  // AI FEATURE 4: Image Analysis (Enhanced with Claude)
  app.post("/api/ai/image-analysis", async (req: Request, res: Response) => {
    try {
      const { imageDescription, occasionContext, weatherSeason } = req.body;
      
      if (!imageDescription) {
        return res.status(400).json({ message: "Image description is required" });
      }
      
      let similarOutfits;
      
      // Try using Anthropic Claude for enhanced image analysis
      try {
        similarOutfits = await findMatchingCelebrityStyles(
          imageDescription,
          occasionContext,
          weatherSeason
        );
      } catch (claudeError) {
        console.error("Claude Image Analysis Error:", claudeError);
        // Fallback to OpenAI
        similarOutfits = await analyzeImageForSimilarOutfits(imageDescription);
      }
      
      res.json({ similarOutfits });
    } catch (error) {
      console.error("AI image analysis error:", error);
      res.status(500).json({ message: "Failed to analyze image" });
    }
  });
  
  // NEW AI FEATURE 5: Fashion Recognition (Powered by Claude)
  app.post("/api/ai/fashion-recognition", upload.single('image'), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image uploaded" });
      }
      
      // Convert image to base64
      const imageBase64 = req.file.buffer.toString('base64');
      
      // Use Anthropic Claude for multimodal fashion recognition
      const recognitionResults = await analyzeImageForFashion(imageBase64);
      
      if (!recognitionResults) {
        return res.status(500).json({ message: "Failed to analyze image" });
      }
      
      res.json({ recognitionResults });
    } catch (error) {
      console.error("AI fashion recognition error:", error);
      res.status(500).json({ message: "Failed to analyze fashion items in image" });
    }
  });

  // Admin middleware
  const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req.session as any)?.userId;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });
      const user = await storage.getUser(userId);
      if (!user || user.role !== "admin") return res.status(403).json({ message: "Forbidden" });
      next();
    } catch (err) {
      console.error("Admin check error:", err);
      return res.status(500).json({ message: "Internal error" });
    }
  };

  // Admin routes
  app.get("/api/admin/users", requireAdmin, async (_req: Request, res: Response) => {
    try {
      const users = await storage.getUsers();
      const payload = users.map(u => ({ id: u.id, username: u.username, role: u.role, permissions: u.permissions, imageUrl: (u as any).imageUrl }));
      return res.json({ users: payload });
    } catch (error) {
      console.error("List users error:", error);
      return res.status(500).json({ message: "Failed to list users" });
    }
  });

  app.post("/api/admin/users/:id/role", requireAdmin, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { role } = req.body as { role?: string };
      if (!id || (role !== "admin" && role !== "user")) {
        return res.status(400).json({ message: "Invalid request" });
      }
      const updated = await storage.updateUserRole(id, role as 'admin' | 'user');
      if (!updated) return res.status(404).json({ message: "User not found" });
      return res.json({ id: updated.id, username: updated.username, role: updated.role, permissions: updated.permissions });
    } catch (error) {
      console.error("Update role error:", error);
      return res.status(500).json({ message: "Failed to update role" });
    }
  });

  app.post("/api/admin/users/:id/permissions", requireAdmin, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { permissions } = req.body as { permissions?: string[] };
      if (!id || !Array.isArray(permissions)) {
        return res.status(400).json({ message: "Invalid request" });
      }
      const sanitized = permissions.filter(p => typeof p === 'string');
      const updated = await storage.updateUserPermissions(id, sanitized);
      if (!updated) return res.status(404).json({ message: "User not found" });
      return res.json({ id: updated.id, username: updated.username, role: updated.role, permissions: updated.permissions });
    } catch (error) {
      console.error("Update permissions error:", error);
      return res.status(500).json({ message: "Failed to update permissions" });
    }
  });

  // Enhance signup response
  app.post("/api/auth/signup", async (req: Request, res: Response) => {
    try {
      const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } }).single("profileImage");
      upload(req, res, async (err: any) => {
        if (err) return res.status(400).json({ message: "File upload error" });
        const { firstName, lastName, email, password, confirmPassword } = req.body as Record<string, string>;
        if (!firstName || !lastName || !email || !password || !confirmPassword) {
          return res.status(400).json({ message: "All fields are required" });
        }
        if (password !== confirmPassword) {
          return res.status(400).json({ message: "Passwords do not match" });
        }
        const normalizedEmail = email.trim().toLowerCase();
        const existing = await storage.getUserByUsername(normalizedEmail);
        if (existing) return res.status(409).json({ message: "User already exists" });
        const salt = process.env.PASSWORD_SALT || "cele-salt";
        const hash = crypto.createHash("sha256").update(salt + password).digest("hex");

        let imageUrl: string | undefined = undefined;
        try {
          const file = (req as any).file as Express.Multer.File | undefined;
          if (file && file.buffer && file.originalname) {
            const profilesDir = path.join(process.cwd(), "public", "assets", "profiles");
            fs.mkdirSync(profilesDir, { recursive: true });
            const safeName = `${Date.now()}-${Math.random().toString(36).slice(2)}-${file.originalname.replace(/[^a-zA-Z0-9_.-]/g, "_")}`;
            const fullPath = path.join(profilesDir, safeName);
            fs.writeFileSync(fullPath, file.buffer);
            imageUrl = `/assets/profiles/${safeName}`;
          }
        } catch (e) {
          console.error("Failed to persist profile image:", e);
        }

        const newUser = await storage.createUser({ username: normalizedEmail, password: hash, imageUrl } as any);
        (req.session as any).userId = newUser.id;
        (req.session as any).username = newUser.username;
        (req.session as any).role = newUser.role;
        (req.session as any).permissions = newUser.permissions;
        return res.status(201).json({ id: newUser.id, username: newUser.username, role: newUser.role, permissions: newUser.permissions, imageUrl: (newUser as any).imageUrl });
      });
    } catch (error) {
      console.error("Signup error:", error);
      return res.status(500).json({ message: "Failed to sign up" });
    }
  });

  // Debug route: list users without passwords (development only)
  if (app.get("env") === "development") {
    app.get("/api/debug/users", async (_req: Request, res: Response) => {
      try {
        const users = await storage.getUsers();
        res.json(users.map(u => ({ id: u.id, username: u.username, role: u.role, permissions: u.permissions })));
      } catch (error) {
        console.error("Debug users error:", error);
        res.status(500).json({ message: "Failed to fetch users" });
      }
    });
  }

  app.post("/api/admin/users/:id/profile", requireAdmin, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (!id) return res.status(400).json({ message: "Invalid user id" });

      const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } }).single("profileImage");
      upload(req, res, async (err: any) => {
        if (err) return res.status(400).json({ message: "File upload error" });

        const { username } = req.body as Record<string, string>;
        let imageUrl: string | undefined = undefined;
        try {
          const file = (req as any).file as Express.Multer.File | undefined;
          if (file && file.buffer && file.originalname) {
            const profilesDir = path.join(process.cwd(), "public", "assets", "profiles");
            fs.mkdirSync(profilesDir, { recursive: true });
            const safeName = `${Date.now()}-${Math.random().toString(36).slice(2)}-${file.originalname.replace(/[^a-zA-Z0-9_.-]/g, "_")}`;
            const fullPath = path.join(profilesDir, safeName);
            fs.writeFileSync(fullPath, file.buffer);
            imageUrl = `/assets/profiles/${safeName}`;
          }
        } catch (e) {
          console.error("Failed to persist profile image:", e);
        }

        const updated = await storage.updateUserProfile(id, { username, imageUrl });
        if (!updated) return res.status(404).json({ message: "User not found" });

        return res.json({ id: updated.id, username: updated.username, role: updated.role, permissions: updated.permissions, imageUrl: (updated as any).imageUrl });
      });
    } catch (error) {
      console.error("Update profile error:", error);
      return res.status(500).json({ message: "Failed to update user profile" });
    }
  });

  app.post("/api/admin/users/:id/role", requireAdmin, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { role } = req.body as { role?: string };
      if (!id || (role !== "admin" && role !== "user")) {
        return res.status(400).json({ message: "Invalid request" });
      }
      const updated = await storage.updateUserRole(id, role as 'admin' | 'user');
      if (!updated) return res.status(404).json({ message: "User not found" });
      return res.json({ id: updated.id, username: updated.username, role: updated.role, permissions: updated.permissions });
    } catch (error) {
      console.error("Update role error:", error);
      return res.status(500).json({ message: "Failed to update role" });
    }
  });

  app.post("/api/admin/users/:id/permissions", requireAdmin, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { permissions } = req.body as { permissions?: string[] };
      if (!id || !Array.isArray(permissions)) {
        return res.status(400).json({ message: "Invalid request" });
      }
      const sanitized = permissions.filter(p => typeof p === 'string');
      const updated = await storage.updateUserPermissions(id, sanitized);
      if (!updated) return res.status(404).json({ message: "User not found" });
      return res.json({ id: updated.id, username: updated.username, role: updated.role, permissions: updated.permissions });
    } catch (error) {
      console.error("Update permissions error:", error);
      return res.status(500).json({ message: "Failed to update permissions" });
    }
  });

  // Enhance signup response
  app.post("/api/auth/signup", async (req: Request, res: Response) => {
    try {
      const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } }).single("profileImage");
      upload(req, res, async (err: any) => {
        if (err) return res.status(400).json({ message: "File upload error" });
        const { firstName, lastName, email, password, confirmPassword } = req.body as Record<string, string>;
        if (!firstName || !lastName || !email || !password || !confirmPassword) {
          return res.status(400).json({ message: "All fields are required" });
        }
        if (password !== confirmPassword) {
          return res.status(400).json({ message: "Passwords do not match" });
        }
        const normalizedEmail = email.trim().toLowerCase();
        const existing = await storage.getUserByUsername(normalizedEmail);
        if (existing) return res.status(409).json({ message: "User already exists" });
        const salt = process.env.PASSWORD_SALT || "cele-salt";
        const hash = crypto.createHash("sha256").update(salt + password).digest("hex");

        let imageUrl: string | undefined = undefined;
        try {
          const file = (req as any).file as Express.Multer.File | undefined;
          if (file && file.buffer && file.originalname) {
            const profilesDir = path.join(process.cwd(), "public", "assets", "profiles");
            fs.mkdirSync(profilesDir, { recursive: true });
            const safeName = `${Date.now()}-${Math.random().toString(36).slice(2)}-${file.originalname.replace(/[^a-zA-Z0-9_.-]/g, "_")}`;
            const fullPath = path.join(profilesDir, safeName);
            fs.writeFileSync(fullPath, file.buffer);
            imageUrl = `/assets/profiles/${safeName}`;
          }
        } catch (e) {
          console.error("Failed to persist profile image:", e);
        }

        const newUser = await storage.createUser({ username: normalizedEmail, password: hash, imageUrl } as any);
        (req.session as any).userId = newUser.id;
        (req.session as any).username = newUser.username;
        (req.session as any).role = newUser.role;
        (req.session as any).permissions = newUser.permissions;
        return res.status(201).json({ id: newUser.id, username: newUser.username, role: newUser.role, permissions: newUser.permissions, imageUrl: (newUser as any).imageUrl });
      });
    } catch (error) {
      console.error("Signup error:", error);
      return res.status(500).json({ message: "Failed to sign up" });
    }
  });

  // Debug route: list users without passwords (development only)
  if (app.get("env") === "development") {
    app.get("/api/debug/users", async (_req: Request, res: Response) => {
      try {
        const users = await storage.getUsers();
        res.json(users.map(u => ({ id: u.id, username: u.username, role: u.role, permissions: u.permissions })));
      } catch (error) {
        console.error("Debug users error:", error);
        res.status(500).json({ message: "Failed to fetch users" });
      }
    });
  }

  // Signed-in user profile update (self)
  app.post("/api/auth/profile", async (req: Request, res: Response) => {
    try {
      const userId = (req.session as any)?.userId;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });

      const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } }).single("profileImage");
      upload(req, res, async (err: any) => {
        if (err) return res.status(400).json({ message: "File upload error" });

        const { username } = req.body as Record<string, string>;
        let imageUrl: string | undefined = undefined;
        try {
          const file = (req as any).file as Express.Multer.File | undefined;
          if (file && file.buffer && file.originalname) {
            const profilesDir = path.join(process.cwd(), "public", "assets", "profiles");
            fs.mkdirSync(profilesDir, { recursive: true });
            const safeName = `${Date.now()}-${Math.random().toString(36).slice(2)}-${file.originalname.replace(/[^a-zA-Z0-9_.-]/g, "_")}`;
            const fullPath = path.join(profilesDir, safeName);
            fs.writeFileSync(fullPath, file.buffer);
            imageUrl = `/assets/profiles/${safeName}`;
          }
        } catch (e) {
          console.error("Failed to persist profile image:", e);
        }

        const updated = await storage.updateUserProfile(userId, { username, imageUrl });
        if (!updated) return res.status(404).json({ message: "User not found" });
        return res.json({ id: updated.id, username: updated.username, role: updated.role, permissions: updated.permissions, imageUrl: (updated as any).imageUrl });
      });
    } catch (error) {
      console.error("Self update profile error:", error);
      return res.status(500).json({ message: "Failed to update profile" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
