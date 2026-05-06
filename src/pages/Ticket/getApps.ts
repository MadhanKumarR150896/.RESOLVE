import { queryOptions } from "@tanstack/react-query";
import type { AppType } from "../../supabase/requiredTypes";
import { supabase } from "../../supabase/supabaseClient";

const fetchApps = async (): Promise<AppType[]> => {
  const { data, error } = await supabase
    .from("apps")
    .select("id,name")
    .order("name", { ascending: true });

  if (error) throw error;
  if (!data) throw new Error("Unable to fetch apps");

  return data;
};

export const getApps = () => {
  return queryOptions({
    queryKey: ["apps"],
    queryFn: () => fetchApps(),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
};
