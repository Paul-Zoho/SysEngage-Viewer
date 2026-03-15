import pg from "pg";

function canonicalCellId(row: string, col: string): string {
  return `ZC-R${row}-C-${col}`;
}

const V23_PATTERN = /^ZC-R[1-6]-C-(What|How|Where|Who|When|Why)$/;
const NUM_TO_COL: Record<string, string> = { "1": "What", "2": "How", "3": "Where", "4": "Who", "5": "When", "6": "Why" };

function deriveCanonicalId(oldId: string, dbRow: string, dbCol: string): string {
  const m0 = oldId.match(/^ZC[-_]ROW(\d)[-_](WHAT|HOW|WHERE|WHO|WHEN|WHY)$/i);
  if (m0) {
    const col = m0[2].charAt(0).toUpperCase() + m0[2].slice(1).toLowerCase();
    return canonicalCellId(m0[1], col);
  }
  const m1 = oldId.match(/^ZC[-_]R(?:OW)?(\d)[-_]C[-_]?(What|How|Where|Who|When|Why)$/i);
  if (m1) return canonicalCellId(m1[1], m1[2].charAt(0).toUpperCase() + m1[2].slice(1).toLowerCase());
  const m2 = oldId.match(/^ZC[-_]R(?:OW)?(\d)[-_]C(\d)$/i);
  if (m2 && NUM_TO_COL[m2[2]]) return canonicalCellId(m2[1], NUM_TO_COL[m2[2]]);
  const colTitleCase = dbCol.charAt(0).toUpperCase() + dbCol.slice(1).toLowerCase();
  return canonicalCellId(dbRow, colTitleCase);
}

export async function migrateZachmanCellIds() {
  const client = new pg.Client(process.env.NEON_DATABASE_URL);
  await client.connect();

  try {
    const existing = await client.query("SELECT DISTINCT cell_id, row, col FROM n_zachman_cells");
    const toMigrate = existing.rows.filter((r: any) => !V23_PATTERN.test(r.cell_id));

    if (toMigrate.length === 0) {
      console.log("[v2.3 migration] All cell_ids already canonical. Nothing to do.");
      return;
    }

    await client.query("BEGIN");

    for (const { cell_id: oldId, row, col } of toMigrate) {
      const newId = deriveCanonicalId(oldId, row, col);

      await client.query("UPDATE n_zachman_cells SET cell_id = $1 WHERE cell_id = $2", [newId, oldId]);
      await client.query("UPDATE n_coverage_items SET target_ref = $1 WHERE target_ref = $2 AND coverage_type = 'Cell'", [newId, oldId]);
      await client.query("UPDATE n_cell_relationships SET from_ci = $1 WHERE from_ci = $2", [newId, oldId]);
      await client.query("UPDATE n_cell_relationships SET to_ci = $1 WHERE to_ci = $2", [newId, oldId]);
      await client.query("UPDATE n_cell_content_items SET cell_id = $1 WHERE cell_id = $2", [newId, oldId]);

      console.log(`[v2.3 migration] ${oldId} -> ${newId}`);
    }

    await client.query("COMMIT");
    console.log("[v2.3 migration] Committed successfully");

    const verify = await client.query("SELECT DISTINCT cell_id FROM n_zachman_cells ORDER BY cell_id");
    console.log("[v2.3 migration] Verified zachman cell_ids:", verify.rows.map((r: any) => r.cell_id));

    const verifyCCI = await client.query("SELECT DISTINCT cell_id FROM n_cell_content_items ORDER BY cell_id");
    console.log("[v2.3 migration] Verified content item cell_ids:", verifyCCI.rows.map((r: any) => r.cell_id));
  } catch (error: any) {
    console.error("[v2.3 migration] ERROR:", error.message);
    try { await client.query("ROLLBACK"); } catch (e) {}
    throw error;
  } finally {
    await client.end();
  }
}

if (require.main === module) {
  migrateZachmanCellIds().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
