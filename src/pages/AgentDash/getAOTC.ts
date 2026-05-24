import { queryOptions } from "@tanstack/react-query";
import { supabase } from "../../supabase/supabaseClient";

const fetchAgentOwnedTicketsCount = async (profileId: string) => {
  const { count, error } = await supabase
    .from("tickets")
    .select("*", { count: "exact", head: true })
    .eq("assigned_to", profileId);

  if (error) throw error;
  if (!count)
    throw new Error("Unable to get count of tickets assigned to this agent");

  return count;
};

export const getAOTC = (profileId: string | undefined) => {
  return queryOptions({
    queryKey: ["AgentTicketCount", profileId],
    queryFn: () => {
      if (!profileId) throw new Error("Invalid Profile");
      return fetchAgentOwnedTicketsCount(profileId);
    },
    enabled: !!profileId,
  });
};
