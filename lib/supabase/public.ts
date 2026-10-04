import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import { publicSupabaseEnv } from "./env";

export function createPublicClient() {
  const { url, anonKey } = publicSupabaseEnv();
  return createSupabaseClient<Database>(url, anonKey);
}
