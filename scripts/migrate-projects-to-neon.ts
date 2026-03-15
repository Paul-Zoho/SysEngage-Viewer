#!/usr/bin/env npx tsx
/**
 * One-time migration: Replit Postgres `projects` → Neon `n_projects`
 * 
 * This script copies all project rows (metadata + JSONB ledger blobs) from the
 * legacy Replit PostgreSQL database into the Neon `n_projects` table.
 * It is idempotent: existing project_ids in Neon are skipped.
 *
 * Prerequisites:
 *   - DATABASE_URL env var pointing to Replit Postgres (source)
 *   - NEON_DATABASE_URL env var pointing to Neon Postgres (target)
 *   - `n_projects` table must already exist in Neon (via drizzle-kit push)
 *
 * Usage:
 *   npx tsx scripts/migrate-projects-to-neon.ts
 *
 * This script was run on 2026-03-15 to migrate all 5 projects successfully.
 * It is kept in the repo for documentation and potential re-use.
 */

import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import { nProjects } from "../shared/neonSchema";

const OLD_URL = process.env.DATABASE_URL;
const NEON_URL = process.env.NEON_DATABASE_URL;

if (!OLD_URL) {
  console.error("DATABASE_URL not set (source Replit Postgres)");
  process.exit(1);
}
if (!NEON_URL) {
  console.error("NEON_DATABASE_URL not set (target Neon Postgres)");
  process.exit(1);
}

interface LegacyProjectRow {
  project_id: string;
  name: string;
  description: string | null;
  created_utc: string;
  ledger: Record<string, unknown> | null;
  is_active: boolean;
}

async function migrate() {
  const oldPool = new Pool({ connectionString: OLD_URL });
  const neonPool = new Pool({ connectionString: NEON_URL, ssl: { rejectUnauthorized: false } });
  const neonDb = drizzle(neonPool);

  try {
    const { rows: oldProjects } = await oldPool.query<LegacyProjectRow>(
      "SELECT project_id, name, description, created_utc, ledger, is_active FROM projects"
    );
    console.log(`Found ${oldProjects.length} projects in Replit Postgres`);

    let migrated = 0;
    let skipped = 0;

    for (const p of oldProjects) {
      const existing = await neonDb
        .select({ projectId: nProjects.projectId })
        .from(nProjects)
        .where(eq(nProjects.projectId, p.project_id))
        .limit(1);

      if (existing.length > 0) {
        console.log(`  Skipping ${p.project_id} (${p.name}) — already exists in Neon`);
        skipped++;
        continue;
      }

      await neonDb.insert(nProjects).values({
        projectId: p.project_id,
        name: p.name,
        description: p.description,
        createdUtc: p.created_utc,
        ledger: p.ledger as unknown as Record<string, unknown> | null,
        isActive: p.is_active,
      });
      console.log(`  Migrated ${p.project_id} (${p.name}) — active=${p.is_active}`);
      migrated++;
    }

    console.log(`\nMigration complete: ${migrated} migrated, ${skipped} skipped (already exist)`);
  } finally {
    await oldPool.end();
    await neonPool.end();
  }
}

migrate().catch(e => {
  console.error("Migration failed:", e instanceof Error ? e.message : String(e));
  process.exit(1);
});
