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
    // Determine SSL settings from env or URL params
    let ssl: boolean | { rejectUnauthorized: boolean } | undefined;
    let sslEnabled = false;
    try {
      const url = new URL(connectionString);
      const urlSslMode = (url.searchParams.get('sslmode') || url.searchParams.get('ssl') || '').toLowerCase();
      const envSslMode = (process.env.PGSSLMODE || '').toLowerCase();
      const envDbSsl = (process.env.DATABASE_SSL || process.env.PGSSL || '').toLowerCase();
      const enableSsl = ['require','verify-full','prefer','allow','true','1'].includes(urlSslMode)
        || ['require','verify-full','prefer','true','1'].includes(envSslMode)
        || ['true','1'].includes(envDbSsl);

      if (enableSsl) {
        const rejectUnauthorizedEnv = (process.env.PGSSLREJECT_UNAUTHORIZED || '').toLowerCase();
        const rejectUnauthorized = rejectUnauthorizedEnv === 'false' ? false : true;
        ssl = { rejectUnauthorized };
        sslEnabled = true;
      }
    } catch {
      // If URL parsing fails, fall back to env-only SSL detection
      const envSslMode = (process.env.PGSSLMODE || '').toLowerCase();
      const envDbSsl = (process.env.DATABASE_SSL || process.env.PGSSL || '').toLowerCase();
      const enableSsl = ['require','verify-full','prefer','true','1'].includes(envSslMode)
        || ['true','1'].includes(envDbSsl);
      if (enableSsl) {
        const rejectUnauthorizedEnv = (process.env.PGSSLREJECT_UNAUTHORIZED || '').toLowerCase();
        const rejectUnauthorized = rejectUnauthorizedEnv === 'false' ? false : true;
        ssl = { rejectUnauthorized };
        sslEnabled = true;
      }
    }

    pool = ssl ? new pg.Pool({ connectionString, ssl }) : new pg.Pool({ connectionString });
    log(`Initializing PostgreSQL pool (DATABASE_URL presence=${!!connectionString}, SSL=${sslEnabled}, NODE_ENV=${process.env.NODE_ENV || 'unset'})`);
  }
  if (!db && pool) {
    db = drizzle(pool);
    log("Drizzle NodePgDatabase initialized");
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
    log("Attempting to verify PostgreSQL connectivity with SELECT 1");
    await pool!.query("SELECT 1");
    log("PostgreSQL connection verified");
    try {
      const versionRes = await pool!.query("SELECT version()");
      const version = versionRes.rows?.[0]?.version;
      log(`PostgreSQL server version: ${version || 'unknown'}`);
    } catch (verErr) {
      console.warn("Warning: failed to fetch PostgreSQL version:", verErr);
    }
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
    console.error(`DATABASE_URL presence=${!!process.env.DATABASE_URL}, NODE_ENV=${process.env.NODE_ENV || 'unset'}`);
    return false;
  }
}
