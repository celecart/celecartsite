import dotenv from 'dotenv';
import { initDbFromEnv, db } from './server/db';
import { users, roles, userRoles } from './drizzle/schema';

// Load environment variables first
dotenv.config();

async function checkDatabaseDirectly() {
  const dbInitialized = initDbFromEnv();
  if (!dbInitialized || !db) {
    console.log('Database not initialized');
    return;
  }
  
  console.log('Checking database tables directly...');
  
  try {
    // Check users table
    const allUsers = await db.select().from(users);
    console.log(`\nUsers table (${allUsers.length} records):`);
    allUsers.forEach(user => {
      console.log(`- ID: ${user.id}, Username: ${user.username}, Email: ${user.email}`);
    });
    
    // Check roles table
    const allRoles = await db.select().from(roles);
    console.log(`\nRoles table (${allRoles.length} records):`);
    allRoles.forEach(role => {
      console.log(`- ID: ${role.id}, Name: ${role.name}, Description: ${role.description}`);
    });
    
    // Check user_roles table
    const allUserRoles = await db.select().from(userRoles);
    console.log(`\nUser Roles table (${allUserRoles.length} records):`);
    allUserRoles.forEach(userRole => {
      console.log(`- User ID: ${userRole.userId}, Role ID: ${userRole.roleId}`);
    });
    
    // Find Celebrity role ID
    const celebrityRole = allRoles.find(role => role.name === 'Celebrity');
    if (celebrityRole) {
      console.log(`\nCelebrity role ID: ${celebrityRole.id}`);
      
      // Find users with Celebrity role
      const usersWithCelebrityRole = allUserRoles.filter(ur => ur.roleId === celebrityRole.id);
      console.log(`Users with Celebrity role (${usersWithCelebrityRole.length}):`);
      usersWithCelebrityRole.forEach(ur => {
        const user = allUsers.find(u => u.id === ur.userId);
        console.log(`- User ID: ${ur.userId}, Username: ${user?.username}, Email: ${user?.email}`);
      });
    } else {
      console.log('\nCelebrity role not found in database');
    }
    
  } catch (error) {
    console.error('Error checking database:', error);
  }
}

// Run the script
checkDatabaseDirectly().catch(console.error);