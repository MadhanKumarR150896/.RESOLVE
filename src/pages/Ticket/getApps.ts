import { useEffect, useState } from "react";
import type { AppType } from "../../supabase/requiredTypes";
import { supabase } from "../../supabase/supabaseClient";

const getApps = async () => {
  const { data, error } = await supabase
    .from("apps")
    .select("id,name")
    .order("name", { ascending: true });

  if (error) throw error;
  return data;
};

export const useGetApps = () => {
  const [apps, setApps] = useState<AppType[] | null>(null);

  useEffect(() => {
    getApps()
      .then((data) => {
        if (!data || data.length === 0) {
          setApps(null);
        } else {
          setApps(data);
        }
      })
      .catch(() => setApps(null));
  }, []);

  return { apps };
};
