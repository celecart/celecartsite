import dotenv from 'dotenv';
import { initDbFromEnv, verifyDbConnection } from './db';
import { storage, setUseDbStorage } from './storage';

async function ensureAdminUser() {
  dotenv.config();

  const dbInitialized = initDbFromEnv();
  if (!dbInitialized) {
    console.error('DATABASE_URL not set. Cannot use DB-backed storage.');
    return;
  }
  const dbConnected = await verifyDbConnection();
  if (!dbConnected) {
    console.error('Database connection failed. Aborting.');
    return;
  }
  setUseDbStorage(true);
  console.log('Using database storage');

  const adminEmail = 'admin@cele.com';
  const desiredPassword = '123456789';

  // Ensure Super Admin role exists
  const roles = await storage.getRoles();
  let superAdmin = roles.find(r => r.name === 'Super Admin');
  if (!superAdmin) {
    console.log('Super Admin role not found. Creating...');
    superAdmin = await storage.createRole({
      name: 'Super Admin',
      description: 'Full system access with all permissions'
    } as any);
    console.log(`Created Super Admin role with ID ${superAdmin.id}`);
  } else {
    console.log(`Super Admin role exists with ID ${superAdmin.id}`);
  }

  // Ensure admin user exists and has desired credentials
  const existingAdmin = await storage.getUserByEmail(adminEmail);
  if (existingAdmin) {
    console.log(`Admin user already exists (ID: ${existingAdmin.id}). Updating password...`);
    const updated = await storage.updateUserPasswordByEmail(adminEmail, desiredPassword);
    console.log(updated ? 'Password updated successfully' : 'Password update failed');

    // Ensure role assignment
    const currentRoles = await storage.getUserRoles(existingAdmin.id);
    const hasSuperAdmin = currentRoles.some(ur => ur.roleId === superAdmin!.id);
    if (!hasSuperAdmin) {
      await storage.assignRoleToUser(existingAdmin.id, superAdmin!.id);
      console.log('Assigned Super Admin role to existing admin user');
    } else {
      console.log('Admin user already has Super Admin role');
    }
  } else {
    console.log('Admin user not found. Creating...');
    // Use username "admin" if available; otherwise fall back to email as username
    const existingByUsername = await storage.getUserByUsername('admin');
    const username = existingByUsername ? adminEmail : 'admin';
    const newUser = await storage.createUser({
      username,
      email: adminEmail,
      password: desiredPassword,
      displayName: 'Admin User',
      accountStatus: 'Active',
      source: 'local'
    } as any);
    console.log(`Created admin user with ID ${newUser.id}, username ${newUser.username}`);

    await storage.assignRoleToUser(newUser.id, superAdmin!.id);
    console.log('Assigned Super Admin role to new admin user');
  }

  // Verification summary
  const admin = await storage.getUserByEmail(adminEmail);
  if (admin) {
    const adminRoles = await storage.getUserRoles(admin.id);
    console.log('Verification:');
    console.log({ id: admin.id, username: admin.username, email: admin.email });
    console.log('Roles:', adminRoles.map(r => r.roleId));
  } else {
    console.error('Verification failed: admin user not found');
  }
}

ensureAdminUser().catch(err => {
  console.error('Error ensuring admin user:', err);
});