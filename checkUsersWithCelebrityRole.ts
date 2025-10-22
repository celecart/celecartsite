import dotenv from 'dotenv';
import { storage, setUseDbStorage } from './server/storage';
import { initDbFromEnv, verifyDbConnection } from './server/db';

// Load environment variables first
dotenv.config();

async function checkUsersWithCelebrityRole() {
  // Initialize database storage
  const dbInitialized = initDbFromEnv();
  if (dbInitialized) {
    const dbConnected = await verifyDbConnection();
    if (dbConnected) {
      setUseDbStorage(true);
      console.log('Using database storage');
    } else {
      console.log('Database connection failed, using memory storage');
    }
  } else {
    console.log('DATABASE_URL not set, using memory storage');
  }
  
  console.log('Checking users with Celebrity role...');
  
  // Get all users
  const users = await storage.getUsers();
  console.log(`Found ${users.length} total users`);
  
  // Find users with Celebrity role
  const celebrityUsers = users.filter(user => 
    user.roles && user.roles.some(role => role.name === 'Celebrity')
  );
  
  console.log(`Found ${celebrityUsers.length} users with Celebrity role:`);
  celebrityUsers.forEach(user => {
    console.log(`- ID: ${user.id}, Username: ${user.username}, Email: ${user.email}`);
    console.log(`  Roles: ${user.roles?.map(r => r.name).join(', ')}`);
  });
  
  // Get all celebrities
  const celebrities = await storage.getCelebrities();
  console.log(`\nFound ${celebrities.length} existing celebrities`);
  
  // Check which celebrity users have profiles
  const celebritiesWithUserId = celebrities.filter(c => c.userId);
  console.log(`Found ${celebritiesWithUserId.length} celebrities with userId:`);
  celebritiesWithUserId.forEach(celebrity => {
    console.log(`- Celebrity ID: ${celebrity.id}, Name: ${celebrity.name}, User ID: ${celebrity.userId}`);
  });
  
  // Find users who have Celebrity role but no celebrity profile
  const usersWithoutProfiles = celebrityUsers.filter(user => 
    !celebrities.some(celebrity => celebrity.userId === user.id)
  );
  
  console.log(`\nFound ${usersWithoutProfiles.length} users needing celebrity profiles:`);
  usersWithoutProfiles.forEach(user => {
    console.log(`- ID: ${user.id}, Username: ${user.username}, Email: ${user.email}`);
  });
}

// Run the script
checkUsersWithCelebrityRole().catch(console.error);