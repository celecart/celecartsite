import dotenv from 'dotenv';
import { initDbFromEnv, verifyDbConnection, db } from '../db';
import { celebrityProducts, celebrities, type InsertCelebrityProduct } from '../../shared/schema';
import { eq } from 'drizzle-orm';

dotenv.config();

export async function seedCelebrityProducts() {
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

  const existing = await db.select().from(celebrityProducts).limit(1);
  if (existing.length > 0) {
    console.log('⏭️  Celebrity products table already has data, skipping seed');
    return;
  }

  // Find celebrities by name to link products
  const [emma] = await db.select().from(celebrities).where(eq(celebrities.name, 'Emma Stone')).limit(1);
  const [messi] = await db.select().from(celebrities).where(eq(celebrities.name, 'Lionel Messi')).limit(1);
  const [taylor] = await db.select().from(celebrities).where(eq(celebrities.name, 'Taylor Swift')).limit(1);

  if (!emma || !messi || !taylor) {
    console.log('⚠️  Required celebrities not found. Ensure celebrities seeder ran first.');
    return;
  }

  const rows: InsertCelebrityProduct[] = [
    {
      celebrityId: emma.id,
      name: 'Oscars Gown',
      description: 'Louis Vuitton embellished corset gown as seen at Oscars.',
      category: 'Fashion',
      imageUrl: 'https://cdn.celecart.example/images/products/emma-oscars-gown.jpg',
      price: '$4500',
      website: 'https://example.com/emma-gown',
      purchaseLink: 'https://example.com/buy/emma-gown',
      rating: 5,
      isActive: true,
      isFeatured: true,
      location: null,
      createdAt: 'now()',
      updatedAt: 'now()',
      metadata: {
        specialties: ['Hand-crafted', 'Corset'],
        tags: ['red-carpet', 'luxury']
      }
    },
    {
      celebrityId: messi.id,
      name: 'Signature Sneakers',
      description: 'Lifestyle sneakers worn off the pitch.',
      category: 'Footwear',
      imageUrl: 'https://cdn.celecart.example/images/products/messi-sneakers.jpg',
      price: '$220',
      website: 'https://example.com/messi-sneakers',
      purchaseLink: 'https://example.com/buy/messi-sneakers',
      rating: 4,
      isActive: true,
      isFeatured: false,
      location: 'Barcelona',
      createdAt: 'now()',
      updatedAt: 'now()',
      metadata: {
        tags: ['street-style']
      }
    },
    {
      celebrityId: taylor.id,
      name: 'Tour Bodysuit',
      description: 'Sequined bodysuit worn during the Eras Tour.',
      category: 'Fashion',
      imageUrl: 'https://cdn.celecart.example/images/products/ts-bodysuit.jpg',
      price: '$5200',
      website: 'https://example.com/ts-bodysuit',
      purchaseLink: 'https://example.com/buy/ts-bodysuit',
      rating: 5,
      isActive: true,
      isFeatured: true,
      location: null,
      createdAt: 'now()',
      updatedAt: 'now()',
      metadata: {
        tags: ['concert', 'versace']
      }
    }
  ];

  await db.insert(celebrityProducts).values(rows);
  console.log('✅ Seeded celebrity products (3 records)');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedCelebrityProducts().catch(err => {
    console.error('❌ Error seeding celebrity products:', err);
    process.exitCode = 1;
  });
}