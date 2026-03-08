import { createContext, useContext } from "react";
import type { AuthStatus, Profile } from "./AuthProvider";
import type { Session } from "@supabase/supabase-js";

type AuthContextType = {
  authStatus: AuthStatus;
  setAuthStatus: React.Dispatch<React.SetStateAction<AuthStatus>>;
  session: Session | null;
  profile: Profile | null;
  authLoading: boolean;
  showStatus: (authStatus: AuthStatus) => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "Please make sure the component using the context is wrapped by the provider",
    );
  }

  return context;
};
