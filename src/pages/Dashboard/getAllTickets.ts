import { infiniteQueryOptions } from "@tanstack/react-query";
import type { FullTicket, ProfileType } from "../../supabase/requiredTypes";
import { supabase } from "../../supabase/supabaseClient";

export type BulkTickets = {
  typedData: FullTicket[];
  cursor: string | null;
};

const fetchAllTickets = async ({
  pageParam,
}: {
  pageParam: string;
}): Promise<BulkTickets> => {
  const { data, error } = await supabase
    .from("tickets")
    .select(
      `id,ticket_number,created_at,created_by:profiles!created_by(name),status,severity,updated_at,updated_by:profiles!updated_by(name),app:apps(name),description,assigned:profiles!assigned_to(id,name)`
    )
    .order("created_at", { ascending: false })
    .lt("ticket_number", pageParam)
    .limit(20);

  if (error) throw error;
  if (!data) throw new Error("Tickets not found");

  const lastTicket = data.length > 0 ? data[data.length - 1] : null;
  const cursor = lastTicket ? lastTicket.ticket_number : null;
  const typedData = data.map((ticket) => ({
    id: ticket.id,
    ticket_number: ticket.ticket_number,
    created_at: ticket.created_at,
    status: ticket.status,
    severity: ticket.severity,
    updated_at: ticket.updated_at,
    description: ticket.description,
    app: ticket.app.name,
    created_by: ticket.created_by.name,
    updated_by: ticket.updated_by.name,
    assigned_to: ticket.assigned?.id ?? null,
    assigned_name: ticket.assigned?.name ?? null,
  }));

  return { typedData, cursor };
};

export const getAllTickets = (profile: ProfileType | null) => {
  return infiniteQueryOptions({
    queryKey: ["allTickets"],
    queryFn: ({ pageParam }) => {
      if (!profile) throw new Error("Invalid Profile");
      return fetchAllTickets({ pageParam });
    },
    initialPageParam: Number.MAX_SAFE_INTEGER.toString(),
    getNextPageParam: (lastPage) => lastPage.cursor,
  });
};
