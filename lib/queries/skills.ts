import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/public";

export const getSkills = cache(async () => {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("skills")
    .select("*")
    .order("category", { ascending: true })
    .order("display_order", { ascending: true });

  if (error) throw error;
  return data;
});
