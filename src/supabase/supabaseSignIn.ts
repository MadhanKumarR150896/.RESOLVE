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
      showStatus({
        type: "error",
        message: "Invalid login credentials",
      });
      return { success: false };
    }

    if (data.session) return { success: true };

    return { success: false };
  };

  return { supabaseSignIn };
};
