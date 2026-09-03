import { supabase } from "../supabase/supabaseClient";
import { useCallback } from "react";
import { useToasterStore } from "../stores/toasterStore";
import { useQueryClient } from "@tanstack/react-query";
import { useTicketsStore } from "../stores/ticketsStore";

export const useSupabaseAuth = () => {
  const { updateToaster, clearToasters } = useToasterStore((state) => state);
  const queryClient = useQueryClient();
  const { selectAllTicket } = useTicketsStore((state) => state);

  const supabaseSignIn = useCallback(
    async (email: string, password: string): Promise<{ success: boolean }> => {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email,
          password: password,
        });

        if (data.session) return { success: true };

        if (error) {
          if (
            error.status === 500 &&
            error.message.includes("error granting user")
          ) {
            throw new Error("Unauthorized: Account is deactivated");
          } else if (error.status !== undefined) {
            throw new Error(error.message);
          } else {
            throw new Error("Network error: Please check your connection");
          }
        }
        return { success: false };
      } catch (err) {
        updateToaster({
          type: "signinfailed",
          id: crypto.randomUUID(),
          message:
            err instanceof Error ? err.message : "An unexpected error occurred",
        });
        return { success: false };
      }
    },
    [updateToaster]
  );

  const supabaseSignout = useCallback(async () => {
    const { error } = await supabase.auth.signOut({ scope: "local" });

    if (error) {
      updateToaster({
        type: "signoutfailed",
        id: crypto.randomUUID(),
        message: error.message,
      });
      return;
    }

    const failedId = crypto.randomUUID();
    clearToasters(failedId);
    updateToaster({
      type: "signedout",
      id: failedId,
      message: "Successfully signed out",
    });

    selectAllTicket([]);
    queryClient.clear();
  }, [updateToaster, clearToasters, queryClient, selectAllTicket]);

  return { supabaseSignIn, supabaseSignout };
};
