const { Pool } = require('pg');

async function runMigration() {
  const pool = new Pool({ 
    connectionString: process.env.DATABASE_URL 
  });
  
  try {
    await pool.query('ALTER TABLE "celebrities" ADD COLUMN "user_id" integer;');
    console.log('Migration applied successfully');
  } catch (err) {
    console.error('Migration failed:', err.message);
  } finally {
    await pool.end();
  }
}

runMigration();