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
  const { error: clearError } = await db.from(table).delete().not("id", "is", null);
  if (clearError) throw new Error(`clearing ${table}: ${clearError.message}`);

  if (rows.length === 0) return 0;

  const { error } = await db.from(table).insert(rows as never);
  if (error) throw new Error(`seeding ${table}: ${error.message}`);

  return rows.length;
}

async function main() {
  const url = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  const db = createClient<Database>(url, requireEnv("SUPABASE_SERVICE_ROLE_KEY"), {
    auth: { persistSession: false },
  });

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
