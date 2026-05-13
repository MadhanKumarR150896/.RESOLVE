import { queryOptions } from "@tanstack/react-query";
import { supabase } from "../../supabase/supabaseClient";

const fetchTickets = async () => {
  const { data, error } = await supabase
    .from("tickets")
    .select(
      "id,ticket_number,created_at,status,updated_at,app:apps(name),description"
    )
    .order("created_at", { ascending: false });

  if (error) throw error;
  if (!data) throw new Error("Tickets not found");

  return data;
};

export const useGetTickets = () => {
  return queryOptions({
    queryKey: ["tickets"],
    queryFn: fetchTickets,
  });
};
