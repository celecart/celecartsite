import dotenv from 'dotenv';
import { initDbFromEnv, verifyDbConnection, db } from '../db';
import { categories, type InsertCategory } from '../../shared/schema';

dotenv.config();

export async function seedCategories() {
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

  const existing = await db.select().from(categories).limit(1);
  if (existing.length > 0) {
    console.log('⏭️  Categories table already has data, skipping seed');
    return;
  }

  const rows: InsertCategory[] = [
    {
      name: 'Red Carpet',
      description: 'Luxurious evening looks worn to premieres and awards.',
      imageUrl: 'https://cdn.celecart.example/images/categories/red-carpet.jpg'
    },
    {
      name: 'Street Style',
      description: 'Casual, everyday outfits seen off-duty.',
      imageUrl: 'https://cdn.celecart.example/images/categories/street-style.jpg'
    },
    {
      name: 'Concert',
      description: 'Performance looks and stage outfits.',
      imageUrl: 'https://cdn.celecart.example/images/categories/concert.jpg'
    }
  ];

  await db.insert(categories).values(rows);
  console.log('✅ Seeded categories (3 records)');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedCategories().catch(err => {
    console.error('❌ Error seeding categories:', err);
    process.exitCode = 1;
  });
}