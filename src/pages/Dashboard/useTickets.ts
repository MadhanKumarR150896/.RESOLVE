import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "../../context/AuthContext";
import { useGetTickets } from "./getTickets";
import { useEffect } from "react";
import { supabase } from "../../supabase/supabaseClient";

export const useTickets = () => {
  const { profile } = useAuthContext();
  const queryClient = useQueryClient();
  const { data: tickets = [], isLoading: ticketsLoading } = useQuery({
    ...useGetTickets(),
    enabled: !!profile,
  });

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
          queryClient.invalidateQueries({ queryKey: ["tickets"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(dashChannel);
    };
  }, [queryClient]);

  return { tickets, ticketsLoading };
};
