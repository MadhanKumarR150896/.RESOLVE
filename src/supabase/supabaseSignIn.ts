import { useState } from "react";
import { supabase } from "./supabaseClient";

const wait = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export type StatusType = "initial" | "loading" | "error" | "success";

export type AuthStatus = {
  type: StatusType;
  message: string;
};

export const useSupabaseAuth = () => {
  const [authStatus, setAuthStatus] = useState<AuthStatus>({
    type: "initial",
    message: "Yet to send sign in request",
  });

  const supabaseSignIn = async (
    email: string,
    password: string,
  ): Promise<{ success: boolean }> => {
    setAuthStatus({
      type: "loading",
      message: "Signing in ...",
    });
    await wait(500);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      setAuthStatus({
        type: "error",
        message: "Invalid login credentials",
      });
      return { success: false };
    }

    if (data) {
      setAuthStatus({
        type: "success",
        message: "Successfully signed in",
      });
      return { success: true };
    }
    return { success: false };
  };

  return { supabaseSignIn, authStatus };
};
