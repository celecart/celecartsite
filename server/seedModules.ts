import { db, initDbFromEnv } from './db';
import { permissions, roles, rolePermissions } from '../shared/schema';
import { eq, and } from 'drizzle-orm';

// Define the modules and their display names
const MODULES = [
  { name: 'users', displayName: 'Users Management' },
  { name: 'celebrities', displayName: 'Celebrities' },
  { name: 'plans', displayName: 'Plans' },
  { name: 'brands', displayName: 'Brands' },
  { name: 'categories', displayName: 'Categories' },
  { name: 'tournaments', displayName: 'Tournaments' },
  { name: 'content', displayName: 'Content Management' },
  { name: 'analytics', displayName: 'Analytics' },
  { name: 'settings', displayName: 'System Settings' }
];

// CRUD operations for each module
const CRUD_OPERATIONS = ['create', 'read', 'update', 'delete'];

export async function seedModulesAndPermissions() {
  console.log('🌱 Seeding modules and permissions...');
  
  try {
    // Create permissions for each module
    const permissionsToCreate = [];
    
    for (const module of MODULES) {
      for (const operation of CRUD_OPERATIONS) {
        const permissionName = `${module.name}.${operation}`;
        const description = `${operation.charAt(0).toUpperCase() + operation.slice(1)} ${module.displayName}`;
        
        permissionsToCreate.push({
          name: permissionName,
          description: description,
          module: module.name
        });
      }
    }
    
    // Insert permissions (ignore duplicates)
    for (const permission of permissionsToCreate) {
      try {
        // Check if permission already exists
        const existing = await db
          .select()
          .from(permissions)
          .where(eq(permissions.name, permission.name))
          .limit(1);
        
        if (existing.length === 0) {
          await db.insert(permissions).values(permission);
          console.log(`✅ Created permission: ${permission.name}`);
        } else {
          console.log(`⏭️  Permission already exists: ${permission.name}`);
        }
      } catch (error) {
        console.error(`❌ Error creating permission ${permission.name}:`, error);
      }
    }
    
    // Create default admin role if it doesn't exist
    let adminRole = await db
      .select()
      .from(roles)
      .where(eq(roles.name, 'Super Admin'))
      .limit(1);
    
    if (adminRole.length === 0) {
      const [newAdminRole] = await db
        .insert(roles)
        .values({
          name: 'Super Admin',
          description: 'Full system access with all permissions'
        })
        .returning();
      adminRole = [newAdminRole];
      console.log('✅ Created Super Admin role');
    } else {
      console.log('⏭️  Super Admin role already exists');
    }
    
    // Assign all permissions to Super Admin role
    const allPermissions = await db.select().from(permissions);
    
    for (const permission of allPermissions) {
      try {
        // Check if role-permission association already exists
        const existing = await db
          .select()
          .from(rolePermissions)
          .where(
            and(
              eq(rolePermissions.roleId, adminRole[0].id),
              eq(rolePermissions.permissionId, permission.id)
            )
          )
          .limit(1);
        
        if (existing.length === 0) {
          await db.insert(rolePermissions).values({
            roleId: adminRole[0].id,
            permissionId: permission.id
          });
        }
      } catch (error) {
        console.error(`❌ Error assigning permission ${permission.name} to Super Admin:`, error);
      }
    }
    
    console.log('🎉 Module seeding completed successfully!');
    
    // Return summary
    const totalPermissions = await db.select().from(permissions);
    return {
      success: true,
      modulesCreated: MODULES.length,
      permissionsCreated: totalPermissions.length,
      modules: MODULES
    };
    
  } catch (error) {
    console.error('❌ Error seeding modules and permissions:', error);
    throw error;
  }
}

// Function to get all modules with their permissions
export async function getModulesWithPermissions() {
  try {
    const allPermissions = await db.select().from(permissions);
    
    const moduleMap = new Map();
    
    // Group permissions by module
    for (const permission of allPermissions) {
      const moduleName = permission.module || permission.name.split('.')[0];
      
      if (!moduleMap.has(moduleName)) {
        const moduleInfo = MODULES.find(m => m.name === moduleName);
        moduleMap.set(moduleName, {
          name: moduleName,
          displayName: moduleInfo?.displayName || moduleName,
          permissions: []
        });
      }
      
      moduleMap.get(moduleName).permissions.push(permission);
    }
    
    return Array.from(moduleMap.values());
  } catch (error) {
    console.error('❌ Error getting modules with permissions:', error);
    throw error;
  }
}

// Allow running standalone from CLI
import dotenv from 'dotenv';
dotenv.config();

if (import.meta.url === `file://${process.argv[1]}`) {
  const initialized = initDbFromEnv();
  if (!initialized || !db) {
    console.error('❌ DATABASE_URL not set or DB not initialized');
    process.exit(1);
  }
  seedModulesAndPermissions()
    .then(() => {
      console.log('🎉 Standalone module/permission seeding completed');
    })
    .catch(err => {
      console.error('❌ Error seeding modules/permissions:', err);
      process.exit(1);
    });
}