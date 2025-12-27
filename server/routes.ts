import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import passport from "./auth";
import { storage } from "./storage";
import { 
  insertCelebritySchema, 
  insertBrandSchema, 
  insertCelebrityBrandSchema, 
  insertCategorySchema,
  insertTournamentSchema,
  insertTournamentOutfitSchema,
  insertRoleSchema,
  insertPermissionSchema,
  insertUserSchema,
  insertPlanSchema,
  insertCelebrityProductSchema,
  insertBrandProductSchema,
  insertCelebrityVibesEventSchema,
  insertCelebrityEventProductSchema
} from "@shared/schema";
import { z } from "zod";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { analyzeStyle, generateOutfitRecommendations, getChatbotResponse, analyzeImageForSimilarOutfits } from "./services/openai";
// Import Anthropic services for enhanced AI features
import { 
  analyzeImageForFashion, 
  generatePersonalizedOutfitSuggestions, 
  getCelebrityStyleAnalysis,
  getAIFashionChatResponse,
  findMatchingCelebrityStyles
} from "./services/anthropic";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { emailService } from "./services/email";
import { db, pool } from "./db";
import { roles, permissions, rolePermissions, userRoles } from "@shared/schema";
import { eq, and } from "drizzle-orm";
import Stripe from "stripe";

