import { supabase } from "../../supabase/supabaseClient";
import { useCallback } from "react";
import { useToasterStore } from "../../store/toasterStore";

export const useSupabaseAuth = () => {
  const updateToaster = useToasterStore((state) => state.updateToaster);

  const supabaseSignIn = useCallback(
    async (email: string, password: string): Promise<{ success: boolean }> => {
      updateToaster({
        type: "loading",
        message: "Signing in ...",
      });

      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email,
          password: password,
        });

        if (error) {
          if (
            error.status === 500 &&
            error.message.includes("error granting user")
          ) {
            updateToaster({
              type: "error",
              message: "Unauthorized: Account is deactivated",
            });
          } else if (error.status) {
            updateToaster({
              type: "error",
              message: error.message,
            });
          } else {
            updateToaster({
              type: "error",
              message: "Connection error occurred: Please check your network",
            });
          }

          return { success: false };
        }
        if (data.session) return { success: true };

        return { success: false };
      } catch (err) {
        updateToaster({
          type: "error",
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
        type: "error",
        message: error.message,
      });
      return;
    }

    updateToaster({
      type: "success",
      message: "Successfully signed out",
    });
  }, [updateToaster]);

  return { supabaseSignIn, supabaseSignout };
};
