export function publicSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    const missing = [
      !url && "NEXT_PUBLIC_SUPABASE_URL",
      !anonKey && "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    ]
      .filter(Boolean)
      .join(", ");
    throw new Error(
      `Missing environment variable(s): ${missing}. Locally they live in .env.local (see .env.example); ` +
        "on Vercel add them under Project Settings → Environment Variables for the Production " +
        "environment, then redeploy — the page is prerendered at build time, so they must exist " +
        "when the build runs."
    );
  }

  return { url, anonKey };
}
