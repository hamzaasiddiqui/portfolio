import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/public";

export const getProfile = cache(async () => {
  const supabase = createPublicClient();
  const { data, error } = await supabase.from("profile").select("*").single();

  if (error) throw error;
  return data;
});
