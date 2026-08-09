import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "../supabase/supabaseClient";

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
        () => {
          queryClient.invalidateQueries({ queryKey: ["allTickets"] });
        }
      )
      .subscribe();

    return () => {
      dashChannel.unsubscribe();
    };
  }, [queryClient]);
};
