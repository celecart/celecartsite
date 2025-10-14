import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as LocalStrategy } from 'passport-local';
import { storage } from './storage';
import { User } from '../shared/schema';
import dotenv from 'dotenv';
dotenv.config();

// Configure Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID || '',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:5000/auth/google/callback",
  passReqToCallback: true
}, async (req, accessToken, refreshToken, profile, done) => {
  try {
    // Capture user's IP address
    const ipAddress = req.ip || req.connection.remoteAddress || req.socket.remoteAddress || 
                     (req.connection as any)?.socket?.remoteAddress || 'unknown';

    // Check if user already exists with this Google ID
    let user = await storage.getUserByGoogleId(profile.id);
    
    if (user) {
      return done(null, user);
    }
    
    // Check if user exists with this email
    const email = profile.emails?.[0]?.value;
    if (email) {
      user = await storage.getUserByEmail(email);
      if (user) {
        // Update existing user with Google ID and profile data
        const updated = await storage.updateUser(user.id, {
          googleId: profile.id,
          displayName: profile.displayName || user.displayName || '',
          profilePicture: profile.photos?.[0]?.value || user.profilePicture || '',
          source: 'google',
        });
        return done(null, updated || user);
      }
    }
    
    // Create new user
    const newUser = await storage.createUser({
      username: profile.displayName || profile.emails?.[0]?.value?.split('@')[0] || 'user',
      email: profile.emails?.[0]?.value || '',
      displayName: profile.displayName || '',
      profilePicture: profile.photos?.[0]?.value || null,
      firstName: profile.name?.givenName || '',
      lastName: profile.name?.familyName || '',
      googleId: profile.id,
      accountStatus: 'Active',
      source: 'google',
      ipAddress: ipAddress,
      registrationDate: new Date(),
    });
    
    // Log signup activity for new Google user
    try {
      await storage.logUserActivity({
        userId: newUser.id,
        activityType: 'signup',
        entityType: 'auth',
        entityId: null,
        entityName: 'Google OAuth Registration',
        metadata: JSON.stringify({ 
          registrationMethod: 'google',
          timestamp: new Date().toISOString(),
          userAgent: req.get('User-Agent') || null,
          googleId: profile.id,
          hasProfilePicture: !!profile.photos?.[0]?.value
        })
      });
    } catch (activityError) {
      console.error('Failed to log Google signup activity:', activityError);
    }
    
    return done(null, newUser);
  } catch (error) {
    return done(error, false);
  }
}));

// Serialize user for session
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await storage.getUser(id);
    done(null, user);
  } catch (error) {
    done(error, false);
  }
});

// Configure Local Strategy for email/password login
passport.use(
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    async (email, password, done) => {
      try {
        const user = await storage.getUserByEmail(email);
        if (!user || !user.password) {
          return done(null, false, { message: 'Incorrect email or password' });
        }
        // Plaintext password check (demo only)
        if (user.password !== password) {
          return done(null, false, { message: 'Incorrect email or password' });
        }
        return done(null, user);
      } catch (error) {
        return done(error as any);
      }
    }
  )
);

export default passport;