import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import passport from "./auth";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import dotenv from 'dotenv';
import { verifyDbConnection, pool } from "./db";
import { storage, setUseDbStorage } from "./storage";

// Load environment variables
dotenv.config();
import { addRandolphBrandToDB } from "./addRandolphBrand";
import { addPakistaniCelebritiesToDB } from "./addPakistaniCelebrities";
import { addShoaibAkhtar } from "./addShoaibAkhtar";
import { addMorePakistaniCelebritiesToDB } from "./addMorePakistaniCelebrities";
import { addFrazayAkbarProfileToDB } from "./addFarazayProfile";
import { markEliteCelebrities } from "./markEliteCelebrities";
import { seedModulesAndPermissions } from "./seedModules";
import { addTestCelebrityUser } from "./addTestCelebrityUser";

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

// Session configuration
// Ensure cookies work on local builds running over HTTP.
// Set COOKIE_SECURE=true only when serving over HTTPS.
if (process.env.TRUST_PROXY === 'true') {
  app.set('trust proxy', 1);
}

app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.COOKIE_SECURE === 'true',
    sameSite: (process.env.COOKIE_SAMESITE as any) || 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Initialize Passport
app.use(passport.initialize());
  app.use(passport.session());

// Serve static assets from public directory
app.use('/assets', express.static('public/assets'));

// Serve uploaded files from uploads directory
  app.use('/uploads', express.static('uploads'));

  // Redirect root to login page
  app.get('/', (_req: Request, res: Response) => {
    res.redirect('/login');
  });

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

  (async () => {
  // Verify DB connection (if DATABASE_URL is set)
  const dbOk = await verifyDbConnection();
  if (dbOk) {
    setUseDbStorage(true);
    log('Using Postgres-backed storage');
    // Ensure required columns exist to avoid runtime SELECT errors
    try {
      await pool!.query('ALTER TABLE "celebrities" ADD COLUMN IF NOT EXISTS "style_notes" text');
      await pool!.query('ALTER TABLE "celebrities" ADD COLUMN IF NOT EXISTS "brands_worn" text');
      await pool!.query('ALTER TABLE "celebrities" ADD COLUMN IF NOT EXISTS "user_id" integer');
      // Ensure brands have is_active column
      await pool!.query('ALTER TABLE "brands" ADD COLUMN IF NOT EXISTS "is_active" boolean DEFAULT true');
      // Ensure new user social/professional columns exist
      await pool!.query('ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "profession" text');
      await pool!.query('ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "description" text');
      await pool!.query('ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "category" text');
      await pool!.query('ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "instagram" text');
      await pool!.query('ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "twitter" text');
      await pool!.query('ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "youtube" text');
      await pool!.query('ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "tiktok" text');
    } catch (e) {
      console.error('Failed to ensure style_notes column:', e);
    }
  } else {
    setUseDbStorage(false);
    log('Using in-memory storage');
  }
  // Only run seeders if RUN_SEEDERS environment variable is set to 'true'
  if (process.env.RUN_SEEDERS === 'true') {
    log('Running database seeders...');
    
    // Seed modules and permissions first
    await seedModulesAndPermissions();
    
    // Add Randolph brand for Tom Cruise's aviators
    await addRandolphBrandToDB();
    
    // Add Pakistani celebrities to database
    // await addPakistaniCelebritiesToDB();
    
    // Add Shoaib Akhtar cricket legend
    // await addShoaibAkhtar();
    
    // Add more Pakistani celebrities (Imran Khan, Shan, etc.)
    // await addMorePakistaniCelebritiesToDB();
    
    // Add Frazay Akbar fashion influencer and social media personality
    // await addFrazayAkbarProfileToDB();
    
    // Mark elite celebrities with premium status badges
    // await markEliteCelebrities();
    
    // Add test celebrity user for testing
    // await addTestCelebrityUser();
    
    log('Database seeders completed');
  }

  // Ensure admin user exists and set password
  try {
    const adminEmail = 'admin@cele.com';
    const desiredPassword = '123456789';
    const existingAdmin = await storage.getUserByEmail(adminEmail);
    if (existingAdmin) {
      await storage.updateUserPasswordByEmail(adminEmail, desiredPassword);
      log('Admin password updated');
    } else {
      await storage.createUser({
        username: 'admin',
        password: desiredPassword,
        email: adminEmail,
        displayName: 'Administrator',
        profilePicture: '',
        firstName: 'Admin',
        lastName: '',
        phone: '',
        accountStatus: 'Active',
      });
      log('Admin user created with password');
    }
  } catch (e) {
    log('Failed to ensure admin user/password');
    console.error(e);
  }
  
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Serve the app on a configurable port (default 5000)
  // This serves both the API and the client.
  const port = Number(process.env.PORT || 5000);
  server.listen(port, "localhost", () => {
    log(`serving on port ${port}`);
  });
})();

