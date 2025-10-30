const { Pool } = require('pg');

async function runMigration() {
  const pool = new Pool({ 
    connectionString: process.env.DATABASE_URL 
  });
  
  try {
    await pool.query('ALTER TABLE "celebrities" ADD COLUMN IF NOT EXISTS "brands_worn" text;');
    console.log('Migration applied successfully: added celebrities.brands_worn');
  } catch (err) {
    console.error('Migration failed:', err.message);
  } finally {
    await pool.end();
  }
}

runMigration();