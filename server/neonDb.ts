import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as neonSchema from "../shared/neonSchema";

let neonDb: ReturnType<typeof drizzle> | null = null;
let neonPool: Pool | null = null;

export function getNeonDb() {
  if (neonDb) return neonDb;

  const url = process.env.NEON_DATABASE_URL;
  if (!url) return null;

  try {
    neonPool = new Pool({ connectionString: url, ssl: { rejectUnauthorized: false }, max: 5 });
    neonDb = drizzle(neonPool, { schema: neonSchema });
    return neonDb;
  } catch {
    console.error("[Neon] Failed to create connection pool");
    return null;
  }
}

export async function testNeonConnection(): Promise<boolean> {
  const url = process.env.NEON_DATABASE_URL;
  if (!url) return false;

  try {
    const pool = new Pool({ connectionString: url, ssl: { rejectUnauthorized: false }, max: 1 });
    const result = await pool.query("SELECT 1 as ok");
    await pool.end();
    return result.rows[0]?.ok === 1;
  } catch (e: any) {
    console.error("[Neon] Connection test failed:", e.message);
    return false;
  }
}

export { neonSchema };
