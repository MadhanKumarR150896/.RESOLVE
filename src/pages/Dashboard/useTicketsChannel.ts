import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "../../supabase/supabaseClient";
import { useAuthContext } from "../../context/AuthContext";

export const useTicketsChannel = () => {
  const queryClient = useQueryClient();
  const { profile } = useAuthContext();
  const ProfileRole = profile?.role ?? null;

  useEffect(() => {
    if (!ProfileRole) return;
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
          if (ProfileRole === "user")
            queryClient.invalidateQueries({ queryKey: ["userTickets"] });

          if (ProfileRole === "agent")
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
          if (ProfileRole === "user") {
            queryClient.invalidateQueries({ queryKey: ["userTickets"] });
          }
          if (ProfileRole === "agent")
            queryClient.invalidateQueries({ queryKey: ["allTickets"] });
        }
      )
      .subscribe();

    return () => {
      dashChannel.unsubscribe();
    };
  }, [queryClient, ProfileRole]);
};
