import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { supabase } from "./supabaseClient";
import type { TicketDetails } from "./requiredTypes";

const fetchTicket = async (ticketNumber: string) => {
  const { data, error } = await supabase
    .from("tickets")
    .select(
      `id,
        ticket_number,
        created_at,
        created_by:profiles!created_by(name),
        status,
        app:apps (
          name
        ),
        severity,
        description,
        assigned_to:profiles!assigned_to(id),
        assigned_name:profiles!assigned_to(name),
        is_locked,
        locked_by:profiles!locked_by(id),
        locked_name:profiles!locked_by(name),
        allHistory:comments (
          content,
          createdAt:created_at,
          createdBy:profiles!created_by(name),
          isInternal:is_internal
        )
        `
    )
    .eq("ticket_number", ticketNumber)
    .order("created_at", { referencedTable: "comments", ascending: false })
    .single();

  if (!error && data)
    return {
      ticketId: data.id,
      ticketNumber: data.ticket_number,
      createdAt: new Date(data.created_at).toDateString(),
      createdBy: data.created_by.name,
      status: data.status,
      application: data.app.name,
      severity: data.severity,
      description: data.description,
      assignedTo: data.assigned_to ? data.assigned_to.id : null,
      assignedName: data.assigned_name ? data.assigned_name.name : null,
      isLocked: data.is_locked,
      lockedBy: data.locked_by ? data.locked_by.id : null,
      lockedName: data.locked_name ? data.locked_name.name : null,
      history: data.allHistory.filter((history) => !history.isInternal),
      intHistory: data.allHistory.filter((history) => history.isInternal),
    };
};

export const useFetchTicket = () => {
  const [ticketDetails, setTicketDetails] = useState<TicketDetails | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  const { ticketNumber } = useParams();

  useEffect(() => {
    if (!ticketNumber) return;

    const fetchTicketDetails = async () => {
      try {
        const data = await fetchTicket(ticketNumber);
        if (data) {
          setTicketDetails(data);
        } else {
          setTicketDetails(null);
        }

        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setTicketDetails(null);
        setIsLoading(false);
      }
    };

    fetchTicketDetails();
  }, [ticketNumber]);

  return { ticketDetails, isLoading };
};
