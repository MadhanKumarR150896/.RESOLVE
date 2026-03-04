import { createContext, useContext } from "react";
import type { AuthStatus } from "../supabase/supabaseSignIn";

type AuthContextType = {
  authStatus: AuthStatus;
  setAuthStatus: React.Dispatch<React.SetStateAction<AuthStatus>>;
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
