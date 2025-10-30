import dotenv from 'dotenv';
import { initDbFromEnv, verifyDbConnection, db } from '../db';
import { celebrityProducts, celebrities, type InsertCelebrityProduct } from '../../shared/schema';
import { eq } from 'drizzle-orm';
import fs from 'fs/promises';
import path from 'path';

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

  // Ensure local product images exist in uploads/products and return served URL
  const ensureImage = async (sourceCandidates: string[], destFile: string): Promise<string> => {
    const uploadsDir = path.join(process.cwd(), 'uploads');
    const productsDir = path.join(uploadsDir, 'products');
    await fs.mkdir(productsDir, { recursive: true });

    const destPath = path.join(productsDir, destFile);
    try {
      // If already exists, just return URL
      await fs.access(destPath);
    } catch {
      // Try to copy from the first existing candidate
      let copied = false;
      for (const candidate of sourceCandidates) {
        const abs = path.isAbsolute(candidate) ? candidate : path.join(process.cwd(), candidate);
        try {
          await fs.access(abs);
          await fs.copyFile(abs, destPath);
          copied = true;
          break;
        } catch {
          // continue
        }
      }
      if (!copied) {
        // Fallback to placeholder SVG if available
        const placeholder = path.join(process.cwd(), 'public', 'assets', 'product-placeholder.svg');
        try {
          await fs.access(placeholder);
          await fs.copyFile(placeholder, destPath);
        } catch {
          // As last resort, create an empty file to avoid crash
          await fs.writeFile(destPath, Buffer.from(''));
        }
      }
    }
    // Return served URL (Express serves /uploads from the uploads folder)
    return `/uploads/products/${destFile}`;
  };

  // Find celebrities by name to link products
  const [emma] = await db.select().from(celebrities).where(eq(celebrities.name, 'Emma Stone')).limit(1);
  const [messi] = await db.select().from(celebrities).where(eq(celebrities.name, 'Lionel Messi')).limit(1);
  const [taylor] = await db.select().from(celebrities).where(eq(celebrities.name, 'Taylor Swift')).limit(1);

  if (!emma || !messi || !taylor) {
    console.log('⚠️  Required celebrities not found. Ensure celebrities seeder ran first.');
    return;
  }

  // Prepare product images (copy local assets into uploads/products)
  const emmaImageUrl = await ensureImage([
    'test-upload.jpg',
    path.join('public', 'assets', 'product-placeholder.svg')
  ], 'emma-oscars-gown.jpg');

  const messiImageUrl = await ensureImage([
    'temp_urus.jpg',
    'test-upload.jpg'
  ], 'messi-sneakers.jpg');

  const taylorImageUrl = await ensureImage([
    'generated-icon.png',
    'test-upload.jpg'
  ], 'taylor-bodysuit.png');

  const rows: InsertCelebrityProduct[] = [
    {
      celebrityId: emma.id,
      name: 'Oscars Gown',
      description: 'Louis Vuitton embellished corset gown as seen at Oscars.',
      category: 'Fashion',
      imageUrl: emmaImageUrl,
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
      imageUrl: messiImageUrl,
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
      imageUrl: taylorImageUrl,
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