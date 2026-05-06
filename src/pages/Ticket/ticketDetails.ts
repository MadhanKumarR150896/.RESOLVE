import { useEffect, useRef } from "react";
import { useParams } from "react-router";
import { supabase } from "../../supabase/supabaseClient";
import type { history, TicketDetails } from "../../supabase/requiredTypes";
import { useQuery } from "@tanstack/react-query";
import { getProfiles } from "./getProfiles";
import { getTicket } from "./getTicket";
import { queryClient } from "../../main";

export const useTicketDetails = () => {
  const { ticketNumber } = useParams();
  const { data: ticketDetails, isLoading: ticketLoading } = useQuery({
    ...getTicket(ticketNumber),
    enabled: !!ticketNumber,
  });
  const { data: profiles = {} } = useQuery(getProfiles());

  const profileRef = useRef(profiles);

  useEffect(() => {
    profileRef.current = profiles;
  }, [profiles]);

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
          queryClient.setQueryData(
            ["ticket", ticketNumber],
            (prev: TicketDetails) => {
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
            }
          );
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

          queryClient.setQueryData(
            ["ticket", ticketNumber],
            (prev: TicketDetails) => {
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
            }
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(ticketChannel);
    };
  }, [ticketDetails?.ticketId, ticketNumber]);

  return { ticketDetails, ticketLoading };
};
