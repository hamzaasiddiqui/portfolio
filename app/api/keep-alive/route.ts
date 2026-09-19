import { createPublicClient } from "@/lib/supabase/public";

// Never prerender or cache: the whole point is that each hit reaches Supabase.
export const dynamic = "force-dynamic";

/**
 * Keeps the free-tier Supabase project awake.
 *
 * Supabase pauses Free Plan projects after seven days without API activity,
 * and a static, ISR-cached portfolio with no visitors generates none — the
 * page only re-queries when someone triggers a revalidation. Vercel Cron
 * (vercel.json) calls this once a day and it performs the cheapest possible
 * read, which is all "activity" means.
 *
 * Vercel sends `Authorization: Bearer $CRON_SECRET` with every cron request
 * once that env var exists on the project. When it is set, nothing else may
 * trigger the route; when it isn't (local dev), the check is skipped — the
 * route is read-only and public content anyway.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const supabase = createPublicClient();
  const { error } = await supabase.from("profile").select("id").limit(1);

  if (error) {
    return Response.json({ ok: false, error: error.message }, { status: 502 });
  }
  return Response.json({ ok: true, pinged_at: new Date().toISOString() });
}
