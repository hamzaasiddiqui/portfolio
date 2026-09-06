import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/public";

export const getProcessSteps = cache(async () => {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("process_steps")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) throw error;
  return data;
});
