import dotenv from 'dotenv';
import { initDbFromEnv, verifyDbConnection, db } from './server/db';
import { celebrities } from './drizzle/schema';

// Load environment variables
dotenv.config();

async function verifyDatabaseCelebrities() {
  try {
    // Initialize database connection
    await initDbFromEnv();
    const dbConnected = await verifyDbConnection();
    
    if (!dbConnected) {
      console.log('❌ Database connection failed');
      return;
    }
    
    console.log('✅ Database connected successfully');
    
    // Query all celebrities from database
    const allCelebrities = await db.select().from(celebrities);
    console.log(`\n📊 Total celebrities in database: ${allCelebrities.length}`);
    
    // Show celebrities with userId
    const celebritiesWithUserId = allCelebrities.filter(c => c.userId !== null);
    console.log(`👤 Celebrities with userId: ${celebritiesWithUserId.length}`);
    
    if (celebritiesWithUserId.length > 0) {
      console.log('\n🎭 Celebrities with userId:');
      celebritiesWithUserId.forEach(celebrity => {
        console.log(`  - ID: ${celebrity.id}, Name: ${celebrity.name}, UserId: ${celebrity.userId}`);
      });
    }
    
    // Show all celebrities for comparison
    console.log('\n📋 All celebrities in database:');
    allCelebrities.forEach(celebrity => {
      console.log(`  - ID: ${celebrity.id}, Name: ${celebrity.name}, UserId: ${celebrity.userId || 'null'}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

verifyDatabaseCelebrities();