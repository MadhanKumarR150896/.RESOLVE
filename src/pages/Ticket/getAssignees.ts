import { supabase } from "../../supabase/supabaseClient";
import { queryOptions } from "@tanstack/react-query";

type Assignees = {
  id: string;
  name: string | null;
};

const fetchAssignees = async (assignee: string): Promise<Assignees[]> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("id,name")
    .eq("is_active", true)
    .eq("role", "agent")
    .ilike("name", `%${assignee}%`);
  if (error) throw error;
  if (!data) throw new Error("Unable to fetch assignees");

  return data;
};

export const getAssignees = (assignee: string) => {
  return queryOptions({
    queryKey: ["assignees", assignee],
    queryFn: () => fetchAssignees(assignee),
  });
};
