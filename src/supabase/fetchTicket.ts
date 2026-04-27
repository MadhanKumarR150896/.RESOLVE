import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import { supabase } from "./supabaseClient";
import type { TicketDetails } from "./requiredTypes";

const fetchTicket = async (ticketNumber: string) => {
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

  if (error || !data) return null;

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

export const useFetchTicket = () => {
  const [ticketDetails, setTicketDetails] = useState<TicketDetails | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  const { ticketNumber } = useParams();

  const fetchTicketDetails = useCallback(async () => {
    if (!ticketNumber) {
      setIsLoading(false);
      return;
    }

    try {
      const data = await fetchTicket(ticketNumber);
      if (!data) {
        setTicketDetails(null);
      } else {
        setTicketDetails(data);
      }
    } catch (err) {
      console.log(err);
      setTicketDetails(null);
    } finally {
      setIsLoading(false);
    }
  }, [ticketNumber]);

  useEffect(() => {
    fetchTicketDetails();
  }, [fetchTicketDetails]);

  return { ticketDetails, isLoading, fetchTicketDetails };
};
