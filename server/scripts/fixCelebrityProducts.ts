import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('❌ DATABASE_URL not set');
    process.exit(1);
  }
  const pool = new pg.Pool({ connectionString });
  try {
    await pool.query('SELECT 1');
    console.log('✅ Connected to PostgreSQL');
    // Ensure table exists
    const { rows } = await pool.query(`SELECT to_regclass('public.celebrity_products') AS exists`);
    const exists = !!rows?.[0]?.exists;
    if (!exists) {
      console.log('📦 Creating celebrity_products table');
      await pool.query(`
        CREATE TABLE IF NOT EXISTS "celebrity_products" (
          "id" serial PRIMARY KEY NOT NULL,
          "celebrity_id" integer NOT NULL,
          "name" text NOT NULL,
          "description" text,
          "category" text NOT NULL,
          "product_category" text,
          "image_url" text NOT NULL,
          "price" text,
          "location" text,
          "website" text,
          "purchase_link" text,
          "rating" integer,
          "is_active" boolean DEFAULT true NOT NULL,
          "is_featured" boolean DEFAULT false NOT NULL,
          "created_at" text DEFAULT 'now()' NOT NULL,
          "updated_at" text DEFAULT 'now()' NOT NULL,
          "metadata" jsonb
        )
      `);
    } else {
      // Ensure missing columns
      const { rows: colRows } = await pool.query(
        `SELECT column_name FROM information_schema.columns WHERE table_schema='public' AND table_name='celebrity_products'`
      );
      const cols = new Set<string>(colRows.map((r: any) => r.column_name));
      if (!cols.has('product_category')) {
        console.log('🛠️  Adding column product_category');
        await pool.query(`ALTER TABLE "celebrity_products" ADD COLUMN IF NOT EXISTS "product_category" text`);
      }
      if (!cols.has('metadata')) {
        console.log('🛠️  Adding column metadata');
        await pool.query(`ALTER TABLE "celebrity_products" ADD COLUMN IF NOT EXISTS "metadata" jsonb`);
      }
    }
    console.log('✅ celebrity_products schema ensured');
  } catch (err) {
    console.error('❌ Error ensuring celebrity_products schema:', err);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

main();