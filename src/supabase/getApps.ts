import { useEffect, useState } from "react";
import type { AppType } from "./requiredTypes";
import { supabase } from "./supabaseClient";

export const useGetApps = () => {
  const [Apps, setApps] = useState<AppType[] | null>(null);

  useEffect(() => {
    const getApps = async () => {
      const { data, error } = await supabase
        .from("apps")
        .select("id,name")
        .order("name", { ascending: true });

      if (error) return;
      setApps(data);
    };

    getApps();
  }, []);

  return { Apps };
};
