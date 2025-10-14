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
  insertPlanSchema
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
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { emailService } from "./services/email";

export async function registerRoutes(app: Express): Promise<Server> {
  
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

      // In development, include resetUrl to simplify local testing
      const payload: any = { message: 'If the email exists, a password reset link has been sent' };
      if (app.get('env') === 'development') {
        payload.resetUrl = resetUrl;
      }
      res.json(payload);
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

  // Users list (for assignments)
  app.get('/api/users', async (_req: Request, res: Response) => {
    try {
      const users = await storage.getUsers();
      const safe = users.map(u => ({
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
      }));
      res.json(safe);
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
    };
    res.json(safe);
  });

  // Create user (admin only)
  app.post('/api/users', requireAdmin, async (req: Request, res: Response) => {
    try {
      const parsed = insertUserSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: 'Invalid user data', errors: parsed.error.flatten() });
      }
      const allowedStatuses = ['Active', 'Suspended', 'Pending Verification', 'Deleted'];
      const normalizedStatus = parsed.data.accountStatus && allowedStatuses.includes(parsed.data.accountStatus) ? parsed.data.accountStatus : 'Active';
      
      // Capture IP address and registration date
      const ipAddress = req.ip || req.connection.remoteAddress || req.socket.remoteAddress || 'unknown';
      const registrationDate = new Date();
      
      const created = await storage.createUser({ 
        ...parsed.data, 
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

  // Roles CRUD
  app.get('/api/roles', async (_req: Request, res: Response) => {
    try {
      const roles = await storage.getRoles();
      res.json(roles);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch roles' });
    }
  });

  app.get('/api/roles/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: 'Invalid role ID' });
    const role = await storage.getRoleById(id);
    if (!role) return res.status(404).json({ message: 'Role not found' });
    res.json(role);
  });

  app.post('/api/roles', requireAdmin, async (req: Request, res: Response) => {
    try {
      const parsed = insertRoleSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: 'Invalid role data', errors: parsed.error.flatten() });
      }
      const role = await storage.createRole(parsed.data);
      res.status(201).json(role);
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
    const updated = await storage.updateRole(id, parsed.data);
    if (!updated) return res.status(404).json({ message: 'Role not found' });
    res.json(updated);
  });

  app.delete('/api/roles/:id', requireAdmin, async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: 'Invalid role ID' });
    const ok = await storage.deleteRole(id);
    if (!ok) return res.status(404).json({ message: 'Role not found' });
    res.json({ success: true });
  });

  // Permissions CRUD
  app.get('/api/permissions', async (_req: Request, res: Response) => {
    try {
      const permissions = await storage.getPermissions();
      res.json(permissions);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch permissions' });
    }
  });

  app.get('/api/permissions/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: 'Invalid permission ID' });
    const permission = await storage.getPermissionById(id);
    if (!permission) return res.status(404).json({ message: 'Permission not found' });
    res.json(permission);
  });

  app.post('/api/permissions', requireAdmin, async (req: Request, res: Response) => {
    try {
      const parsed = insertPermissionSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: 'Invalid permission data', errors: parsed.error.flatten() });
      }
      const permission = await storage.createPermission(parsed.data);
      res.status(201).json(permission);
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
    const updated = await storage.updatePermission(id, parsed.data);
    if (!updated) return res.status(404).json({ message: 'Permission not found' });
    res.json(updated);
  });

  app.delete('/api/permissions/:id', requireAdmin, async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: 'Invalid permission ID' });
    const ok = await storage.deletePermission(id);
    if (!ok) return res.status(404).json({ message: 'Permission not found' });
    res.json({ success: true });
  });

  // Role-Permissions mapping
  app.get('/api/roles/:roleId/permissions', async (req: Request, res: Response) => {
    const roleId = parseInt(req.params.roleId);
    if (isNaN(roleId)) return res.status(400).json({ message: 'Invalid role ID' });
    const list = await storage.getRolePermissions(roleId);
    res.json(list);
  });

  app.post('/api/roles/:roleId/permissions/:permissionId', requireAdmin, async (req: Request, res: Response) => {
    const roleId = parseInt(req.params.roleId);
    const permissionId = parseInt(req.params.permissionId);
    if (isNaN(roleId) || isNaN(permissionId)) return res.status(400).json({ message: 'Invalid IDs' });
    const rp = await storage.addPermissionToRole(roleId, permissionId);
    res.status(201).json(rp);
  });

  app.delete('/api/roles/:roleId/permissions/:permissionId', requireAdmin, async (req: Request, res: Response) => {
    const roleId = parseInt(req.params.roleId);
    const permissionId = parseInt(req.params.permissionId);
    if (isNaN(roleId) || isNaN(permissionId)) return res.status(400).json({ message: 'Invalid IDs' });
    const ok = await storage.removePermissionFromRole(roleId, permissionId);
    if (!ok) return res.status(404).json({ message: 'Mapping not found' });
    res.json({ success: true });
  });

  // User-Roles mapping
  app.get('/api/users/:userId/roles', async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) return res.status(400).json({ message: 'Invalid user ID' });
    const list = await storage.getUserRoles(userId);
    res.json(list);
  });

  app.post('/api/users/:userId/roles/:roleId', requireAdmin, async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    const roleId = parseInt(req.params.roleId);
    if (isNaN(userId) || isNaN(roleId)) return res.status(400).json({ message: 'Invalid IDs' });
    const ur = await storage.assignRoleToUser(userId, roleId);
    res.status(201).json(ur);
  });

  app.delete('/api/users/:userId/roles/:roleId', requireAdmin, async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    const roleId = parseInt(req.params.roleId);
    if (isNaN(userId) || isNaN(roleId)) return res.status(400).json({ message: 'Invalid IDs' });
    const ok = await storage.removeRoleFromUser(userId, roleId);
    if (!ok) return res.status(404).json({ message: 'Mapping not found' });
    res.json({ success: true });
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

      // Log user activity for celebrity profile view (if user is authenticated)
      if (req.isAuthenticated && req.isAuthenticated()) {
        try {
          const user = req.user as any;
          await storage.logUserActivity({
            userId: user.id,
            activityType: 'view',
            entityType: 'celebrity',
            entityId: id,
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

  // Update celebrity
  app.put("/api/celebrities/:id", async (req: Request, res: Response) => {
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
  app.delete("/api/celebrities/:id", async (req: Request, res: Response) => {
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

  app.post("/api/upload/celebrity-image", celebrityImageUpload.single('image'), (req: Request, res: Response) => {
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
      const validated = insertPlanSchema.parse({ imageUrl: merged.imageUrl, price: merged.price, discount: merged.discount });
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

  const httpServer = createServer(app);
  return httpServer;
}
