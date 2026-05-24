import { queryOptions } from "@tanstack/react-query";
import { supabase } from "../../supabase/supabaseClient";
import type { Metrics, ProfileType } from "../../supabase/requiredTypes";

const fetchMetrics = async (): Promise<Metrics> => {
  const { data, error } = await supabase.rpc("get_metrics");

  if (error) throw error;
  if (!data) throw new Error("Unable to get counts");

  return data;
};

export const getMetrics = (profile: ProfileType | null) => {
  return queryOptions({
    queryKey: ["ticketMetrics"],
    queryFn: () => {
      if (!profile) throw new Error("Invalid Profile");
      return fetchMetrics();
    },
    enabled: !!profile,
  });
};
