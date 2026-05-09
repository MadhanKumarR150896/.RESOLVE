import { useEffect, useState } from "react";
import { supabase } from "../../supabase/supabaseClient";
import { queryOptions } from "@tanstack/react-query";

type Assignees = {
  id: string;
  name: string | null;
};

export const useDebouncedAssignee = (assignee: string, delay: number) => {
  const [debouncedAssignee, setDebouncedAssignee] = useState("");

  useEffect(() => {
    if (assignee.length < 3) return;
    const timeout = setTimeout(() => setDebouncedAssignee(assignee), delay);
    return () => clearTimeout(timeout);
  }, [assignee, delay]);

  return debouncedAssignee;
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
