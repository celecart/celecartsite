import dotenv from 'dotenv';
import { initDbFromEnv, db } from '../db';
import { brands, type InsertBrand } from '../../shared/schema';
import { mockBrands } from '../../shared/data';

async function main() {
  dotenv.config();

  const ok = initDbFromEnv();
  if (!ok || !db) {
    console.error('DATABASE_URL not set or DB init failed.');
    process.exit(1);
  }

  // Fetch existing brands to avoid duplicates by name
  const existing = await db.select().from(brands);
  const existingByName = new Set((existing || []).map(b => (b.name || '').toLowerCase()));

  let inserted = 0;
  let skipped = 0;

  for (const b of mockBrands) {
    const nameKey = (b.name || '').trim().toLowerCase();
    if (!nameKey) {
      skipped++;
      continue;
    }
    if (existingByName.has(nameKey)) {
      skipped++;
      continue;
    }

    const values: InsertBrand = {
      name: b.name,
      description: (b as any).description ?? undefined,
      imageUrl: b.imageUrl || '/assets/placeholder-celebrity.jpg',
      websiteUrl: (b as any).websiteUrl ?? undefined,
      origins: (b as any).origins ?? [],
      categoryIds: (b as any).categoryIds ?? [],
      sourceType: (b as any).sourceType ?? undefined,
      celebWearers: b.celebWearers ?? [],
    };

    await db.insert(brands).values(values);
    inserted++;
  }

  console.log(`Seeded brands complete: inserted=${inserted}, skipped=${skipped}, total=${mockBrands.length}`);
}

main().catch(err => {
  console.error('Failed to seed brands:', err);
  process.exit(1);
});