import { queryOptions } from "@tanstack/react-query";
import { supabase } from "../../supabase/supabaseClient";

const fetchProfiles = async (): Promise<Record<string, string | null>> => {
  const { data, error } = await supabase.from("profiles").select("id,name");

  if (error) throw error;
  if (!data) throw new Error("Unable to fetch profiles");

  const result = Object.fromEntries(data.map((obj) => [obj.id, obj.name]));
  return result;
};

export const getProfiles = () => {
  return queryOptions({
    queryKey: ["profiles"],
    queryFn: () => fetchProfiles(),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
};
