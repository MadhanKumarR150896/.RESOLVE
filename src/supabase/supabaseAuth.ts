import { supabase } from "./supabaseClient";
import { useAuthContext } from "../context/AuthContext";

export const useSupabaseAuth = () => {
  const { setAuthStatus, showStatus } = useAuthContext();

  const supabaseSignIn = async (
    email: string,
    password: string,
  ): Promise<{ success: boolean }> => {
    setAuthStatus({
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
          showStatus({
            type: "error",
            message: "Unauthorized: Account is deactivated",
          });
        } else if (error.status) {
          showStatus({
            type: "error",
            message: error.message,
          });
        } else {
          showStatus({
            type: "error",
            message: "Connection error occurred: Please check your network",
          });
        }

        return { success: false };
      }
      if (data.session) return { success: true };

      return { success: false };
    } catch (err) {
      showStatus({
        type: "error",
        message:
          err instanceof Error ? err.message : "An unexpected error occurred",
      });
      return { success: false };
    }
  };

  const supabaseSignout = async () => {
    const { error } = await supabase.auth.signOut({ scope: "local" });

    if (error) {
      showStatus({
        type: "error",
        message: "Sign out failed",
      });
      return;
    }

    showStatus({
      type: "success",
      message: "Successfully signed out",
    });
  };

  return { supabaseSignIn, supabaseSignout };
};
