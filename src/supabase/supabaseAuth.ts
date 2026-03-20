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

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      if (error.status === 500) {
        showStatus({
          type: "error",
          message: "Unauthorized: Account is deactivated",
        });
        return { success: false };
      }

      showStatus({
        type: "error",
        message: "Invalid login credentials",
      });
      return { success: false };
    }

    if (data.session) return { success: true };

    return { success: false };
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
