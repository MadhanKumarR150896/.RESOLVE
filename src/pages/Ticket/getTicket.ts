import { queryOptions } from "@tanstack/react-query";
import type { TicketDetails } from "../../supabase/requiredTypes";
import { supabase } from "../../supabase/supabaseClient";

const fetchTicket = async (ticketNumber: string): Promise<TicketDetails> => {
  const { data, error } = await supabase
    .from("tickets")
    .select(
      ` id,
        ticket_number,
        created_at,
        created_by:profiles!created_by(name),
        status,
        app:apps(name),
        severity,
        description,       
        assigned:profiles!assigned_to(id,name),
        is_locked,
        locked:profiles!locked_by(id,name),
        comments:comments (
          content,
          createdAt:created_at,
          createdBy:profiles!created_by(name),
          is_internal
        )
      `
    )
    .eq("ticket_number", ticketNumber)
    .order("created_at", { referencedTable: "comments", ascending: false })
    .single();

  if (error) throw error;
  if (!data) throw new Error("Ticket not found");

  return {
    ticketId: data.id,
    ticketNumber: data.ticket_number,
    createdAt: new Date(data.created_at).toDateString(),
    createdBy: data.created_by.name,
    status: data.status,
    application: data.app.name,
    severity: data.severity,
    description: data.description,
    assignedTo: data.assigned?.id ?? null,
    assignedName: data.assigned?.name ?? null,
    isLocked: data.is_locked,
    lockedBy: data.locked?.id ?? null,
    lockedName: data.locked?.name ?? null,
    history: data.comments.filter((comment) => !comment.is_internal),
    intHistory: data.comments.filter((comment) => comment.is_internal),
  };
};

export const getTicket = (ticketNumber: string | undefined) => {
  return queryOptions({
    queryKey: ["ticket", ticketNumber],
    queryFn: () => {
      if (!ticketNumber) throw new Error("Invalid Ticket Number");
      return fetchTicket(ticketNumber);
    },
  });
};
