import { createPublicClient } from "@/lib/supabase/public";

export const dynamic = "force-dynamic";

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
