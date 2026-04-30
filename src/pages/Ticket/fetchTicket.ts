import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { supabase } from "../../supabase/supabaseClient";
import type { history, TicketDetails } from "../../supabase/requiredTypes";
import { useGetProfiles } from "./getProfiles";

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
  const { profiles } = useGetProfiles();

  const profileRef = useRef(profiles);

  useEffect(() => {
    profileRef.current = profiles;
  }, [profiles]);

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

  useEffect(() => {
    const ticketId = ticketDetails?.ticketId;

    const ticketChannel = supabase
      .channel(`ticket-update`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "tickets",
          filter: `id=eq.${ticketId}`,
        },
        (payload) => {
          setTicketDetails((prev) => {
            if (!prev) return prev;

            return {
              ...prev,
              status: payload.new.status,
              severity: payload.new.severity,
              isLocked: payload.new.is_locked,
              lockedBy: payload.new.locked_by,
              lockedName: profileRef.current[payload.new.locked_by],
              assignedTo: payload.new.assigned_to,
              assignedName: profileRef.current[payload.new.assigned_to],
            };
          });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "comments",
          filter: `ticket_id=eq.${ticketId}`,
        },
        (payload) => {
          const formatted: history = {
            content: payload.new.content,
            createdAt: payload.new.created_at,
            createdBy: { name: profileRef.current[payload.new.created_by] },
            is_internal: payload.new.is_internal,
          };

          setTicketDetails((prev) => {
            if (!prev) return prev;

            return formatted.is_internal
              ? {
                  ...prev,
                  intHistory: [formatted, ...prev.intHistory],
                }
              : {
                  ...prev,
                  history: [formatted, ...prev.history],
                };
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(ticketChannel);
    };
  }, [ticketDetails?.ticketId]);

  return { ticketDetails, isLoading };
};
