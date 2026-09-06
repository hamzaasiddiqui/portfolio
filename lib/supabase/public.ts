import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

// Plain (cookie-free) client for public content reads. Unlike the
// `@supabase/ssr` server client, this never touches `next/headers`
// `cookies()` — which is a request-time API that would otherwise force
// every page that reads content into dynamic rendering. Content tables are
// public-read via RLS and carry no per-user state, so there's nothing a
// cookie-aware client would buy here; using it kept `/` off the static +
// ISR path the rendering strategy depends on.
export function createPublicClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
