import dotenv from 'dotenv';
import { initDbFromEnv, verifyDbConnection, db } from '../db';
import { categories, type InsertCategory } from '../../shared/schema';
import { eq } from 'drizzle-orm';

dotenv.config();

const DEFAULT_PRODUCT_CATEGORIES: Omit<InsertCategory, 'id'>[] = [
  { name: 'Apparel', description: 'Clothing and fashion items', imageUrl: '/assets/placeholder-celebrity.jpg' },
  { name: 'Accessories', description: 'Bags, belts, jewelry, and more', imageUrl: '/assets/placeholder-celebrity.jpg' },
  { name: 'Footwear', description: 'Shoes, sneakers, boots, and sandals', imageUrl: '/assets/placeholder-celebrity.jpg' },
  { name: 'Technology', description: 'Phones, gadgets, and electronics', imageUrl: '/assets/placeholder-celebrity.jpg' },
  { name: 'Vehicles', description: 'Cars, bikes, and other vehicles', imageUrl: '/assets/placeholder-celebrity.jpg' },
  { name: 'Fragrance', description: 'Perfumes and colognes', imageUrl: '/assets/placeholder-celebrity.jpg' },
  { name: 'Beauty', description: 'Skincare, makeup, and wellness', imageUrl: '/assets/placeholder-celebrity.jpg' },
];

export async function seedProductCategories() {
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

  let inserted = 0;
  let skipped = 0;

  for (const cat of DEFAULT_PRODUCT_CATEGORIES) {
    try {
      const existing = await db
        .select()
        .from(categories)
        .where(eq(categories.name, cat.name))
        .limit(1);

      if (existing.length > 0) {
        skipped++;
        continue;
      }

      await db.insert(categories).values(cat as InsertCategory);
      inserted++;
      console.log(`✅ Inserted category: ${cat.name}`);
    } catch (err) {
      console.error(`❌ Failed to insert category ${cat.name}:`, err);
    }
  }

  console.log(`🎉 Product categories seeding complete. Inserted=${inserted}, Skipped=${skipped}`);
}

// Allow running standalone from CLI
if (import.meta.url === `file://${process.argv[1]}`) {
  seedProductCategories().catch(err => {
    console.error('❌ Error seeding product categories:', err);
    process.exitCode = 1;
  });
}