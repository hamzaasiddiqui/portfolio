import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/public";

export const getSocialLinks = cache(async () => {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("social_links")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) throw error;
  return data;
});
