import { useState, type ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import type { AuthStatus } from "../supabase/supabaseSignIn";

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authStatus, setAuthStatus] = useState<AuthStatus>({
    type: "initial",
    message: "Yet to send sign in request",
  });
  return (
    <AuthContext.Provider value={{ authStatus, setAuthStatus }}>
      {children}
    </AuthContext.Provider>
  );
};
