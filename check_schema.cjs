const { Pool } = require('pg');

async function checkSchema() {
  const pool = new Pool({ 
    connectionString: process.env.DATABASE_URL 
  });
  
  try {
    const result = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'celebrities';");
    console.log('Celebrities table columns:', result.rows.map(r => r.column_name));
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await pool.end();
  }
}

checkSchema();