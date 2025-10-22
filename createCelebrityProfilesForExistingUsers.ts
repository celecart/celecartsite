import dotenv from 'dotenv';
import { initDbFromEnv, db } from './server/db';
import { users, roles, userRoles, celebrities } from './drizzle/schema';
import { eq, and } from 'drizzle-orm';

// Load environment variables first
dotenv.config();

async function createCelebrityProfilesForExistingUsers() {
  const dbInitialized = initDbFromEnv();
  if (!dbInitialized || !db) {
    console.log('Database not initialized');
    return;
  }
  
  console.log('Creating celebrity profiles for existing users with Celebrity role...');
  
  try {
    // Get Celebrity role ID
    const celebrityRole = await db.select().from(roles).where(eq(roles.name, 'Celebrity')).limit(1);
    if (celebrityRole.length === 0) {
      console.log('Celebrity role not found');
      return;
    }
    
    const celebrityRoleId = celebrityRole[0].id;
    console.log(`Celebrity role ID: ${celebrityRoleId}`);
    
    // Get users with Celebrity role
    const usersWithCelebrityRole = await db
      .select({
        userId: users.id,
        username: users.username,
        email: users.email,
        displayName: users.displayName,
        firstName: users.firstName,
        lastName: users.lastName,
        profilePicture: users.profilePicture
      })
      .from(users)
      .innerJoin(userRoles, eq(users.id, userRoles.userId))
      .where(eq(userRoles.roleId, celebrityRoleId));
    
    console.log(`Found ${usersWithCelebrityRole.length} existing users with Celebrity role:`);
    usersWithCelebrityRole.forEach(user => {
      console.log(`- ID: ${user.userId}, Username: ${user.username}, Email: ${user.email}`);
    });
    
    // Check existing celebrities
    const existingCelebrities = await db.select().from(celebrities);
    console.log(`Found ${existingCelebrities.length} existing celebrities`);
    
    // Find users who need celebrity profiles
    const usersNeedingProfiles = usersWithCelebrityRole.filter(user => 
      !existingCelebrities.some(celebrity => celebrity.userId === user.userId)
    );
    
    console.log(`Found ${usersNeedingProfiles.length} users needing celebrity profiles:`);
    
    // Create celebrity profiles
    for (const user of usersNeedingProfiles) {
      try {
        console.log(`Creating celebrity profile for user ${user.userId}: ${user.username}`);
        
        const celebrityName = user.displayName || 
                             (user.firstName && user.lastName ? `${user.firstName} ${user.lastName}`.trim() : '') ||
                             user.username || 
                             'Celebrity';
        
        const newCelebrity = {
          name: celebrityName,
          profession: 'Celebrity',
          imageUrl: user.profilePicture || '/placeholder-celebrity.jpg',
          description: `Celebrity profile for ${celebrityName}`,
          category: 'Entertainment',
          userId: user.userId,
          isActive: true,
          isElite: false,
          managerInfo: JSON.stringify({
            name: 'Celebrity Management',
            agency: 'CeleCart Management',
            email: 'management@celecart.com',
            phone: '+1-555-0123',
            bookingInquiries: 'For booking inquiries and collaborations.'
          }),
          stylingDetails: JSON.stringify([
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
          ])
        };
        
        const result = await db.insert(celebrities).values(newCelebrity).returning();
        console.log(`✅ Created celebrity profile with ID ${result[0].id} for user ${user.username}`);
        
      } catch (error) {
        console.error(`❌ Failed to create celebrity profile for user ${user.username}:`, error);
      }
    }
    
    console.log('Finished creating celebrity profiles');
    
    // Verify the results
    const updatedCelebrities = await db.select().from(celebrities);
    const celebritiesWithUserId = updatedCelebrities.filter(c => c.userId);
    console.log(`\nVerification: Found ${celebritiesWithUserId.length} celebrities with userId:`);
    celebritiesWithUserId.forEach(celebrity => {
      console.log(`- Celebrity ID: ${celebrity.id}, Name: ${celebrity.name}, User ID: ${celebrity.userId}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the script
createCelebrityProfilesForExistingUsers().catch(console.error);