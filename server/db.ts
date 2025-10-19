import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import pg from "pg";
import type { Pool } from "pg";
import { log } from "./vite";

// Lazily initialized DB handles so dotenv can load before we read env
export let pool: Pool | undefined;
export let db: NodePgDatabase | undefined;

export function initDbFromEnv(): boolean {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    return false;
  }
  if (!pool) {
    pool = new pg.Pool({ connectionString });
  }
  if (!db && pool) {
    db = drizzle(pool);
  }
  return !!db;
}

export async function verifyDbConnection(): Promise<boolean> {
  // Ensure initialized from env first
  if (!db || !pool) {
    const initialized = initDbFromEnv();
    if (!initialized) {
      log("DATABASE_URL not set. Using in-memory storage.");
      return false;
    }
  }
  try {
    await pool!.query("SELECT 1");
    log("PostgreSQL connection verified");
    return true;
  } catch (err) {
    console.error("Failed to connect to PostgreSQL:", err);
    return false;
  }
}