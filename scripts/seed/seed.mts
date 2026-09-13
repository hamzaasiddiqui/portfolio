/**
 * Loads scripts/seed/content.mts into Supabase.
 *
 *   pnpm seed
 *
 * Contract: after this exits 0, the content tables hold exactly what
 * content.mts describes — nothing more. Each table is cleared and rewritten
 * rather than upserted, so deleting a skill from the file deletes it from the
 * site. That's the whole interface; edit copy in content.mts and re-run.
 *
 * Why a script and not a migration: migrations record schema history, and a
 * typo fix in a sentence is not schema history. Running this needs no Docker
 * and no database password — it goes over PostgREST like the app does.
 *
 * Tables this script does NOT own:
 * - `contact_messages` — real submissions, never touched.
 * - `process_steps`    — no approved copy yet; left exactly as found so this
 *                        script can't silently blank a section someone filled
 *                        in. Add a PROCESS_STEPS export to content.mts and a
 *                        line below once the copy exists.
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY: the content tables are public-read but
 * have no public write policy, by design. That key bypasses RLS, so it lives
 * only here and in server-only code — never in anything the browser loads.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database, TablesInsert } from "@/lib/supabase/database.types";
import { PROFILE, SOCIAL_LINKS, SKILLS, EXPERIENCES, EDUCATION, PROJECTS } from "./content.mts";

type ContentTable = "profile" | "social_links" | "skills" | "experiences" | "education" | "projects";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `${name} is not set. Run via \`pnpm seed\`, which loads .env.local.`
    );
  }
  return value;
}

type Db = SupabaseClient<Database>;

async function replace<T extends ContentTable>(
  db: Db,
  table: T,
  rows: TablesInsert<T>[]
): Promise<number> {
  // PostgREST refuses an unfiltered delete, so this is the "match everything"
  // filter: every content table's primary key is non-nullable.
  const { error: clearError } = await db.from(table).delete().not("id", "is", null);
  if (clearError) throw new Error(`clearing ${table}: ${clearError.message}`);

  if (rows.length === 0) return 0;

  // supabase-js can't narrow an insert payload against a generic table name.
  // Every call site below passes TablesInsert<T> for its own T, which is the
  // guarantee the cast is standing in for.
  const { error } = await db.from(table).insert(rows as never);
  if (error) throw new Error(`seeding ${table}: ${error.message}`);

  return rows.length;
}

async function main() {
  const url = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  const db = createClient<Database>(url, requireEnv("SUPABASE_SERVICE_ROLE_KEY"), {
    auth: { persistSession: false },
  });

  // Named before anything is written: this script deletes rows, and the only
  // thing standing between "refreshed the site" and "wiped the wrong project"
  // is which .env.local was loaded.
  console.log(`Seeding ${new URL(url).host}\n`);

  const written: Array<[ContentTable, number]> = [
    ["profile", await replace(db, "profile", [PROFILE])],
    ["social_links", await replace(db, "social_links", SOCIAL_LINKS)],
    ["skills", await replace(db, "skills", SKILLS)],
    ["experiences", await replace(db, "experiences", EXPERIENCES)],
    ["education", await replace(db, "education", EDUCATION)],
    ["projects", await replace(db, "projects", PROJECTS)],
  ];

  for (const [table, count] of written) {
    console.log(`  ${table.padEnd(14)} ${count} row${count === 1 ? "" : "s"}`);
  }
  console.log("\nDone.");
}

main().catch((error: unknown) => {
  console.error(`\nSeed failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
