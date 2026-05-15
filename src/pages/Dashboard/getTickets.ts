import { infiniteQueryOptions } from "@tanstack/react-query";
import { supabase } from "../../supabase/supabaseClient";
import type { TicketThumbnail } from "../../supabase/requiredTypes";

const fetchTickets = async ({
  pageParam,
}: {
  pageParam: string;
}): Promise<{ data: TicketThumbnail[]; cursor: string | null }> => {
  const { data, error } = await supabase
    .from("tickets")
    .select(
      "id,ticket_number,created_at,status,updated_at,app:apps(name),description"
    )
    .order("created_at", { ascending: false })
    .lt("ticket_number", pageParam)
    .limit(24);

  if (error) throw error;
  if (!data) throw new Error("Tickets not found");

  const lastTicket = data.length > 0 ? data[data.length - 1] : null;
  const cursor = lastTicket ? lastTicket.ticket_number : null;

  return { data, cursor };
};

export const useGetTickets = () => {
  return infiniteQueryOptions({
    queryKey: ["tickets"],
    queryFn: ({ pageParam }) => fetchTickets({ pageParam }),
    initialPageParam: Number.MAX_SAFE_INTEGER.toString(),
    getNextPageParam: (lastPage) => lastPage.cursor,
  });
};
