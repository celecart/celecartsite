import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import pg from "pg";
import type { Pool } from "pg";
import { log } from "./vite";

export let pool: Pool | undefined;
export let db: NodePgDatabase | undefined;

export function initDbFromEnv(): boolean {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) return false;
  if (!pool) {
    pool = new pg.Pool({ connectionString });
  }
  if (!db && pool) {
    db = drizzle(pool);
  }
  return !!db;
}

export async function verifyDbConnection(): Promise<boolean> {
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
    const requiredTables = ["users", "user_roles"];
    const missing: string[] = [];
    for (const tbl of requiredTables) {
      const { rows } = await pool!.query(`SELECT to_regclass('public.${tbl}') AS exists`);
      const exists = rows?.[0]?.exists;
      if (!exists) missing.push(tbl);
    }
    if (missing.length > 0) {
      log(`DB connected but missing tables: ${missing.join(', ')}. Falling back to in-memory storage.`);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Failed to connect to PostgreSQL:", err);
    return false;
  }
}
