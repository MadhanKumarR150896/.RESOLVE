import { queryOptions } from "@tanstack/react-query";
import { supabase } from "../../supabase/supabaseClient";

const profiles = async (): Promise<Record<string, string | null>> => {
  const { data, error } = await supabase.from("profiles").select("id,name");

  if (error) throw error;
  if (!data) throw new Error("Couldn't fetch apps");

  const result = Object.fromEntries(data.map((obj) => [obj.id, obj.name]));
  return result;
};

export const getProfiles = () => {
  return queryOptions({
    queryKey: ["profiles"],
    queryFn: () => profiles(),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
};
