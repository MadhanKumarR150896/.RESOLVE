import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "../supabase/supabaseClient";
import type { Metrics } from "../supabase/requiredTypes";

export const useDashboardChannel = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const dashChannel = supabase
      .channel("tickets-channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "tickets",
        },
        () => {
          queryClient.setQueryData(["ticketMetrics"], (prev: Metrics) => {
            if (!prev) return prev;

            return {
              ...prev,
              openCount: prev.openCount ? prev.openCount + 1 : null,
            };
          });
          queryClient.invalidateQueries({ queryKey: ["allTickets"] });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "tickets",
        },
        (payload) => {
          const openToActive =
            payload.old.status === "open" && payload.new.status === "active";

          if (openToActive) {
            queryClient.setQueryData(["ticketMetrics"], (prev: Metrics) => {
              if (!prev) return prev;

              return {
                ...prev,
                openCount: prev.openCount ? prev.openCount - 1 : null,
                activeCount: prev.activeCount ? prev.activeCount + 1 : null,
              };
            });
          }

          const activeToAny =
            payload.old.status === "active" &&
            (payload.new.status === "deferred" ||
              payload.new.status === "resolved");

          if (activeToAny) {
            queryClient.setQueryData(["ticketMetrics"], (prev: Metrics) => {
              if (!prev) return prev;

              return {
                ...prev,
                activeCount: prev.activeCount ? prev.activeCount - 1 : null,
              };
            });
          }

          const anyToActive =
            (payload.old.status === "deferred" ||
              payload.old.status === "resolved") &&
            payload.new.status === "active";

          if (anyToActive) {
            queryClient.setQueryData(["ticketMetrics"], (prev: Metrics) => {
              if (!prev) return prev;

              return {
                ...prev,
                activeCount: prev.activeCount ? prev.activeCount + 1 : null,
              };
            });
          }

          const ownedStatus =
            payload.old.assigned_to !== payload.new.assigned_to;

          if (ownedStatus) {
            queryClient.invalidateQueries({ queryKey: ["AgentTicketCount"] });
          }

          queryClient.invalidateQueries({ queryKey: ["allTickets"] });
        }
      )
      .subscribe();

    return () => {
      dashChannel.unsubscribe();
    };
  }, [queryClient]);
};
