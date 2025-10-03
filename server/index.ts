import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import crypto from "node:crypto";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { addRandolphBrandToDB } from "./addRandolphBrand";
import { addPakistaniCelebritiesToDB } from "./addPakistaniCelebrities";
import { addShoaibAkhtar } from "./addShoaibAkhtar";
import { addMorePakistaniCelebritiesToDB } from "./addMorePakistaniCelebrities";
import { addFrazayAkbarProfileToDB } from "./addFarazayProfile";
import { markEliteCelebrities } from "./markEliteCelebrities";
import { storage } from "./storage";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session middleware for authentication
app.use(
  session({
    secret: process.env.SESSION_SECRET || "cele-session-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // set true if behind https
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
  })
);

// Serve static assets from public directory
app.use('/assets', express.static('public/assets'));

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
  // Add Randolph brand for Tom Cruise's aviators
  await addRandolphBrandToDB();
  
  // Add Pakistani celebrities to database
  await addPakistaniCelebritiesToDB();
  
  // Add Shoaib Akhtar cricket legend
  await addShoaibAkhtar();
  
  // Add more Pakistani celebrities (Imran Khan, Shan, etc.)
  await addMorePakistaniCelebritiesToDB();
  
  // Add Frazay Akbar fashion influencer and social media personality
  await addFrazayAkbarProfileToDB();
  
  // Mark elite celebrities with premium status badges
  await markEliteCelebrities();

  // Seed a demo user for authentication testing
  const salt = process.env.PASSWORD_SALT || "cele-salt";
  const demoPasswordHash = crypto
    .createHash("sha256")
    .update(salt + "demo1234")
    .digest("hex");
  await storage.createUser({ username: "demo@cele.com", password: demoPasswordHash });

  // Seed an admin user for admin panel access
  const adminPasswordHash = crypto
    .createHash("sha256")
    .update(salt + "admin1234")
    .digest("hex");
  const adminUser = await storage.createUser({ username: "admin@cele.com", password: adminPasswordHash });
  await storage.updateUserRole(adminUser.id, 'admin');

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

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
