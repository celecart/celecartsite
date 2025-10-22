import { db, initDbFromEnv, verifyDbConnection } from './server/db';
import { celebrityProducts } from './shared/schema';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function checkProducts() {
  try {
    console.log('Initializing database connection...');
    const initialized = initDbFromEnv();
    if (!initialized) {
      console.log('Database not initialized - DATABASE_URL not set');
      return;
    }
    
    const connected = await verifyDbConnection();
    if (!connected) {
      console.log('Database connection failed');
      return;
    }
    
    console.log('Checking celebrity products...');
    const products = await db!.select().from(celebrityProducts);
    console.log('Found products:', products.length);
    console.log('Products:', products);
    
    if (products.length === 0) {
      console.log('No products found in database. This explains why the UI shows no products.');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}

checkProducts();