export async function registerRoutes(app: Express): Promise<Server> {
  const stripeSecret = process.env.STRIPE_SECRET_KEY || "";
  const stripe = stripeSecret ? new Stripe(stripeSecret) : null;
  // DB health check endpoint
  app.get('/api/health/db', async (_req: Request, res: Response) => {
    if (!pool) {
      return res.json({ connected: false, message: 'DATABASE_URL not set' });
    }
    try {
      const result = await pool.query('SELECT version()');
      return res.json({ connected: true, version: result.rows?.[0]?.version ?? null });
    } catch (err) {
      return res.status(500).json({ connected: false, error: 'DB connection failed' });
    }
  });
  
  // Authentication routes
  
  // Google OAuth login
  app.get('/auth/google', (req, res, next) => {
    const isPopup = req.query.popup === 'true';
    const options: any = { scope: ['profile', 'email'] };
    if (isPopup) {
      options.state = 'popup';
    }
    return passport.authenticate('google', options)(req, res, next);
  });
  
  // Google OAuth callback
  app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    async (req: Request, res: Response) => {
      // Log user activity for Google login
      if (req.user) {
        try {
          const user = req.user as any;
          await storage.logUserActivity({
            userId: user.id,
            activityType: 'login',
            entityType: 'auth',
            entityId: null,
            entityName: 'Google OAuth Login',
            metadata: JSON.stringify({ 
              loginMethod: 'google',
              timestamp: new Date().toISOString(),
              userAgent: req.get('User-Agent') || null
            })
          });
        } catch (activityError) {
          console.error('Failed to log Google login activity:', activityError);
        }
      }

      const isPopup = (req.query.state === 'popup') || (req.query.popup === 'true');
      if (isPopup) {
        const origin = process.env.CLIENT_ORIGIN || 'http://localhost:5000';
        res.status(200).set({ 'Content-Type': 'text/html' }).send(`
<!doctype html>
<html>
  <body>
    <script>
      try {
        if (window.opener) {
          window.opener.postMessage({ type: 'google-auth-success' }, '${origin}');
        }
      } catch (e) {}
      window.close();
    </script>
    <p>Login successful. You can close this window.</p>
  </body>
</html>
        `);
      } else {
        // Successful authentication, redirect to dashboard or home
        res.redirect('/');
      }
    }
  );
  
  // Logout route
  app.post('/auth/logout', (req: Request, res: Response) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: 'Logout failed' });
      }
      res.json({ message: 'Logged out successfully' });
    });
  });

  // Email/password login
  app.post('/auth/login', (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('local', (err: any, user: any, info: any) => {
      if (err) { return next(err); }
      if (!user) { return res.status(401).json({ message: info?.message || 'Login failed' }); }
      req.logIn(user, async (err) => {
        if (err) { return next(err); }
        
        // Log user activity for login
        try {
          await storage.logUserActivity({
            userId: user.id,
            activityType: 'login',
            entityType: 'auth',
            entityId: null,
            entityName: 'Email/Password Login',
            metadata: JSON.stringify({ 
              loginMethod: 'local',
              timestamp: new Date().toISOString(),
              userAgent: req.get('User-Agent') || null
            })
          });
        } catch (activityError) {
          console.error('Failed to log login activity:', activityError);
        }
        
        const role = user?.email === 'admin@cele.com' ? 'admin' : 'user';
        return res.json({ user: { ...user, role } });
      });
    })(req, res, next);
  });
  
  // Get current user
  app.get('/auth/user', (req: Request, res: Response) => {
    if (req.isAuthenticated()) {
      const u = req.user as any;
      const role = u?.email === 'admin@cele.com' ? 'admin' : 'user';
      res.json({ user: { ...u, role } });
    } else {
      res.status(401).json({ message: 'Not authenticated' });
    }
  });

  // Dev-only endpoint: Update admin password (and create admin user if missing)
  app.post('/auth/admin-password', async (_req: Request, res: Response) => {
    try {
      const email = 'admin@cele.com';
      const newPassword = '123456789';
      const updated = await storage.updateUserPasswordByEmail(email, newPassword);
      if (!updated) {
        await storage.createUser({
          username: 'admin',
          password: newPassword,
          email,
          displayName: 'Administrator',
          profilePicture: '',
          firstName: 'Admin',
          lastName: '',
          phone: '',
          accountStatus: 'Active',
          source: 'local',
        });
        return res.status(201).json({ message: 'Admin user created and password set' });
      }
      return res.json({ message: 'Admin password updated' });
    } catch (error) {
      return res.status(500).json({ message: 'Failed to update admin password' });
    }
  });

  // Forgot password route
  app.post('/auth/forgot-password', async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      if (!email || !/\S+@\S+\.\S+/.test(email)) {
        return res.status(400).json({ message: 'Valid email is required' });
      }

      // Check if user exists
      const user = await storage.getUserByEmail(email);
      if (!user) {
        // Don't reveal if email exists or not for security
        return res.json({ message: 'If the email exists, a password reset link has been sent' });
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

      // Store reset token in database (you'll need to add this to your storage)
      await storage.storePasswordResetToken(user.id, resetToken, resetTokenExpiry);

      // Create JWT token for additional security
      const jwtToken = jwt.sign(
        { userId: user.id, resetToken },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '1h' }
      );

      // Create reset URL
      const resetUrl = `${process.env.RESET_PASSWORD_URL || 'http://localhost:5000/reset-password'}?token=${jwtToken}`;

      // Send email
      await emailService.sendPasswordResetEmail(email, resetToken, resetUrl);

      res.json({ message: 'If the email exists, a password reset link has been sent' });
    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({ message: 'Failed to process password reset request' });
    }
  });

  // Reset password route
  app.post('/auth/reset-password', async (req: Request, res: Response) => {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        return res.status(400).json({ message: 'Token and new password are required' });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters' });
      }

      // Verify JWT token
      let decoded: any;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
      } catch (error) {
        return res.status(400).json({ message: 'Invalid or expired token' });
      }

      const { userId, resetToken } = decoded;

      // Verify reset token in database
      const isValidToken = await storage.verifyPasswordResetToken(userId, resetToken);
      if (!isValidToken) {
        return res.status(400).json({ message: 'Invalid or expired token' });
      }

      // Update password
      const updated = await storage.updateUserPassword(userId, newPassword);
      if (!updated) {
        return res.status(500).json({ message: 'Failed to update password' });
      }

      // Clear reset token
      await storage.clearPasswordResetToken(userId);

      res.json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({ message: 'Failed to reset password' });
    }
  });

  // Test email endpoint (for development/testing purposes)
  app.post('/auth/test-email', async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      
      if (!email || !/\S+@\S+\.\S+/.test(email)) {
        return res.status(400).json({ message: 'Valid email is required' });
      }

      // Test email connection first
      const connectionTest = await emailService.testConnection();
      if (!connectionTest) {
        return res.status(500).json({ 
          message: 'Email service connection failed. Please check your email credentials in .env file.' 
        });
      }

      // Send a test email
      const testEmailSent = await emailService.sendEmail({
        to: email,
        subject: 'CeleCart Email Test',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #333;">Email Test Successful! 🎉</h2>
            <p>This is a test email from your CeleCart application.</p>
            <p>If you received this email, your email configuration is working correctly.</p>
            <p><strong>Test Details:</strong></p>
            <ul>
              <li>Sent at: ${new Date().toLocaleString()}</li>
              <li>To: ${email}</li>
              <li>Service: Nodemailer</li>
            </ul>
            <p>You can now use the forgot password feature with confidence!</p>
          </div>
        `,
        text: `Email Test Successful! This is a test email from your CeleCart application. If you received this email, your email configuration is working correctly. Sent at: ${new Date().toLocaleString()}`
      });

      if (testEmailSent) {
        res.json({ 
          message: 'Test email sent successfully! Check your inbox.',
          details: {
            recipient: email,
            timestamp: new Date().toISOString(),
            connectionStatus: 'OK'
          }
        });
      } else {
        res.status(500).json({ 
          message: 'Failed to send test email. Please check your email credentials.' 
        });
      }
    } catch (error) {
      console.error('Test email error:', error);
      res.status(500).json({ 
        message: 'Email test failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Signup route
  const signupUpload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }
  });

  app.post('/auth/signup', signupUpload.single('profilePicture'), async (req: Request, res: Response) => {
    try {
      const {
        firstName,
        lastName,
        email,
        phone,
        username,
        displayName,
        password,
        accountStatus
      } = req.body as Record<string, string>;

      // Basic validation
      const errors: Record<string, string> = {};
      if (!email || !/\S+@\S+\.\S+/.test(email)) {
        errors.email = 'Valid email is required';
      }
      if (!password || password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
      }

      const allowedStatuses = ['Active', 'Suspended', 'Pending Verification', 'Deleted'];
      const normalizedStatus = accountStatus && allowedStatuses.includes(accountStatus) ? accountStatus : 'Active';

      let finalUsername = username?.trim();
      if (!finalUsername) {
        finalUsername = displayName?.trim() || email.split('@')[0];
      }
      if (!finalUsername) {
        errors.username = 'Username or display name is required';
      }

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ message: 'Invalid signup data', errors });
      }

      // Check duplicates
      const existingByEmail = email ? await storage.getUserByEmail(email) : undefined;
      if (existingByEmail) {
        return res.status(409).json({ message: 'Email already in use' });
      }
      const existingByUsername = await storage.getUserByUsername(finalUsername!);
      if (existingByUsername) {
        return res.status(409).json({ message: 'Username already taken' });
      }

      // Handle profile picture (optional)
      let profilePicture: string | undefined;
      if (req.file && req.file.buffer) {
        const mime = req.file.mimetype || 'image/png';
        const base64 = req.file.buffer.toString('base64');
        profilePicture = `data:${mime};base64,${base64}`;
      }

      // Capture user's IP address
      const ipAddress = req.ip || req.connection.remoteAddress || req.socket.remoteAddress || 
                       (req.connection as any)?.socket?.remoteAddress || 'unknown';

      const newUser = await storage.createUser({
        username: finalUsername!,
        password, // NOTE: For production, hash the password before storing
        email,
        displayName: displayName || finalUsername!,
        profilePicture,
        firstName,
        lastName,
        phone,
        accountStatus: normalizedStatus,
        source: 'local',
        ipAddress: ipAddress,
        registrationDate: new Date(),
      });

      // Log user activity for signup
      try {
        await storage.logUserActivity({
          userId: newUser.id,
          activityType: 'signup',
          entityType: 'auth',
          entityId: null,
          entityName: 'User Registration',
          metadata: JSON.stringify({ 
            registrationMethod: 'local',
            timestamp: new Date().toISOString(),
            userAgent: req.get('User-Agent') || null,
            hasProfilePicture: !!profilePicture
          })
        });
      } catch (activityError) {
        console.error('Failed to log signup activity:', activityError);
      }

      // Automatically authenticate the user after successful signup
      try {
        await new Promise<void>((resolve, reject) => {
          (req as any).login(newUser, (err: any) => {
            if (err) return reject(err);
            resolve();
          });
        });
      } catch (loginError) {
        console.error('Auto-login after signup failed:', loginError);
      }

      // Return sanitized user
      const { id } = newUser;
      return res.status(201).json({
        user: {
          id,
          username: newUser.username,
          email: newUser.email,
          displayName: newUser.displayName,
          profilePicture: newUser.profilePicture,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          phone: newUser.phone,
          accountStatus: newUser.accountStatus,
        }
      });
    } catch (error) {
      console.error('Signup error:', error);
      return res.status(500).json({ message: 'Failed to sign up' });
    }
  });
  
  // API routes - prefix with /api

  // Helper: ensure admin for protected operations
  const isAdminUser = (req: Request) => {
    const u = req.user as any;
    return !!u && (u.email === 'admin@cele.com');
  };
  const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated?.()) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    if (!isAdminUser(req)) {
      return res.status(403).json({ message: 'Admin access required' });
    }
    return next();
  };

  // Admin-only: DB table existence health endpoint
  app.get('/api/db/health', requireAdmin, async (_req: Request, res: Response) => {
    try {
      const storageType = (storage as any)?.constructor?.name || 'unknown';
      if (!pool) {
        return res.status(200).json({
          connected: false,
          message: 'DATABASE_URL not set or pool uninitialized',
          storageType,
          version: null,
          tables: {
            users: false,
            user_roles: false,
            brands: false,
            celebrity_brands: false,
          },
          allTables: [],
          otherTables: [],
        });
      }

      // Verify connectivity and version
      let version: string | null = null;
      try {
        await pool.query('SELECT 1');
        const v = await pool.query('SELECT version()');
        version = v.rows?.[0]?.version ?? null;
      } catch (e) {
        return res.status(200).json({
          connected: false,
          message: 'DB connection failed',
          storageType,
          version: null,
          tables: {
            users: false,
            user_roles: false,
            brands: false,
            celebrity_brands: false,
          },
          error: (e as any)?.message ?? 'unknown error',
          allTables: [],
          otherTables: [],
        });
      }

      // Check required tables by name
      const required = ['users', 'user_roles', 'brands', 'celebrity_brands'];
      // Fetch all public tables
      let allTables: string[] = [];
      try {
        const { rows } = await pool.query(`SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public' ORDER BY tablename`);
        allTables = rows.map((r: any) => r.tablename).filter(Boolean);
      } catch (listErr) {
        console.warn('[Route:/api/db/health] Failed to list tables', listErr);
      }
      const tables: Record<string, boolean> = {};
      for (const tbl of required) {
        try {
          const { rows } = await pool.query(`SELECT to_regclass('public.${tbl}') AS regclass`);
          const exists = rows?.[0]?.regclass != null;
          tables[tbl] = !!exists;
        } catch {
          tables[tbl] = false;
        }
      }

      const otherTables = allTables.filter(t => !required.includes(t));
      return res.json({ connected: true, version, storageType, tables, allTables, otherTables });
    } catch (err) {
      console.error('[Route:/api/db/health] Failed', err);
      return res.status(500).json({ message: 'Failed to compute DB health' });
    }
  });

  // Users list (for assignments)
  app.get('/api/users', async (_req: Request, res: Response) => {
    try {
      const users = await storage.getUsers();
      const usersWithRoles = await Promise.all(users.map(async (u) => {
        // Get user roles
        const userRoles = await storage.getUserRoles(u.id);
        const roles = await Promise.all(userRoles.map(async (ur) => {
          const role = await storage.getRoleById(ur.roleId);
          return role ? { id: role.id, name: role.name, description: role.description } : null;
        }));
        
        return {
          id: u.id,
          username: (u as any).username,
          email: (u as any).email,
          displayName: (u as any).displayName,
          profilePicture: (u as any).profilePicture,
          firstName: (u as any).firstName,
          lastName: (u as any).lastName,
          phone: (u as any).phone,
          accountStatus: (u as any).accountStatus,
          source: (u as any).source,
          ipAddress: (u as any).ipAddress,
          registrationDate: (u as any).registrationDate,
          googleId: (u as any).googleId,
          roles: roles.filter(role => role !== null)
        };
      }));
      res.json(usersWithRoles);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch users' });
    }
  });

  // Get single user by id
  app.get('/api/users/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: 'Invalid user ID' });
    const u = await storage.getUser(id);
    if (!u) return res.status(404).json({ message: 'User not found' });
    const safe = {
      id: u.id,
      username: (u as any).username,
      email: (u as any).email,
      displayName: (u as any).displayName,
      profilePicture: (u as any).profilePicture,
      firstName: (u as any).firstName,
      lastName: (u as any).lastName,
      phone: (u as any).phone,
      accountStatus: (u as any).accountStatus,
      source: (u as any).source,
      ipAddress: (u as any).ipAddress,
      registrationDate: (u as any).registrationDate,
      googleId: (u as any).googleId,
      profession: (u as any).profession,
      description: (u as any).description,
      category: (u as any).category,
      instagram: (u as any).instagram,
      twitter: (u as any).twitter,
      youtube: (u as any).youtube,
      tiktok: (u as any).tiktok,
    };
    res.json(safe);
  });

  // Create user (admin only)
  const adminUserUpload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }
  });

  app.post('/api/users', requireAdmin, adminUserUpload.single('profilePicture'), async (req: Request, res: Response) => {
    try {
      const parsed = insertUserSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: 'Invalid user data', errors: parsed.error.flatten() });
      }
      const allowedStatuses = ['Active', 'Suspended', 'Pending Verification', 'Deleted'];
      const normalizedStatus = parsed.data.accountStatus && allowedStatuses.includes(parsed.data.accountStatus) ? parsed.data.accountStatus : 'Active';
      
      // Handle profile picture (optional)
      let profilePicture: string | undefined = parsed.data.profilePicture;
      if (req.file && req.file.buffer) {
        const mime = req.file.mimetype || 'image/png';
        const base64 = req.file.buffer.toString('base64');
        profilePicture = `data:${mime};base64,${base64}`;
      }
      
      // Capture IP address and registration date
      const ipAddress = req.ip || req.connection.remoteAddress || req.socket.remoteAddress || 'unknown';
      const registrationDate = new Date();
      
      const created = await storage.createUser({ 
        ...parsed.data, 
        profilePicture,
        accountStatus: normalizedStatus, 
        source: parsed.data.source ?? 'local',
        ipAddress,
        registrationDate
      });
      const safe = {
        id: created.id,
        username: (created as any).username,
        email: (created as any).email,
        displayName: (created as any).displayName,
        profilePicture: (created as any).profilePicture,
        firstName: (created as any).firstName,
        lastName: (created as any).lastName,
        phone: (created as any).phone,
        accountStatus: (created as any).accountStatus,
        source: (created as any).source,
      };
      res.status(201).json(safe);
    } catch (error) {
      res.status(500).json({ message: 'Failed to create user' });
    }
  });

  // Update user (admin only)
  app.put('/api/users/:id', requireAdmin, async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: 'Invalid user ID' });
    const parsed = insertUserSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: 'Invalid user data', errors: parsed.error.flatten() });
    }
    const allowedStatuses = ['Active', 'Suspended', 'Pending Verification', 'Deleted'];
    const normalizedStatus = parsed.data.accountStatus && allowedStatuses.includes(parsed.data.accountStatus) ? parsed.data.accountStatus : undefined;
    const updated = await storage.updateUser(id, { ...parsed.data, accountStatus: normalizedStatus ?? parsed.data.accountStatus });
    if (!updated) return res.status(404).json({ message: 'User not found' });
    const safe = {
      id: updated.id,
      username: (updated as any).username,
      email: (updated as any).email,
      displayName: (updated as any).displayName,
      profilePicture: (updated as any).profilePicture,
      firstName: (updated as any).firstName,
      lastName: (updated as any).lastName,
      phone: (updated as any).phone,
      accountStatus: (updated as any).accountStatus,
      source: (updated as any).source,
    };
    res.json(safe);
  });

  // Delete user (admin only)
  app.delete('/api/users/:id', requireAdmin, async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: 'Invalid user ID' });
    const ok = await storage.deleteUser(id);
    if (!ok) return res.status(404).json({ message: 'User not found' });
    res.json({ success: true });
  });

  // Update user profile (authenticated user only)
  app.put('/api/profile', async (req: Request, res: Response) => {
    if (!req.isAuthenticated?.()) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    try {
      const user = req.user as any;
      const userId = user.id;

      // Validate the profile data
      const profileData = req.body;
      
      // Update user profile with celebrity-like fields
      const updated = await storage.updateUser(userId, {
        displayName: profileData.displayName,
        email: profileData.email,
        username: profileData.username,
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        phone: profileData.phone,
        profession: profileData.profession,
        description: profileData.description,
        category: profileData.category,
        instagram: profileData.instagram,
        twitter: profileData.twitter,
        youtube: profileData.youtube,
        tiktok: profileData.tiktok
      });

      if (!updated) {
        return res.status(404).json({ message: 'User not found' });
      }

      // If user has a celebrity profile, sync relevant fields to the celebrity record
      try {
        const celebrity = await storage.getCelebrityByUserId(userId);
        if (celebrity) {
          const merged = {
            ...celebrity,
            // Keep existing values unless new ones are explicitly provided
            description: typeof profileData.description !== 'undefined'
              ? (profileData.description ?? celebrity.description ?? null)
              : celebrity.description ?? null,
            profession: typeof profileData.profession !== 'undefined'
              ? (profileData.profession ?? celebrity.profession)
              : celebrity.profession,
            category: typeof profileData.category !== 'undefined'
              ? (profileData.category ?? celebrity.category)
              : celebrity.category,
            styleNotes: typeof profileData.styleNotes !== 'undefined'
              ? (profileData.styleNotes ?? celebrity.styleNotes ?? null)
              : celebrity.styleNotes ?? null,
            brandsWorn: typeof profileData.brandsWorn !== 'undefined'
              ? (profileData.brandsWorn ?? (celebrity as any).brandsWorn ?? null)
              : (celebrity as any).brandsWorn ?? null,
          };
          const validatedCelebrity = insertCelebritySchema.parse(merged);
          await storage.updateCelebrity(celebrity.id, validatedCelebrity);
        }
      } catch (celebSyncError) {
        console.error('Failed to sync fields to celebrity profile:', celebSyncError);
        // Do not fail the entire request if celebrity sync fails
      }

      // Log user activity for profile update
      try {
        await storage.logUserActivity({
          userId: userId,
          activityType: 'update',
          entityType: 'profile',
          entityId: userId,
          entityName: 'Profile Update',
          metadata: JSON.stringify({ 
            updatedFields: Object.keys(profileData),
            timestamp: new Date().toISOString(),
            userAgent: req.get('User-Agent') || null
          })
        });
      } catch (activityError) {
        console.error('Failed to log profile update activity:', activityError);
      }

      // Return sanitized user data
      const safe = {
        id: updated.id,
        username: (updated as any).username,
        email: (updated as any).email,
        displayName: (updated as any).displayName,
        profilePicture: (updated as any).profilePicture,
        firstName: (updated as any).firstName,
        lastName: (updated as any).lastName,
        phone: (updated as any).phone,
        accountStatus: (updated as any).accountStatus,
        source: (updated as any).source,
        profession: (updated as any).profession,
        description: (updated as any).description,
        category: (updated as any).category,
        instagram: (updated as any).instagram,
        twitter: (updated as any).twitter,
        youtube: (updated as any).youtube,
        tiktok: (updated as any).tiktok,
        role: user?.email === 'admin@cele.com' ? 'admin' : (updated as any).role || 'user'
      };

      res.json(safe);
    } catch (error) {
      console.error('Profile update error:', error);
      res.status(500).json({ message: 'Failed to update profile' });
    }
  });

  // Roles CRUD
  app.get('/api/roles', async (_req: Request, res: Response) => {
    try {
      const list = db ? await db.select().from(roles) : await storage.getRoles();
      res.json(list);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch roles' });
    }
  });

  app.get('/api/roles/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: 'Invalid role ID' });
    let record: any;
    if (db) {
      const rows = await db.select().from(roles).where(eq(roles.id, id)).limit(1);
      record = rows[0];
    } else {
      record = await storage.getRoleById(id);
    }
    if (!record) return res.status(404).json({ message: 'Role not found' });
    res.json(record);
  });

  app.post('/api/roles', requireAdmin, async (req: Request, res: Response) => {
    try {
      const parsed = insertRoleSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: 'Invalid role data', errors: parsed.error.flatten() });
      }
      if (db) {
        const [created] = await (db as any).insert(roles).values({
          name: parsed.data.name,
          description: (parsed.data as any).description ?? null,
        }).returning();
        return res.status(201).json(created);
      } else {
        const role = await storage.createRole(parsed.data);
        return res.status(201).json(role);
      }
    } catch (error) {
      res.status(500).json({ message: 'Failed to create role' });
    }
  });

  app.put('/api/roles/:id', requireAdmin, async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: 'Invalid role ID' });
    const parsed = insertRoleSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: 'Invalid role data', errors: parsed.error.flatten() });
    }
    if (db) {
      const rows = await (db as any).update(roles).set({
        name: parsed.data.name,
        description: (parsed.data as any).description ?? null,
      }).where(eq(roles.id, id)).returning();
      const updated = rows[0];
      if (!updated) return res.status(404).json({ message: 'Role not found' });
      return res.json(updated);
    } else {
      const updated = await storage.updateRole(id, parsed.data);
      if (!updated) return res.status(404).json({ message: 'Role not found' });
      return res.json(updated);
    }
  });

  app.delete('/api/roles/:id', requireAdmin, async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: 'Invalid role ID' });
    if (db) {
      const rows = await (db as any).delete(roles).where(eq(roles.id, id)).returning();
      const ok = rows.length > 0;
      if (!ok) return res.status(404).json({ message: 'Role not found' });
      return res.json({ success: true });
    } else {
      const ok = await storage.deleteRole(id);
      if (!ok) return res.status(404).json({ message: 'Role not found' });
      return res.json({ success: true });
    }
  });

  // Permissions CRUD
  app.get('/api/permissions', async (_req: Request, res: Response) => {
    try {
      const list = db ? await db.select().from(permissions) : await storage.getPermissions();
      res.json(list);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch permissions' });
    }
  });

  app.get('/api/permissions/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: 'Invalid permission ID' });
    let record: any;
    if (db) {
      const rows = await db.select().from(permissions).where(eq(permissions.id, id)).limit(1);
      record = rows[0];
    } else {
      record = await storage.getPermissionById(id);
    }
    if (!record) return res.status(404).json({ message: 'Permission not found' });
    res.json(record);
  });

  app.post('/api/permissions', requireAdmin, async (req: Request, res: Response) => {
    try {
      const parsed = insertPermissionSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: 'Invalid permission data', errors: parsed.error.flatten() });
      }
      if (db) {
        const [created] = await (db as any).insert(permissions).values({
          name: parsed.data.name,
          description: (parsed.data as any).description ?? null,
        }).returning();
        return res.status(201).json(created);
      } else {
        const permission = await storage.createPermission(parsed.data);
        return res.status(201).json(permission);
      }
    } catch (error) {
      res.status(500).json({ message: 'Failed to create permission' });
    }
  });

  app.put('/api/permissions/:id', requireAdmin, async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: 'Invalid permission ID' });
    const parsed = insertPermissionSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: 'Invalid permission data', errors: parsed.error.flatten() });
    }
    if (db) {
      const rows = await (db as any).update(permissions).set({
        name: parsed.data.name,
        description: (parsed.data as any).description ?? null,
      }).where(eq(permissions.id, id)).returning();
      const updated = rows[0];
      if (!updated) return res.status(404).json({ message: 'Permission not found' });
      return res.json(updated);
    } else {
      const updated = await storage.updatePermission(id, parsed.data);
      if (!updated) return res.status(404).json({ message: 'Permission not found' });
      return res.json(updated);
    }
  });

  app.delete('/api/permissions/:id', requireAdmin, async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: 'Invalid permission ID' });
    if (db) {
      const rows = await (db as any).delete(permissions).where(eq(permissions.id, id)).returning();
      const ok = rows.length > 0;
      if (!ok) return res.status(404).json({ message: 'Permission not found' });
      return res.json({ success: true });
    } else {
      const ok = await storage.deletePermission(id);
      if (!ok) return res.status(404).json({ message: 'Permission not found' });
      return res.json({ success: true });
    }
  });

  // Role-Permissions mapping
  app.get('/api/roles/:roleId/permissions', async (req: Request, res: Response) => {
    const roleId = parseInt(req.params.roleId);
    if (isNaN(roleId)) return res.status(400).json({ message: 'Invalid role ID' });
    const list = db
      ? await db.select().from(rolePermissions).where(eq(rolePermissions.roleId, roleId))
      : await storage.getRolePermissions(roleId);
    res.json(list);
  });

  app.post('/api/roles/:roleId/permissions/:permissionId', requireAdmin, async (req: Request, res: Response) => {
    const roleId = parseInt(req.params.roleId);
    const permissionId = parseInt(req.params.permissionId);
    if (isNaN(roleId) || isNaN(permissionId)) return res.status(400).json({ message: 'Invalid IDs' });
    if (db) {
      const existing = await db.select().from(rolePermissions).where(and(eq(rolePermissions.roleId, roleId), eq(rolePermissions.permissionId, permissionId))).limit(1);
      if (existing[0]) return res.status(201).json(existing[0]);
      const [inserted] = await (db as any).insert(rolePermissions).values({ roleId, permissionId }).returning();
      return res.status(201).json(inserted);
    } else {
      const rp = await storage.addPermissionToRole(roleId, permissionId);
      return res.status(201).json(rp);
    }
  });

  app.delete('/api/roles/:roleId/permissions/:permissionId', requireAdmin, async (req: Request, res: Response) => {
    const roleId = parseInt(req.params.roleId);
    const permissionId = parseInt(req.params.permissionId);
    if (isNaN(roleId) || isNaN(permissionId)) return res.status(400).json({ message: 'Invalid IDs' });
    if (db) {
      const rows = await (db as any).delete(rolePermissions).where(and(eq(rolePermissions.roleId, roleId), eq(rolePermissions.permissionId, permissionId))).returning();
      const ok = rows.length > 0;
      if (!ok) return res.status(404).json({ message: 'Mapping not found' });
      return res.json({ success: true });
    } else {
      const ok = await storage.removePermissionFromRole(roleId, permissionId);
      if (!ok) return res.status(404).json({ message: 'Mapping not found' });
      return res.json({ success: true });
    }
  });

  // User-Roles mapping
  app.get('/api/users/:userId/roles', async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) return res.status(400).json({ message: 'Invalid user ID' });
    const list = db
      ? await db.select().from(userRoles).where(eq(userRoles.userId, userId))
      : await storage.getUserRoles(userId);
    res.json(list);
  });

  app.post('/api/users/:userId/roles/:roleId', requireAdmin, async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    const roleId = parseInt(req.params.roleId);
    if (isNaN(userId) || isNaN(roleId)) return res.status(400).json({ message: 'Invalid IDs' });
    if (db) {
      const existing = await db.select().from(userRoles).where(and(eq(userRoles.userId, userId), eq(userRoles.roleId, roleId))).limit(1);
      if (existing[0]) return res.status(201).json(existing[0]);
      const [inserted] = await (db as any).insert(userRoles).values({ userId, roleId }).returning();
      return res.status(201).json(inserted);
    } else {
      const ur = await storage.assignRoleToUser(userId, roleId);
      return res.status(201).json(ur);
    }
  });

  app.delete('/api/users/:userId/roles/:roleId', requireAdmin, async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    const roleId = parseInt(req.params.roleId);
    if (isNaN(userId) || isNaN(roleId)) return res.status(400).json({ message: 'Invalid IDs' });
    if (db) {
      const rows = await (db as any).delete(userRoles).where(and(eq(userRoles.userId, userId), eq(userRoles.roleId, roleId))).returning();
      const ok = rows.length > 0;
      if (!ok) return res.status(404).json({ message: 'Mapping not found' });
      return res.json({ success: true });
    } else {
      const ok = await storage.removeRoleFromUser(userId, roleId);
      if (!ok) return res.status(404).json({ message: 'Mapping not found' });
      return res.json({ success: true });
    }
  });

  // User Activity endpoints
  app.get('/api/users/:userId/activities', async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) return res.status(400).json({ message: 'Invalid user ID' });
      
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const activityType = req.query.type as string;
      
      let activities;
      if (activityType) {
        activities = await storage.getUserActivitiesByType(userId, activityType, limit);
      } else {
        activities = await storage.getUserActivities(userId, limit);
      }
      
      res.json(activities);
    } catch (error) {
      console.error('Error fetching user activities:', error);
      res.status(500).json({ message: 'Failed to fetch user activities' });
    }
  });

  app.post('/api/users/:userId/activities', async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) return res.status(400).json({ message: 'Invalid user ID' });
      
      const { activityType, entityType, entityId, entityName, metadata } = req.body;
      
      if (!activityType) {
        return res.status(400).json({ message: 'Activity type is required' });
      }
      
      const activity = await storage.logUserActivity({
        userId,
        activityType,
        entityType: entityType || null,
        entityId: entityId || null,
        entityName: entityName || null,
        metadata: metadata || null
      });
      
      res.status(201).json(activity);
    } catch (error) {
      console.error('Error logging user activity:', error);
      res.status(500).json({ message: 'Failed to log user activity' });
    }
  });

  app.get('/api/activities/recent', async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
      const activities = await storage.getRecentActivities(limit);
      res.json(activities);
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      res.status(500).json({ message: 'Failed to fetch recent activities' });
    }
  });

  app.delete('/api/users/:userId/activities', requireAdmin, async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) return res.status(400).json({ message: 'Invalid user ID' });
      
      const success = await storage.deleteUserActivities(userId);
      if (!success) {
        return res.status(404).json({ message: 'User activities not found' });
      }
      
      res.json({ success: true, message: 'User activities deleted successfully' });
    } catch (error) {
      console.error('Error deleting user activities:', error);
      res.status(500).json({ message: 'Failed to delete user activities' });
    }
  });

  // Get all celebrities
  app.get("/api/celebrities", async (req: Request, res: Response) => {
    try {
      console.log('Fetching celebrities from storage...');
      const celebrities = await storage.getCelebrities();
      console.log('Successfully fetched celebrities:', celebrities.length);
      res.json(celebrities);
    } catch (error) {
      console.error('Error in /api/celebrities endpoint:', error);
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      res.status(500).json({ message: "Failed to fetch celebrities", error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });
  
  // Get celebrity by ID
  app.get("/api/celebrities/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid celebrity ID" });
      }
      
      // First try to get celebrity by celebrity ID
      let celebrity = await storage.getCelebrityById(id);
      
      // If not found, try to get celebrity by user ID
      if (!celebrity) {
        celebrity = await storage.getCelebrityByUserId(id);
      }
      
      if (!celebrity) {
        return res.status(404).json({ message: "Celebrity not found" });
      }

      // Log user activity for celebrity profile view (if user is authenticated)
      if (req.isAuthenticated && req.isAuthenticated()) {
        try {
          const user = req.user as any;
          await storage.logUserActivity({
            userId: user.id,
            activityType: 'view',
            entityType: 'celebrity',
            entityId: celebrity.id,
            entityName: celebrity.name,
            metadata: JSON.stringify({ 
              timestamp: new Date().toISOString(),
              userAgent: req.get('User-Agent') || null
            })
          });
        } catch (activityError) {
          console.error('Failed to log celebrity view activity:', activityError);
        }
      }
      
      res.json(celebrity);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch celebrity" });
    }
  });

  // Alias route: GET /celebrity/:id
  // If the client requests JSON (Accept header or ?format=json), return the same
  // payload as /api/celebrities/:id; otherwise pass through to the SPA router.
  app.get('/celebrity/:id', async (req: Request, res: Response, next: NextFunction) => {
    const accept = (req.headers['accept'] || '').toString().toLowerCase();
    const wantsJson = accept.includes('application/json') || req.query.format === 'json';

    if (!wantsJson) {
      // Let the frontend router render the page
      return next();
    }

    try {
      const rawId = (req.params.id || '').trim();
      const id = parseInt(rawId);
      if (!rawId || isNaN(id)) {
        return res.status(400).json({ message: 'Invalid celebrity ID' });
      }

      let celebrity = await storage.getCelebrityById(id);
      if (!celebrity) {
        celebrity = await storage.getCelebrityByUserId(id);
      }
      if (!celebrity) {
        return res.status(404).json({ message: 'Celebrity not found' });
      }

      // Optional: mirror activity logging from /api/celebrities/:id when authenticated
      if (req.isAuthenticated && req.isAuthenticated()) {
        try {
          const user = req.user as any;
          await storage.logUserActivity({
            userId: user.id,
            activityType: 'view',
            entityType: 'celebrity',
            entityId: celebrity.id,
            entityName: celebrity.name,
            metadata: JSON.stringify({ 
              timestamp: new Date().toISOString(),
              userAgent: req.get('User-Agent') || null
            })
          });
        } catch (activityError) {
          console.error('Failed to log celebrity view activity (alias route):', activityError);
        }
      }

      res.json(celebrity);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch celebrity' });
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

  // Create celebrity profile for the current authenticated user
  app.post('/api/my/celebrity', async (req: Request, res: Response) => {
    if (!req.isAuthenticated?.()) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    try {
      const currentUser = req.user as any;
      const existing = await storage.getCelebrityByUserId(currentUser.id);
      if (existing) {
        return res.status(409).json({ message: 'Celebrity profile already exists', celebrity: existing });
      }

      const merged = {
        userId: currentUser.id,
        name: req.body.name || currentUser.displayName || currentUser.username || currentUser.email || 'Celebrity',
        profession: req.body.profession || currentUser.profession || 'Celebrity',
        imageUrl: req.body.imageUrl || currentUser.profilePicture || '/assets/placeholder-celebrity.svg',
        description: typeof req.body.description !== 'undefined' ? req.body.description : (currentUser.description ?? null),
        category: req.body.category || currentUser.category || 'general',
        isActive: true,
        isElite: false,
        managerInfo: null,
        stylingDetails: null,
        styleNotes: typeof req.body.styleNotes !== 'undefined' ? req.body.styleNotes : null,
        brandsWorn: typeof req.body.brandsWorn !== 'undefined' ? req.body.brandsWorn : null,
      };

      const validated = insertCelebritySchema.parse(merged);
      const celeb = await storage.createCelebrity(validated);

      try {
        await storage.logUserActivity({
          userId: currentUser.id,
          activityType: 'create',
          entityType: 'celebrity',
          entityId: celeb.id,
          entityName: celeb.name,
          metadata: JSON.stringify({ timestamp: new Date().toISOString(), userAgent: req.get('User-Agent') || null })
        });
      } catch (activityError) {
        console.error('Failed to log celebrity creation activity:', activityError);
      }

      return res.status(201).json(celeb);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid celebrity data', errors: error.errors });
      }
      console.error('Error creating self celebrity profile:', error);
      return res.status(500).json({ message: 'Failed to create celebrity profile' });
    }
  });
  
  // Create celebrity
  app.post("/api/celebrities", requireAdmin, async (req: Request, res: Response) => {
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

  // Update celebrity
  app.put("/api/celebrities/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid celebrity ID" });
      }
      const existing = await storage.getCelebrityById(id);
      if (!existing) {
        return res.status(404).json({ message: "Celebrity not found" });
      }
      const partial = req.body as Partial<z.infer<typeof insertCelebritySchema>>;
      const merged = { ...existing, ...partial };
      const validated = insertCelebritySchema.parse(merged);
      const updated = await storage.updateCelebrity(id, validated);
      res.json(updated);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid celebrity data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update celebrity" });
    }
  });

  // Delete celebrity
  app.delete("/api/celebrities/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid celebrity ID" });
      }
      const existing = await storage.getCelebrityById(id);
      if (!existing) {
        return res.status(404).json({ message: "Celebrity not found" });
      }
      await storage.deleteCelebrity(id);
      res.json({ message: "Celebrity deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete celebrity" });
    }
  });
  
  // Get all brands
  app.get("/api/brands", async (req: Request, res: Response) => {
    try {
      const q = (req.query.q as string)?.toLowerCase()?.trim();
      const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;
      const limit = Math.min(parseInt(req.query.limit as string) || 50, 200);
      const offset = parseInt(req.query.offset as string) || 0;
      const includeInactive = ["1", "true", "yes"].includes(String(req.query.includeInactive || "").toLowerCase());

      let brands = await storage.getBrands();

      if (q) {
        brands = brands.filter(b =>
          b.name.toLowerCase().includes(q) ||
          (b.description ? b.description.toLowerCase().includes(q) : false)
        );
      }

      if (typeof categoryId === 'number' && !Number.isNaN(categoryId)) {
        brands = brands.filter(b => (b.categoryIds ?? []).includes(categoryId));
      }

      // Hide inactive brands by default on public site
      if (!includeInactive) {
        brands = brands.filter((b: any) => b?.isActive !== false);
      }

      const paged = brands.slice(offset, offset + limit);
      res.set('X-Total-Count', brands.length.toString());
      res.set('X-Limit', limit.toString());
      res.set('X-Offset', offset.toString());
      res.json(paged);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch brands" });
    }
  });

  // Admin: Disable all brands (set isActive=false)
  app.post("/api/brands/disable-all", requireAdmin, async (_req: Request, res: Response) => {
    try {
      const all = await storage.getBrands();
      let updated = 0;
      for (const b of all) {
        await storage.updateBrand(b.id, { isActive: false });
        updated++;
      }
      res.json({ message: "All brands disabled", updated });
    } catch (error) {
      res.status(500).json({ message: "Failed to disable all brands" });
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
      const bodyPreview = typeof req.body === 'object' ? { ...req.body, imageUrl: req.body?.imageUrl } : 'non-object';
      console.log("[Route:/api/brands] Incoming create request", { storageType: (storage as any)?.constructor?.name, bodyPreview });

      const validatedData = insertBrandSchema.parse(req.body);
      console.log("[Route:/api/brands] Validation passed", { name: validatedData.name });

      const brand = await storage.createBrand(validatedData);
      console.log("[Route:/api/brands] Created brand", { id: (brand as any)?.id, name: brand.name });
      res.status(201).json(brand);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.warn("[Route:/api/brands] Validation error", { issues: error.errors });
        const errors = (error.errors || []).map((issue) => {
          const field = Array.isArray(issue.path) && issue.path.length ? String(issue.path[0]) : "root";
          let rule = issue.code;
          let tip = "Correct this field according to the indicated rule.";
          switch (issue.code) {
            case "too_small": {
              const anyIssue: any = issue as any;
              if (anyIssue?.type === "string" && anyIssue?.minimum === 1) {
                rule = "required";
                tip = field === "name"
                  ? "Enter a brand name (at least 1 character)."
                  : field === "imageUrl"
                  ? "Upload a logo image for the brand."
                  : "Provide a value for this field.";
              } else {
                rule = "min_length";
                tip = "Increase the length to meet the minimum requirement.";
              }
              break;
            }
            case "too_big": {
              rule = "max_length";
              tip = field === "name"
                ? "Shorten the brand name to 100 characters or fewer."
                : "Shorten the value to meet the maximum length.";
              break;
            }
            case "invalid_string": {
              const anyIssue: any = issue as any;
              if (anyIssue?.validation === "url") {
                rule = "invalid_url";
                tip = "Use a valid URL starting with http:// or https://.";
              }
              break;
            }
            case "invalid_type": {
              const anyIssue: any = issue as any;
              if (anyIssue?.expected === "array") {
                rule = "type_array";
                tip = "Provide an array of values (e.g., select multiple options).";
              } else if (anyIssue?.expected === "number") {
                rule = "type_number";
                tip = "Use numeric IDs for categories.";
              } else if (anyIssue?.expected === "string") {
                rule = "type_string";
                tip = "Provide text values for this field.";
              } else {
                rule = "invalid_type";
                tip = `Expected ${String(anyIssue?.expected)}, received ${String(anyIssue?.received)}.`;
              }
              break;
            }
            case "invalid_enum_value": {
              rule = "invalid_option";
              tip = "Choose one of the allowed options from the list.";
              break;
            }
            default:
              break;
          }
          const message = issue.message || (rule === "required" ? "This field is required" : "Invalid value");
          return { field, rule, message, tip };
        });
        return res.status(400).json({ message: "Validation failed", errors });
      }
      console.error("[Route:/api/brands] Create failed", { error: (error as any)?.message, storageType: (storage as any)?.constructor?.name });
      res.status(500).json({ message: "Failed to create brand" });
    }
  });

  // Debug environment and storage info
  app.get("/api/debug/env", async (req: Request, res: Response) => {
    try {
      const storageType = (storage as any)?.constructor?.name || "unknown";
      const { db: drizzleDb, pool: pgPool } = await import("./db");
      let pgVersion: string | null = null;
      let connected = false;
      if (pgPool) {
        try {
          await pgPool.query("SELECT 1");
          connected = true;
          const v = await pgPool.query("SELECT version()");
          pgVersion = v.rows?.[0]?.version || null;
        } catch {
          connected = false;
        }
      }
      res.json({
        storageType,
        env: {
          DATABASE_URL: !!process.env.DATABASE_URL,
          NODE_ENV: process.env.NODE_ENV || null,
          RUN_SEEDERS: process.env.RUN_SEEDERS || null,
        },
        db: {
          connected,
          postgresVersion: pgVersion,
          drizzleInitialized: !!drizzleDb,
        },
      });
    } catch (err) {
      console.error("[Route:/api/debug/env] Failed", err);
      res.status(500).json({ message: "Failed to fetch env info" });
    }
  });

  // Update brand (secured)
  app.put("/api/brands/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid brand ID" });
      }

      const existing = await storage.getBrandById(id);
      if (!existing) {
        return res.status(404).json({ message: "Brand not found" });
      }

      const updates = insertBrandSchema.partial().parse(req.body);
      const updated = await storage.updateBrand(id, updates);
      res.json(updated);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = (error.errors || []).map((issue) => {
          const field = Array.isArray(issue.path) && issue.path.length ? String(issue.path[0]) : "root";
          let rule = issue.code;
          let tip = "Correct this field according to the indicated rule.";
          switch (issue.code) {
            case "too_small": {
              const anyIssue: any = issue as any;
              if (anyIssue?.type === "string" && anyIssue?.minimum === 1) {
                rule = "required";
                tip = field === "name"
                  ? "Enter a brand name (at least 1 character)."
                  : field === "imageUrl"
                  ? "Upload a logo image for the brand."
                  : "Provide a value for this field.";
              } else {
                rule = "min_length";
                tip = "Increase the length to meet the minimum requirement.";
              }
              break;
            }
            case "too_big": {
              rule = "max_length";
              tip = field === "name"
                ? "Shorten the brand name to 100 characters or fewer."
                : "Shorten the value to meet the maximum length.";
              break;
            }
            case "invalid_string": {
              const anyIssue: any = issue as any;
              if (anyIssue?.validation === "url") {
                rule = "invalid_url";
                tip = "Use a valid URL starting with http:// or https://.";
              }
              break;
            }
            case "invalid_type": {
              const anyIssue: any = issue as any;
              if (anyIssue?.expected === "array") {
                rule = "type_array";
                tip = "Provide an array of values (e.g., select multiple options).";
              } else if (anyIssue?.expected === "number") {
                rule = "type_number";
                tip = "Use numeric IDs for categories.";
              } else if (anyIssue?.expected === "string") {
                rule = "type_string";
                tip = "Provide text values for this field.";
              } else {
                rule = "invalid_type";
                tip = `Expected ${String(anyIssue?.expected)}, received ${String(anyIssue?.received)}.`;
              }
              break;
            }
            case "invalid_enum_value": {
              rule = "invalid_option";
              tip = "Choose one of the allowed options from the list.";
              break;
            }
            default:
              break;
          }
          const message = issue.message || (rule === "required" ? "This field is required" : "Invalid value");
          return { field, rule, message, tip };
        });
        return res.status(400).json({ message: "Validation failed", errors });
      }
      res.status(500).json({ message: "Failed to update brand" });
    }
  });

  // Delete brand (secured)
  app.delete("/api/brands/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid brand ID" });
      }

      const existing = await storage.getBrandById(id);
      if (!existing) {
        return res.status(404).json({ message: "Brand not found" });
      }

      const ok = await storage.deleteBrand(id);
      if (!ok) {
        return res.status(500).json({ message: "Failed to delete brand" });
      }
      res.json({ message: "Brand deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete brand" });
    }
  });
  
  // Celebrity Products API endpoints
  
  // Get all celebrity products
  app.get("/api/celebrity-products", async (req: Request, res: Response) => {
    try {
      console.log("Fetching celebrity products with query:", req.query);
      const celebrityId = req.query.celebrityId ? parseInt(req.query.celebrityId as string) : undefined;
      const products = await storage.getCelebrityProducts(celebrityId);
      console.log("Fetched products:", products);
      res.json(products);
    } catch (error) {
      console.error("Error fetching celebrity products:", error);
      res.status(500).json({ message: "Failed to fetch celebrity products", error: error.message });
    }
  });
  
  // Get celebrity product by ID
  app.get("/api/celebrity-products/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      
      const product = await storage.getCelebrityProductById(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });
  
  // Create celebrity product
  app.post("/api/celebrity-products", async (req: Request, res: Response) => {
    try {
      console.log("Creating celebrity product with data:", req.body);
      const validatedData = insertCelebrityProductSchema.parse(req.body);
      console.log("Validated data:", validatedData);
      const product = await storage.createCelebrityProduct(validatedData);
      console.log("Created product:", product);
      res.status(201).json(product);
    } catch (error) {
      console.error("Error creating celebrity product:", error);
      if (error instanceof z.ZodError) {
        console.error("Validation errors:", error.errors);
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create product", error: error.message });
    }
  });
  
  // Update celebrity product
  app.put("/api/celebrity-products/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      
      console.log("Updating celebrity product with data:", req.body);
      const validatedData = insertCelebrityProductSchema.partial().parse(req.body);
      console.log("Validated data for update:", validatedData);
      const product = await storage.updateCelebrityProduct(id, validatedData);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      console.log("Updated product result:", product);
      res.json(product);
    } catch (error) {
      console.error("Error updating celebrity product:", error);
      if (error instanceof z.ZodError) {
        console.error("Validation errors:", error.errors);
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update product" });
    }
  });
  
  // Delete celebrity product
  app.delete("/api/celebrity-products/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      
      const success = await storage.deleteCelebrityProduct(id);
      if (!success) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete product" });
    }
  });
  
  // Brand Products API endpoints
  
  // Get all brand products
  app.get("/api/brand-products", async (req: Request, res: Response) => {
    try {
      console.log("Fetching brand products with query:", req.query);
      const brandId = req.query.brandId ? parseInt(req.query.brandId as string) : undefined;
      const products = await storage.getBrandProducts(brandId as any);
      console.log("Fetched brand products:", products);
      res.json(products);
    } catch (error) {
      console.error("Error fetching brand products:", error);
      res.status(500).json({ message: "Failed to fetch brand products", error: (error as any).message });
    }
  });
  
  // Get brand product by ID
  app.get("/api/brand-products/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      const product = await storage.getBrandProductById(id as any);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });
  
  // Create brand product
  app.post("/api/brand-products", async (req: Request, res: Response) => {
    try {
      console.log("Creating brand product with data:", req.body);
      const validatedData = insertBrandProductSchema.parse(req.body);
      console.log("Validated brand product data:", validatedData);
      const product = await storage.createBrandProduct(validatedData as any);
      console.log("Created brand product:", product);
      res.status(201).json(product);
    } catch (error) {
      console.error("Error creating brand product:", error);
      if (error instanceof z.ZodError) {
        console.error("Validation errors:", error.errors);
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create product", error: (error as any).message });
    }
  });
  
  // Update brand product
  app.put("/api/brand-products/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      console.log("Updating brand product with data:", req.body);
      const validatedData = insertBrandProductSchema.partial().parse(req.body);
      console.log("Validated data for brand product update:", validatedData);
      const product = await storage.updateBrandProduct(id as any, validatedData as any);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      console.log("Updated brand product:", product);
      res.json(product);
    } catch (error) {
      console.error("Error updating brand product:", error);
      if (error instanceof z.ZodError) {
        console.error("Validation errors:", error.errors);
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update product" });
    }
  });
  
  // Delete brand product
  app.delete("/api/brand-products/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      const success = await storage.deleteBrandProduct(id as any);
      if (!success) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // ==================== Celebrity Vibes Events API ====================
  
  // Get all celebrity vibes events (public)
  app.get("/api/celebrity-vibes-events", async (req: Request, res: Response) => {
    try {
      const activeOnly = req.query.active === 'true';
      const featuredOnly = req.query.featured === 'true';
      const events = await storage.getCelebrityVibesEvents({ activeOnly, featuredOnly });
      res.json(events);
    } catch (error) {
      console.error("Error fetching celebrity vibes events:", error);
      res.status(500).json({ message: "Failed to fetch events", error: (error as any).message });
    }
  });
  
  // Get celebrity vibes event by ID (public)
  app.get("/api/celebrity-vibes-events/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid event ID" });
      }
      
      const event = await storage.getCelebrityVibesEventById(id);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      res.json(event);
    } catch (error) {
      console.error("Error fetching celebrity vibes event:", error);
      res.status(500).json({ message: "Failed to fetch event" });
    }
  });
  
  // Get products for a specific event (public)
  app.get("/api/celebrity-vibes-events/:id/products", async (req: Request, res: Response) => {
    try {
      const eventId = parseInt(req.params.id);
      if (isNaN(eventId)) {
        return res.status(400).json({ message: "Invalid event ID" });
      }
      
      const celebrityId = req.query.celebrityId ? parseInt(req.query.celebrityId as string) : undefined;
      const products = await storage.getCelebrityEventProducts(eventId, celebrityId);
      res.json(products);
    } catch (error) {
      console.error("Error fetching event products:", error);
      res.status(500).json({ message: "Failed to fetch event products", error: (error as any).message });
    }
  });
  
  // Get events for a specific celebrity (public)
  app.get("/api/celebrities/:celebrityId/vibes-events", async (req: Request, res: Response) => {
    try {
      const celebrityId = parseInt(req.params.celebrityId);
      if (isNaN(celebrityId)) {
        return res.status(400).json({ message: "Invalid celebrity ID" });
      }
      
      const events = await storage.getCelebrityVibesEventsByCelebrity(celebrityId);
      res.json(events);
    } catch (error) {
      console.error("Error fetching celebrity events:", error);
      res.status(500).json({ message: "Failed to fetch celebrity events", error: (error as any).message });
    }
  });
  
  // Create celebrity vibes event (authenticated users)
  app.post("/api/celebrity-vibes-events", async (req: Request, res: Response) => {
    if (!req.isAuthenticated?.()) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    try {
      console.log("Creating celebrity vibes event with data:", req.body);
      const validatedData = insertCelebrityVibesEventSchema.parse(req.body);
      console.log("Validated event data:", validatedData);
      const event = await storage.createCelebrityVibesEvent(validatedData);
      console.log("Created event:", event);
      
      // Log admin activity
      try {
        const user = req.user as any;
        await storage.logUserActivity({
          userId: user.id,
          activityType: 'create',
          entityType: 'celebrity_vibes_event',
          entityId: event.id,
          entityName: event.name,
          metadata: JSON.stringify({ eventType: event.eventType })
        });
      } catch (activityError) {
        console.error('Failed to log event creation activity:', activityError);
      }
      
      res.status(201).json(event);
    } catch (error) {
      console.error("Error creating celebrity vibes event:", error);
      if (error instanceof z.ZodError) {
        console.error("Validation errors:", error.errors);
        return res.status(400).json({ message: "Invalid event data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create event", error: (error as any).message });
    }
  });
  
  // Update celebrity vibes event (admin only)
  app.put("/api/celebrity-vibes-events/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid event ID" });
      }
      
      console.log("Updating celebrity vibes event with data:", req.body);
      const validatedData = insertCelebrityVibesEventSchema.partial().parse(req.body);
      console.log("Validated data for event update:", validatedData);
      const event = await storage.updateCelebrityVibesEvent(id, validatedData);
      
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      // Log admin activity
      try {
        const user = req.user as any;
        await storage.logUserActivity({
          userId: user.id,
          activityType: 'update',
          entityType: 'celebrity_vibes_event',
          entityId: event.id,
          entityName: event.name,
          metadata: JSON.stringify({ updatedFields: Object.keys(validatedData) })
        });
      } catch (activityError) {
        console.error('Failed to log event update activity:', activityError);
      }
      
      console.log("Updated event:", event);
      res.json(event);
    } catch (error) {
      console.error("Error updating celebrity vibes event:", error);
      if (error instanceof z.ZodError) {
        console.error("Validation errors:", error.errors);
        return res.status(400).json({ message: "Invalid event data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update event" });
    }
  });
  
  // Delete celebrity vibes event (admin only)
  app.delete("/api/celebrity-vibes-events/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid event ID" });
      }
      
      const event = await storage.getCelebrityVibesEventById(id);
      const success = await storage.deleteCelebrityVibesEvent(id);
      if (!success) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      // Log admin activity
      try {
        const user = req.user as any;
        await storage.logUserActivity({
          userId: user.id,
          activityType: 'delete',
          entityType: 'celebrity_vibes_event',
          entityId: id,
          entityName: event?.name || `Event ${id}`,
          metadata: JSON.stringify({})
        });
      } catch (activityError) {
        console.error('Failed to log event deletion activity:', activityError);
      }
      
      res.json({ message: "Event deleted successfully" });
    } catch (error) {
      console.error("Error deleting celebrity vibes event:", error);
      res.status(500).json({ message: "Failed to delete event" });
    }
  });
  
  // Add product to celebrity vibes event (celebrities can add their own products)
  app.post("/api/celebrity-vibes-events/:eventId/products", async (req: Request, res: Response) => {
    try {
      const eventId = parseInt(req.params.eventId);
      if (isNaN(eventId)) {
        return res.status(400).json({ message: "Invalid event ID" });
      }
      
      // Verify user is authenticated
      if (!req.isAuthenticated?.()) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
      
      const user = req.user as any;
      const { celebrityId, productId, displayOrder, notes } = req.body;
      
      // Verify the celebrity belongs to the user or user is admin
      const celebrity = await storage.getCelebrityById(celebrityId);
      if (!celebrity) {
        return res.status(404).json({ message: "Celebrity not found" });
      }
      
      const isOwner = celebrity.userId === user.id;
      const isAdmin = isAdminUser(req);
      
      if (!isOwner && !isAdmin) {
        return res.status(403).json({ message: "You can only add products to your own celebrity profile" });
      }
      
      // Validate the data
      const validatedData = insertCelebrityEventProductSchema.parse({
        eventId,
        celebrityId,
        productId,
        displayOrder: displayOrder || 0,
        notes,
      });
      
      const eventProduct = await storage.addProductToCelebrityEvent(validatedData);
      
      // Log activity
      try {
        await storage.logUserActivity({
          userId: user.id,
          activityType: 'create',
          entityType: 'celebrity_event_product',
          entityId: eventProduct.id,
          entityName: `Product added to event`,
          metadata: JSON.stringify({ eventId, celebrityId, productId })
        });
      } catch (activityError) {
        console.error('Failed to log event product activity:', activityError);
      }
      
      res.status(201).json(eventProduct);
    } catch (error) {
      console.error("Error adding product to event:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to add product to event", error: (error as any).message });
    }
  });
  
  // Update celebrity vibes event product
  app.put("/api/celebrity-vibes-events/:eventId/products/:productLinkId", async (req: Request, res: Response) => {
    try {
      const productLinkId = parseInt(req.params.productLinkId);
      if (isNaN(productLinkId)) {
        return res.status(400).json({ message: "Invalid product link ID" });
      }

      // Verify user is authenticated
      if (!req.isAuthenticated?.()) {
        return res.status(401).json({ message: 'Not authenticated' });
      }

      const user = req.user as any;
      const { displayOrder, notes, isFeatured } = req.body;

      // Get the event product to verify ownership
      const eventProduct = await storage.getCelebrityEventProductById(productLinkId);
      if (!eventProduct) {
        return res.status(404).json({ message: "Product link not found" });
      }

      // Verify the celebrity belongs to the user or user is admin
      const celebrity = await storage.getCelebrityById(eventProduct.celebrityId);
      const isOwner = celebrity?.userId === user.id;
      const isAdmin = isAdminUser(req);

      if (!isOwner && !isAdmin) {
        return res.status(403).json({ message: "You can only update products for your own celebrity profile" });
      }

      const updatedProduct = await storage.updateCelebrityEventProduct(productLinkId, {
        displayOrder,
        notes,
        isFeatured
      });

      if (!updatedProduct) {
        return res.status(404).json({ message: "Product link not found" });
      }

      // Log activity
      try {
        await storage.logUserActivity({
          userId: user.id,
          activityType: 'update',
          entityType: 'celebrity_event_product',
          entityId: productLinkId,
          entityName: `Product updated in event`,
          metadata: JSON.stringify({ displayOrder, notes, isFeatured })
        });
      } catch (activityError) {
        console.error('Failed to log event product update activity:', activityError);
      }

      res.json(updatedProduct);
    } catch (error) {
      console.error("Error updating event product:", error);
      res.status(500).json({ message: "Failed to update event product" });
    }
  });

  // Remove product from celebrity vibes event
  app.delete("/api/celebrity-vibes-events/:eventId/products/:productLinkId", async (req: Request, res: Response) => {
    try {
      const productLinkId = parseInt(req.params.productLinkId);
      if (isNaN(productLinkId)) {
        return res.status(400).json({ message: "Invalid product link ID" });
      }
      
      // Verify user is authenticated
      if (!req.isAuthenticated?.()) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
      
      const user = req.user as any;
      
      // Get the event product to verify ownership
      const eventProduct = await storage.getCelebrityEventProductById(productLinkId);
      if (!eventProduct) {
        return res.status(404).json({ message: "Product link not found" });
      }
      
      // Verify the celebrity belongs to the user or user is admin
      const celebrity = await storage.getCelebrityById(eventProduct.celebrityId);
      const isOwner = celebrity?.userId === user.id;
      const isAdmin = isAdminUser(req);
      
      if (!isOwner && !isAdmin) {
        return res.status(403).json({ message: "You can only remove products from your own celebrity profile" });
      }
      
      const success = await storage.removeProductFromCelebrityEvent(productLinkId);
      if (!success) {
        return res.status(404).json({ message: "Product link not found" });
      }
      
      // Log activity
      try {
        await storage.logUserActivity({
          userId: user.id,
          activityType: 'delete',
          entityType: 'celebrity_event_product',
          entityId: productLinkId,
          entityName: `Product removed from event`,
          metadata: JSON.stringify({ eventProduct })
        });
      } catch (activityError) {
        console.error('Failed to log event product removal activity:', activityError);
      }
      
      res.json({ message: "Product removed from event successfully" });
    } catch (error) {
      console.error("Error removing product from event:", error);
      res.status(500).json({ message: "Failed to remove product from event" });
    }
  });
  
  // ==================== End Celebrity Vibes Events API ====================

  // ==================== Payments (Stripe) ====================
  app.post("/api/payments/checkout", async (req: Request, res: Response) => {
    try {
      if (!stripe) {
        return res.status(500).json({ message: "Stripe is not configured" });
      }

      const { productId, productType } = req.body as { productId?: number; productType?: "celebrity" | "brand" };
      if (!productId || !productType) {
        return res.status(400).json({ message: "productId and productType are required" });
      }

      let name = "Item";
      let priceString: string | null | undefined = null;
      let image: string | undefined;

      if (productType === "celebrity") {
        const product = await storage.getCelebrityProductById(productId);
        if (!product) return res.status(404).json({ message: "Product not found" });
        name = product.name;
        priceString = (product as any).price;
        const img = (product as any).imageUrl;
        if (Array.isArray(img)) image = img[0];
        else if (typeof img === "string") image = img;
      } else if (productType === "brand") {
        const product = await storage.getBrandProductById(productId);
        if (!product) return res.status(404).json({ message: "Product not found" });
        name = (product as any).name || "Item";
        priceString = (product as any).price;
        const img = (product as any).imageUrl;
        if (Array.isArray(img)) image = img[0];
        else if (typeof img === "string") image = img;
      }

      const amountCents = (() => {
        if (!priceString) return null;
        const n = Number(String(priceString).replace(/[^0-9.]/g, ""));
        if (!Number.isFinite(n)) return null;
        return Math.round(n * 100);
      })();

      if (!amountCents || amountCents <= 0) {
        return res.status(400).json({ message: "Invalid or missing price for Stripe checkout" });
      }

      const origin = (req.headers.origin as string) || `${req.protocol}://${req.get("host")}`;
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: "usd",
              unit_amount: amountCents,
              product_data: {
                name,
                images: image ? [image] : undefined,
              },
            },
          },
        ],
        success_url: `${origin}/product/${productId}?type=${productType}&checkout=success`,
        cancel_url: `${origin}/product/${productId}?type=${productType}&checkout=cancel`,
      });

      return res.json({ url: session.url });
    } catch (error) {
      console.error("Stripe checkout error:", error);
      return res.status(500).json({ message: "Failed to create Stripe checkout session" });
    }
  });

  app.post("/api/payments/checkout-test", async (req: Request, res: Response) => {
    try {
      if (!stripe) {
        return res.status(500).json({ message: "Stripe is not configured. Set STRIPE_SECRET_KEY in .env and restart the server." });
      }

      const { name, amountCents, currency, image, quantity } = req.body as { name?: string; amountCents?: number; currency?: string; image?: string; quantity?: number };
      const unitAmount = Math.round(Number(amountCents || 0));
      if (!name || !unitAmount || unitAmount <= 0) {
        return res.status(400).json({ message: "Valid name and positive integer amountCents are required" });
      }
      const origin = (req.headers.origin as string) || `${req.protocol}://${req.get("host")}`;
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: [
          {
            quantity: quantity && quantity > 0 ? quantity : 1,
            price_data: {
              currency: currency || "usd",
              unit_amount: unitAmount,
              product_data: {
                name,
                images: image ? [image] : undefined,
              },
            },
          },
        ],
        success_url: `${origin}/stripe-test?status=success`,
        cancel_url: `${origin}/stripe-test?status=cancel`,
      });
      return res.json({ url: session.url });
    } catch (error) {
      console.error("Stripe test checkout error:", error);
      return res.status(500).json({ message: "Failed to create Stripe test session" });
    }
  });

  app.post("/api/payments/webhook-test", async (req: Request, res: Response) => {
    try {
      console.log("Received webhook-test payload:", req.body);
      return res.json({ received: true });
    } catch {
      return res.status(400).json({ received: false });
    }
  });

  // ==================== End Payments (Stripe) ====================

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
  
  // Update celebrity brand relationship
  app.put("/api/celebritybrands/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid celebrity brand ID" });
      }
      
      const validatedData = insertCelebrityBrandSchema.partial().parse(req.body);
      const celebrityBrand = await storage.updateCelebrityBrand(id, validatedData);
      
      if (!celebrityBrand) {
        return res.status(404).json({ message: "Celebrity brand not found" });
      }
      
      res.json(celebrityBrand);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid celebrity brand data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update celebrity brand relationship" });
    }
  });
  
  // Delete celebrity brand relationship
  app.delete("/api/celebritybrands/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid celebrity brand ID" });
      }
      
      const success = await storage.deleteCelebrityBrand(id);
      if (!success) {
        return res.status(404).json({ message: "Celebrity brand not found" });
      }
      
      res.json({ message: "Celebrity brand deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete celebrity brand relationship" });
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
  
  // Update category
  app.put("/api/categories/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
      // Allow partial updates
      const partial = req.body as Partial<z.infer<typeof insertCategorySchema>>;
      const existing = await storage.getCategoryById(id);
      if (!existing) {
        return res.status(404).json({ message: "Category not found" });
      }
      // Validate merged payload
      const merged = { ...existing, ...partial };
      const validated = insertCategorySchema.parse({ name: merged.name, description: merged.description, imageUrl: merged.imageUrl });
      const updated = await storage.updateCategory(id, validated);
      res.json(updated);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid category data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update category" });
    }
  });
  
  // Delete category
  app.delete("/api/categories/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
      const existing = await storage.getCategoryById(id);
      if (!existing) {
        return res.status(404).json({ message: "Category not found" });
      }
      const ok = await storage.deleteCategory(id);
      if (!ok) {
        return res.status(500).json({ message: "Failed to delete category" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete category" });
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



  // File upload endpoint for plan images
  const planImageUpload = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, 'uploads/plans/');
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = file.originalname.split('.').pop();
        cb(null, `plan-${uniqueSuffix}.${extension}`);
      }
    }),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed'));
      }
    }
  });

  // File upload endpoint for celebrity images
  const celebrityImageUpload = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads/celebrities/'));
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = file.originalname.split('.').pop();
        cb(null, `celebrity-${uniqueSuffix}.${extension}`);
      }
    }),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed'));
      }
    }
  });

  // File upload endpoint for celebrity product images (supports multiple files)
  const celebrityProductImageUpload = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        const uploadsDir = path.join(__dirname, '../uploads/products/');
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }
        cb(null, uploadsDir);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = file.originalname.split('.').pop();
        cb(null, `product-${uniqueSuffix}.${extension}`);
      }
    }),
    limits: { 
      fileSize: 10 * 1024 * 1024, // 10MB per file
      files: 3 // Maximum 10 files per upload
    },
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed'));
      }
    }
  });

  // File upload endpoint for brand logos
  const brandLogoUpload = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        const uploadsDir = path.join(__dirname, '../uploads/brands/');
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }
        cb(null, uploadsDir);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = file.originalname.split('.').pop();
        cb(null, `brand-${uniqueSuffix}.${extension}`);
      }
    }),
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
    fileFilter: (req, file, cb) => {
      const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
      if (allowed.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Only PNG/JPG/SVG images are allowed'));
      }
    }
  });

  // File upload endpoint for user profile pictures
  const profileImageUpload = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        const uploadsDir = path.join(__dirname, '../uploads/profiles/');
        try {
          if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
          }
        } catch (e) {
          // fallback: use current working directory if path resolution fails
        }
        cb(null, uploadsDir);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = file.originalname.split('.').pop();
        cb(null, `profile-${uniqueSuffix}.${extension}`);
      }
    }),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed'));
      }
    }
  });

  app.post("/api/upload/plan-image", planImageUpload.single('image'), (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }
      
      const imageUrl = `/uploads/plans/${req.file.filename}`;
      res.json({ imageUrl });
    } catch (error) {
      console.error('Image upload error:', error);
      res.status(500).json({ message: "Failed to upload image" });
    }
  });

  app.post("/api/upload/celebrity-image", requireAdmin, celebrityImageUpload.single('image'), (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }
      
      const imageUrl = `/uploads/celebrities/${req.file.filename}`;
      res.json({ imageUrl });
    } catch (error) {
      console.error('Celebrity image upload error:', error);
      res.status(500).json({ message: "Failed to upload celebrity image" });
    }
  });

  // File upload endpoint for event images
  const eventImageUpload = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        const uploadsDir = path.join(__dirname, '../uploads/events/');
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }
        cb(null, uploadsDir);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = file.originalname.split('.').pop();
        cb(null, `event-${uniqueSuffix}.${extension}`);
      }
    }),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed'));
      }
    }
  });

  app.post("/api/upload/event-image", eventImageUpload.single('image'), (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }
      
      const url = `/uploads/events/${req.file.filename}`;
      res.json({ url });
    } catch (error) {
      console.error('Event image upload error:', error);
      res.status(500).json({ message: "Failed to upload event image" });
    }
  });

  // Upload and save current user's profile picture
  app.post("/api/upload/profile-picture", profileImageUpload.single('image'), async (req: Request, res: Response) => {
    try {
      if (!req.isAuthenticated?.()) {
        return res.status(401).json({ message: 'Not authenticated' });
      }

      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }

      const imageUrl = `/uploads/profiles/${req.file.filename}`;

      const user = req.user as any;
      const updated = await storage.updateUser(user.id, { profilePicture: imageUrl });

      // Return URL and sanitized user data
      const safe = {
        id: updated.id,
        username: (updated as any).username,
        email: (updated as any).email,
        displayName: (updated as any).displayName,
        profilePicture: (updated as any).profilePicture,
        firstName: (updated as any).firstName,
        lastName: (updated as any).lastName,
        phone: (updated as any).phone,
        accountStatus: (updated as any).accountStatus,
        source: (updated as any).source,
      };
      res.json({ imageUrl, user: safe });
    } catch (error) {
      console.error('Profile picture upload error:', error);
      res.status(500).json({ message: "Failed to upload profile picture" });
    }
  });

  // Upload multiple product images
  app.post("/api/upload/product-images", (req: Request, res: Response) => {
    celebrityProductImageUpload.array('images', 3)(req, res, (err: any) => {
      if (err) {
        // Provide clearer error messages for common multer errors
        if (err instanceof multer.MulterError) {
          switch (err.code) {
            case 'LIMIT_FILE_SIZE':
              return res.status(400).json({ message: 'Each image must be ≤ 10MB.' });
            case 'LIMIT_FILE_COUNT':
            case 'LIMIT_UNEXPECTED_FILE':
              return res.status(400).json({ message: 'Please upload at most 3 images.' });
            default:
              return res.status(400).json({ message: err.message });
          }
        }
        return res.status(400).json({ message: err.message || 'Upload failed' });
      }

      try {
        const files = req.files as Express.Multer.File[];
        if (!files || files.length === 0) {
          return res.status(400).json({ message: "No image files provided" });
        }

        if (files.length < 1) {
          return res.status(400).json({ message: 'Please upload 1–3 images.' });
        }

        const imageUrls = files.map(file => `/uploads/products/${file.filename}`);
        return res.json({ imageUrls });
      } catch (error) {
        console.error('Product images upload error:', error);
        return res.status(500).json({ message: "Failed to upload product images" });
      }
    });
  });

  // Plans endpoints
  // Get all plans
  app.get("/api/plans", async (_req: Request, res: Response) => {
    try {
      const plans = await storage.getPlans();
      res.json(plans);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch plans" });
    }
  });

  // Get plan by ID
  app.get("/api/plans/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid plan ID" });
      }
      const plan = await storage.getPlanById(id);
      if (!plan) {
        return res.status(404).json({ message: "Plan not found" });
      }
      res.json(plan);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch plan" });
    }
  });

  // Create plan
  app.post("/api/plans", async (req: Request, res: Response) => {
    try {
      const validated = insertPlanSchema.parse(req.body);
      const created = await storage.createPlan(validated);
      res.status(201).json(created);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid plan data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create plan" });
    }
  });

  // Update plan
  app.put("/api/plans/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid plan ID" });
      }
      const existing = await storage.getPlanById(id);
      if (!existing) {
        return res.status(404).json({ message: "Plan not found" });
      }
      const partial = req.body as Partial<z.infer<typeof insertPlanSchema>>;
      const merged = { ...existing, ...partial };
      const validated = insertPlanSchema.parse({
        name: merged.name,
        imageUrl: merged.imageUrl,
        price: merged.price,
        discount: merged.discount,
        isActive: merged.isActive,
        features: merged.features,
      });
      const updated = await storage.updatePlan(id, validated);
      res.json(updated);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid plan data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update plan" });
    }
  });

  // Delete plan
  app.delete("/api/plans/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid plan ID" });
      }
      const existing = await storage.getPlanById(id);
      if (!existing) {
        return res.status(404).json({ message: "Plan not found" });
      }
      const ok = await storage.deletePlan(id);
      if (!ok) {
        return res.status(500).json({ message: "Failed to delete plan" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete plan" });
    }
  });

  // Assign celebrity role to user
  app.post('/api/users/:id/assign-celebrity-role', async (req: Request, res: Response) => {
    if (!req.isAuthenticated?.()) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    try {
      const userId = parseInt(req.params.id);
      const currentUser = req.user;

      // Check if current user is admin
      const isAdmin = currentUser?.email === 'admin@cele.com';
      if (!currentUser || !isAdmin) {
        return res.status(403).json({ message: 'Admin access required' });
      }

      // Check if user exists
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Find or create Celebrity role (case-insensitive lookup, canonical name 'Celebrity')
      const allRoles = await storage.getRoles();
      let celebrityRole = allRoles.find(role => role.name?.toLowerCase() === 'celebrity');
      if (!celebrityRole) {
        celebrityRole = await storage.createRole({
          name: 'Celebrity',
          description: 'Celebrity user with special privileges'
        });
      }

      // Check if user already has celebrity role
      const userRoles = await storage.getUserRoles(userId);
      const hasCelebrityRole = userRoles.some(ur => ur.roleId === celebrityRole.id);
      
      if (!hasCelebrityRole) {
        // Assign celebrity role to user only if they don't have it
        await storage.assignRoleToUser(userId, celebrityRole.id);
      }

      // Create celebrity profile if it doesn't exist
      const existingCelebrity = await storage.getCelebrityByUserId(userId);
      if (!existingCelebrity) {
        await storage.createCelebrity({
          userId: userId,
          name: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.username || user.email || 'Celebrity',
          profession: user.profession || 'Celebrity',
          imageUrl: user.profilePicture || null,
          description: user.description || 'Celebrity profile',
          category: user.category || 'general',
          isActive: true,
          isElite: false,
          managerInfo: null,
          stylingDetails: null,
          styleNotes: null
        });
      }

      // Log the activity
      await storage.logUserActivity({
        userId: currentUser.id,
        action: 'assign_celebrity_role',
        details: `${hasCelebrityRole ? 'Updated' : 'Assigned'} celebrity role for user ${user.username || user.email} (ID: ${userId})`,
        timestamp: new Date()
      });

      res.json({ 
        message: hasCelebrityRole ? 'Celebrity role updated successfully' : 'Celebrity role assigned successfully',
        user: user,
        role: celebrityRole,
        alreadyHadRole: hasCelebrityRole
      });
    } catch (error) {
      console.error('Error assigning celebrity role:', error);
      res.status(500).json({ message: 'Failed to assign celebrity role', error: error.message });
    }
  });

  // Blog API endpoints
  
  // Get all published blogs
  app.get('/api/blogs', async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;
      const category = req.query.category as string;
      
      let blogs;
      if (category) {
        blogs = await storage.getBlogsByCategory(category, limit, offset);
      } else {
        blogs = await storage.getPublishedBlogs(limit, offset);
      }
      
      res.json(blogs);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      res.status(500).json({ message: 'Failed to fetch blogs', error: error.message });
    }
  });

  // Get single blog by ID
  app.get('/api/blogs/:id', async (req, res) => {
    try {
      const blogId = parseInt(req.params.id);
      if (isNaN(blogId)) {
        return res.status(400).json({ message: 'Invalid blog ID' });
      }

      const blog = await storage.getBlogById(blogId);
      if (!blog) {
        return res.status(404).json({ message: 'Blog not found' });
      }

      // Increment view count
      await storage.incrementBlogViews(blogId);

      res.json(blog);
    } catch (error) {
      console.error('Error fetching blog:', error);
      res.status(500).json({ message: 'Failed to fetch blog', error: error.message });
    }
  });

  // Create new blog (authenticated users only)
  app.post('/api/blogs', async (req, res) => {
    if (!req.isAuthenticated?.()) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    try {
      const currentUser = req.user as any;
      const { title, content, excerpt, imageUrl, celebrityId, category, tags, isPublished } = req.body;

      if (!title || !content) {
        return res.status(400).json({ message: 'Title and content are required' });
      }

      const blogData = {
        title,
        content,
        excerpt: excerpt || content.substring(0, 200) + '...',
        imageUrl: imageUrl || null,
        authorId: currentUser.id,
        celebrityId: celebrityId || null,
        category: category || 'general',
        tags: tags || [],
        isPublished: isPublished || false,
        publishedAt: isPublished ? new Date().toISOString() : null,
      };

      const newBlog = await storage.createBlog(blogData);

      // Log the activity
      await storage.logUserActivity({
        userId: currentUser.id,
        action: 'create_blog',
        details: `Created blog: ${title}`,
        timestamp: new Date()
      });

      res.status(201).json(newBlog);
    } catch (error) {
      console.error('Error creating blog:', error);
      res.status(500).json({ message: 'Failed to create blog', error: error.message });
    }
  });

  // Update blog (author or admin only)
  app.put('/api/blogs/:id', async (req, res) => {
    if (!req.isAuthenticated?.()) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    try {
      const currentUser = req.user as any;
      const blogId = parseInt(req.params.id);
      
      if (isNaN(blogId)) {
        return res.status(400).json({ message: 'Invalid blog ID' });
      }

      const existingBlog = await storage.getBlogById(blogId);
      if (!existingBlog) {
        return res.status(404).json({ message: 'Blog not found' });
      }

      // Check if user is author or admin
      const isAdmin = currentUser.roles?.some((role: any) => role.name === 'admin');
      if (existingBlog.authorId !== currentUser.id && !isAdmin) {
        return res.status(403).json({ message: 'Not authorized to update this blog' });
      }

      const { title, content, excerpt, imageUrl, celebrityId, category, tags, isPublished } = req.body;
      
      const updates: any = {};
      if (title !== undefined) updates.title = title;
      if (content !== undefined) updates.content = content;
      if (excerpt !== undefined) updates.excerpt = excerpt;
      if (imageUrl !== undefined) updates.imageUrl = imageUrl;
      if (celebrityId !== undefined) updates.celebrityId = celebrityId;
      if (category !== undefined) updates.category = category;
      if (tags !== undefined) updates.tags = tags;
      if (isPublished !== undefined) {
        updates.isPublished = isPublished;
        if (isPublished && !existingBlog.publishedAt) {
          updates.publishedAt = new Date().toISOString();
        }
      }

      const updatedBlog = await storage.updateBlog(blogId, updates);

      // Log the activity
      await storage.logUserActivity({
        userId: currentUser.id,
        action: 'update_blog',
        details: `Updated blog: ${existingBlog.title}`,
        timestamp: new Date()
      });

      res.json(updatedBlog);
    } catch (error) {
      console.error('Error updating blog:', error);
      res.status(500).json({ message: 'Failed to update blog', error: error.message });
    }
  });

  // Delete blog (author or admin only)
  app.delete('/api/blogs/:id', async (req, res) => {
    if (!req.isAuthenticated?.()) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    try {
      const currentUser = req.user as any;
      const blogId = parseInt(req.params.id);
      
      if (isNaN(blogId)) {
        return res.status(400).json({ message: 'Invalid blog ID' });
      }

      const existingBlog = await storage.getBlogById(blogId);
      if (!existingBlog) {
        return res.status(404).json({ message: 'Blog not found' });
      }

      // Check if user is author or admin
      const isAdmin = currentUser.roles?.some((role: any) => role.name === 'admin');
      if (existingBlog.authorId !== currentUser.id && !isAdmin) {
        return res.status(403).json({ message: 'Not authorized to delete this blog' });
      }

      const deleted = await storage.deleteBlog(blogId);
      if (!deleted) {
        return res.status(500).json({ message: 'Failed to delete blog' });
      }

      // Log the activity
      await storage.logUserActivity({
        userId: currentUser.id,
        action: 'delete_blog',
        details: `Deleted blog: ${existingBlog.title}`,
        timestamp: new Date()
      });

      res.json({ message: 'Blog deleted successfully' });
    } catch (error) {
      console.error('Error deleting blog:', error);
      res.status(500).json({ message: 'Failed to delete blog', error: error.message });
    }
  });

  // Like a blog
  app.post('/api/blogs/:id/like', async (req, res) => {
    try {
      const blogId = parseInt(req.params.id);
      if (isNaN(blogId)) {
        return res.status(400).json({ message: 'Invalid blog ID' });
      }

      const updatedBlog = await storage.incrementBlogLikes(blogId);
      if (!updatedBlog) {
        return res.status(404).json({ message: 'Blog not found' });
      }

      res.json({ likes: updatedBlog.likes });
    } catch (error) {
      console.error('Error liking blog:', error);
      res.status(500).json({ message: 'Failed to like blog', error: error.message });
    }
  });

  // Get blogs by author
  app.get('/api/users/:userId/blogs', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }

      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;

      const blogs = await storage.getBlogsByAuthor(userId, limit, offset);
      res.json(blogs);
    } catch (error) {
      console.error('Error fetching user blogs:', error);
      res.status(500).json({ message: 'Failed to fetch user blogs', error: error.message });
    }
  });

  // Brand logo upload
  app.post("/api/upload/brand-logo", requireAdmin, brandLogoUpload.single('logo'), (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No logo file provided" });
      }

      const imageUrl = `/uploads/brands/${req.file.filename}`;
      return res.json({ imageUrl });
    } catch (error) {
      console.error('Brand logo upload error:', error);
      return res.status(500).json({ message: "Failed to upload brand logo" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
