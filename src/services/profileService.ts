import { queryOptions } from "@tanstack/react-query";
import { supabase } from "../supabase/supabaseClient";
import type { ProfileType } from "../supabase/requiredTypes";

const fetchProfile = async (profileId: string): Promise<ProfileType> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("id,name,email,role")
    .eq("id", profileId)
    .single();

  if (error) throw error;
  if (!data) throw new Error("Profile not found");

  return data;
};

export const useFetchProfile = (profileId: string | undefined) => {
  return queryOptions({
    queryKey: ["profile", profileId],
    queryFn: () => {
      if (!profileId) throw new Error("Invalid Profile");
      return fetchProfile(profileId);
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
};

const fetchProfiles = async (): Promise<Record<string, string | null>> => {
  const { data, error } = await supabase.from("profiles").select("id,name");

  if (error) throw error;
  if (!data) throw new Error("Unable to fetch profiles");

  const result = Object.fromEntries(data.map((obj) => [obj.id, obj.name]));
  return result;
};

export const useFetchProfiles = () => {
  return queryOptions({
    queryKey: ["profiles"],
    queryFn: () => fetchProfiles(),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
};

const getAgents = async (): Promise<Record<string, string>> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("id,name")
    .eq("role", "agent");

  if (error) throw error;
  if (!data) throw new Error("Unable to fetch profiles");

  const result = Object.fromEntries(
    data.map((obj) => [obj.name ?? "", obj.id])
  );
  return result;
};

export const useGetAgents = () => {
  return queryOptions({
    queryKey: ["agentsObj"],
    queryFn: () => getAgents(),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
};

const fetchAgents = async (): Promise<Assignees[]> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("id,name")
    .eq("role", "agent");

  if (error) throw error;
  if (!data) throw new Error("Unable to fetch agent profiles");

  return data;
};

export const useFetchAgents = () => {
  return queryOptions({
    queryKey: ["agents"],
    queryFn: () => fetchAgents(),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
};

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

export const useFetchAssignees = (assignee: string) => {
  return queryOptions({
    queryKey: ["assignees", assignee],
    queryFn: () => fetchAssignees(assignee),
  });
};
