import { queryOptions } from "@tanstack/react-query";
import { supabase } from "../../supabase/supabaseClient";
import type { ProfileType } from "../../supabase/requiredTypes";

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

export const getAOTC = (profile: ProfileType | null) => {
  return queryOptions({
    queryKey: ["AgentTicketCount"],
    queryFn: () => {
      if (!profile) throw new Error("Invalid Profile");
      return fetchAgentOwnedTicketsCount(profile.id);
    },
    enabled: !!(profile?.role === "agent"),
  });
};
