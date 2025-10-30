import dotenv from 'dotenv';
import { initDbFromEnv, verifyDbConnection, db } from '../db';
import { users, roles, userRoles, type InsertUser, type InsertRole } from '../../shared/schema';
import { eq, and } from 'drizzle-orm';

// Load environment variables
dotenv.config();

export async function seedRolesAndUsers() {
  const initialized = initDbFromEnv();
  if (!initialized || !db) {
    console.log('❌ Database not initialized');
    return;
  }
  const connected = await verifyDbConnection();
  if (!connected) {
    console.log('❌ Database connection failed');
    return;
  }

  // Ensure roles exist: Celebrity and Fan
  const ensureRole = async (name: string, description?: string) => {
    const existing = await db.select().from(roles).where(eq(roles.name, name)).limit(1);
    if (existing.length === 0) {
      const [created] = await db.insert(roles).values({ name, description }).returning();
      console.log(`✅ Created role: ${name} (id=${created.id})`);
      return created;
    }
    console.log(`⏭️  Role already exists: ${name} (id=${existing[0].id})`);
    return existing[0];
  };

  const celebrityRole = await ensureRole('Celebrity', 'Celebrity user with special privileges');
  const fanRole = await ensureRole('Fan', 'Regular fan user');

  // Ensure users exist and assign roles
  const ensureUser = async (u: InsertUser) => {
    const existingByEmail = u.email
      ? await db.select().from(users).where(eq(users.email, u.email)).limit(1)
      : [];
    if (existingByEmail.length > 0) {
      console.log(`⏭️  User already exists: ${existingByEmail[0].username} (${existingByEmail[0].email}) id=${existingByEmail[0].id}`);
      return existingByEmail[0];
    }
    const [created] = await db.insert(users).values({
      username: u.username,
      password: u.password,
      email: u.email ?? null,
      displayName: u.displayName ?? null,
      profilePicture: u.profilePicture ?? null,
      firstName: u.firstName ?? null,
      lastName: u.lastName ?? null,
      phone: u.phone ?? null,
      accountStatus: u.accountStatus ?? 'Active',
      source: u.source ?? 'local',
      googleId: (u as any).googleId ?? null,
      resetToken: (u as any).resetToken ?? null,
      resetTokenExpires: (u as any).resetTokenExpires ?? null,
    }).returning();
    console.log(`✅ Created user: ${created.username} (${created.email}) id=${created.id}`);
    return created;
  };

  const celebUser = await ensureUser({
    username: 'celebrity_user',
    password: '123456789',
    email: 'celebrity@cele.com',
    displayName: 'Sample Celebrity',
    firstName: 'Sample',
    lastName: 'Celebrity',
    accountStatus: 'Active',
    source: 'local'
  } as InsertUser);

  const fanUser = await ensureUser({
    username: 'fan_user',
    password: '123456789',
    email: 'fan@cele.com',
    displayName: 'Sample Fan',
    firstName: 'Sample',
    lastName: 'Fan',
    accountStatus: 'Active',
    source: 'local'
  } as InsertUser);

  // Helper to ensure user-role mapping exists
  const ensureUserRole = async (userId: number, roleId: number) => {
    const existing = await db
      .select()
      .from(userRoles)
      .where(and(eq(userRoles.userId, userId), eq(userRoles.roleId, roleId)))
      .limit(1);
    if (existing.length === 0) {
      await db.insert(userRoles).values({ userId, roleId });
      console.log(`✅ Assigned role ${roleId} to user ${userId}`);
    } else {
      console.log(`⏭️  User ${userId} already has role ${roleId}`);
    }
  };

  await ensureUserRole(celebUser.id, celebrityRole.id);
  await ensureUserRole(fanUser.id, fanRole.id);

  console.log('🎉 Roles and users seeding completed');
}

// Allow running standalone
if (import.meta.url === `file://${process.argv[1]}`) {
  seedRolesAndUsers().catch(err => {
    console.error('❌ Error seeding roles/users:', err);
    process.exitCode = 1;
  });
}