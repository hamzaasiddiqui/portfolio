import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/public";

export const getSkills = cache(async () => {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("skills")
    .select("*")
    // Ordered by `display_order` alone, which is global across categories.
    // Sorting by category first would alphabetise the groups — putting
    // "Cloud & AI" ahead of "Languages" — and the intended order isn't
    // alphabetical. Consumers group by category in first-seen order, so this
    // one column decides both the group order and the order within a group.
    .order("display_order", { ascending: true });

  if (error) throw error;
  return data;
});
