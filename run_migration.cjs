const { Pool } = require('pg');
const fs = require('fs');

async function runMigration() {
  // Manually read and parse .env file to avoid dotenv issues
  const envContent = fs.readFileSync('.env', 'utf8');
  const lines = envContent.split(/\r?\n/);
  
  let connectionString = '';
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('DATABASE_URL=') && !trimmed.startsWith('#')) {
      // Extract the value after DATABASE_URL=
      connectionString = trimmed.substring('DATABASE_URL='.length);
      // Remove surrounding quotes
      connectionString = connectionString.replace(/^["'](.*)["']$/, '$1');
      break;
    }
  }
  
  if (!connectionString) {
    console.error('❌ DATABASE_URL not found in .env file');
    process.exit(1);
  }
  
  console.log('Using connection string:', connectionString.substring(0, 50) + '...');
  
  const pool = new Pool({ 
    connectionString
  });
  
  try {
    console.log('🔄 Running migration...');
    const sql = fs.readFileSync('migrations/0005_add_celebrity_vibes_events.sql', 'utf8');
    await pool.query(sql);
    console.log('✅ Migration 0005_add_celebrity_vibes_events.sql completed successfully');
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigration();
