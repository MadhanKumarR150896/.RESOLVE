import { useEffect, useState } from "react";
import { supabase } from "../../supabase/supabaseClient";

const getProfiles = async () => {
  const { data, error } = await supabase.from("profiles").select("id,name");

  if (error) return null;

  const result = Object.fromEntries(data.map((obj) => [obj.id, obj.name]));
  return result;
};

export const useGetProfiles = () => {
  const [profiles, setProfiles] = useState<Record<string, string | null>>({});

  useEffect(() => {
    getProfiles().then((data) => {
      if (!data) {
        setProfiles({});
      } else {
        setProfiles(data);
      }
    });
  }, []);

  return { profiles };
};
