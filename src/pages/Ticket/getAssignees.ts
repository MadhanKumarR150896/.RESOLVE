import { useEffect, useState } from "react";
import { supabase } from "../../supabase/supabaseClient";

type Assignees = {
  id: string;
  name: string | null;
};

export const useGetAssignees = (assignee: string, isAssigned: boolean) => {
  const [assignees, setAssignees] = useState<Assignees[]>([]);

  useEffect(() => {
    if (isAssigned) return;

    let isStale = false;

    const timeout = setTimeout(async () => {
      if (assignee.length < 3) {
        setAssignees([]);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("id,name")
        .eq("is_active", true)
        .ilike("name", `%${assignee}%`);

      if (!isStale && !error && data) setAssignees(data);
    }, 400);

    return () => {
      clearTimeout(timeout);
      isStale = true;
    };
  }, [assignee, isAssigned]);

  return { assignees, setAssignees };
};
