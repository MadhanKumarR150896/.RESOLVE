import { createContext, useContext } from "react";
import type { ProfileType } from "../supabase/requiredTypes";
import type { Session } from "@supabase/supabase-js";

export type AuthContextType = {
  session: Session | null;
  profile: ProfileType | null;
  authLoading: boolean;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "Please make sure the component using the AuthContext is wrapped by the provider"
    );
  }

  return context;
};
