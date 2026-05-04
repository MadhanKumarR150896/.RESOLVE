import { queryOptions } from "@tanstack/react-query";
import { supabase } from "../supabase/supabaseClient";
import type { ProfileType } from "../supabase/requiredTypes";

const profile = async (profileId: string): Promise<ProfileType> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("id,name,email,role")
    .eq("id", profileId)
    .single();

  if (error) throw error;
  if (!data) throw new Error("Profile not found");

  return data;
};

export const fetchProfile = (profileId: string | undefined) => {
  return queryOptions({
    queryKey: ["profile", profileId],
    queryFn: () => {
      if (!profileId) throw new Error("Invalid ProfileId");
      return profile(profileId);
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
};
