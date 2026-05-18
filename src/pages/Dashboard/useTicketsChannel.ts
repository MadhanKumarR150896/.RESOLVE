import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "../../supabase/supabaseClient";

export const useTicketsChannel = () => {
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
          queryClient.invalidateQueries({ queryKey: ["tickets"] });
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
          queryClient.invalidateQueries({ queryKey: ["tickets"] });
        }
      )
      .subscribe();

    return () => {
      dashChannel.unsubscribe();
    };
  }, [queryClient]);
};
