import dotenv from 'dotenv';
import { initDbFromEnv, verifyDbConnection, db } from '../db';
import { brands, type InsertBrand } from '../../shared/schema';

dotenv.config();

export async function seedBrands() {
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

  const existing = await db.select().from(brands).limit(1);
  if (existing.length > 0) {
    console.log('⏭️  Brands table already has data, skipping seed');
    return;
  }

  const rows: InsertBrand[] = [
    {
      name: 'Ray-Ban',
      description: 'Iconic eyewear brand known for Aviator and Wayfarer.',
      imageUrl: 'https://cdn.celecart.example/images/brands/rayban.png',
      celebWearers: ['TS', 'EM', 'LM']
    },
    {
      name: 'Nike',
      description: 'Global sportswear leader with performance and lifestyle lines.',
      imageUrl: 'https://cdn.celecart.example/images/brands/nike.png',
      celebWearers: ['LM']
    },
    {
      name: 'Gucci',
      description: 'Luxury fashion house celebrated for bold designs.',
      imageUrl: 'https://cdn.celecart.example/images/brands/gucci.png',
      celebWearers: ['TS', 'EM']
    }
  ];

  await db.insert(brands).values(rows);
  console.log('✅ Seeded brands (3 records)');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedBrands().catch(err => {
    console.error('❌ Error seeding brands:', err);
    process.exitCode = 1;
  });
}