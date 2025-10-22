import dotenv from 'dotenv';
import { storage, setUseDbStorage } from './storage.js';
import { initDbFromEnv, verifyDbConnection } from './db.js';

// Load environment variables first
dotenv.config();

async function createMissingCelebrityProfiles() {
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
  console.log('Creating missing celebrity profiles for approved users...');
  
  // Get all users
  const users = await storage.getUsers();
  console.log(`Found ${users.length} total users`);
  
  // Get all celebrities
  const celebrities = await storage.getCelebrities();
  console.log(`Found ${celebrities.length} existing celebrities`);
  
  // Find users with Celebrity role
  const celebrityUsers = users.filter(user => 
    user.roles && user.roles.some(role => role.name === 'Celebrity')
  );
  console.log(`Found ${celebrityUsers.length} users with Celebrity role:`, 
    celebrityUsers.map(u => `${u.id}: ${u.username}`));
  
  // Find users who have Celebrity role but no celebrity profile
  const usersWithoutProfiles = celebrityUsers.filter(user => 
    !celebrities.some(celebrity => celebrity.userId === user.id)
  );
  
  console.log(`Found ${usersWithoutProfiles.length} users needing celebrity profiles:`, 
    usersWithoutProfiles.map(u => `${u.id}: ${u.username}`));
  
  // Create celebrity profiles for these users
  for (const user of usersWithoutProfiles) {
    try {
      console.log(`Creating celebrity profile for user ${user.id}: ${user.username}`);
      
      const celebrityData = {
        name: user.displayName || user.username || `${user.firstName} ${user.lastName}`.trim() || 'Celebrity',
        profession: 'Celebrity', // Default profession
        imageUrl: user.profilePicture || '/placeholder-celebrity.jpg',
        description: `Celebrity profile for ${user.displayName || user.username}`,
        category: 'Entertainment', // Default category
        userId: user.id,
        isActive: true,
        isElite: false,
        managerInfo: {
          name: 'Celebrity Management',
          agency: 'CeleCart Management',
          email: 'management@celecart.com',
          phone: '+1-555-0123',
          bookingInquiries: 'For booking inquiries and collaborations.'
        },
        stylingDetails: [
          {
            occasion: 'Professional Events',
            outfit: {
              designer: 'Various Designers',
              price: 'Contact for pricing',
              details: 'Professional styling for events and appearances',
              purchaseLink: '#'
            },
            image: '/placeholder-celebrity.jpg'
          }
        ]
      };
      
      const newCelebrity = await storage.createCelebrity(celebrityData);
      console.log(`✅ Created celebrity profile with ID ${newCelebrity.id} for user ${user.username}`);
      
    } catch (error) {
      console.error(`❌ Failed to create celebrity profile for user ${user.username}:`, error);
    }
  }
  
  console.log('Finished creating missing celebrity profiles');
  
  // Verify the results
  const updatedCelebrities = await storage.getCelebrities();
  const celebritiesWithUserId = updatedCelebrities.filter(c => c.userId);
  console.log(`\nVerification: Found ${celebritiesWithUserId.length} celebrities with userId:`, 
    celebritiesWithUserId.map(c => `${c.id}: ${c.name} (userId: ${c.userId})`));
}

// Run the script
createMissingCelebrityProfiles().catch(console.error);