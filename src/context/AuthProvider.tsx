import { useEffect, useMemo, useState, type ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import { supabase } from "../supabase/supabaseClient";
import type { Session } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "./getProfile";

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setAuthLoading(false);
    };

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setAuthLoading(false);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const { data: profile, isLoading: profileLoading } = useQuery({
    ...getProfile(session?.user.id),
    enabled: !!session?.user.id,
  });

  const value = useMemo(
    () => ({
      session,
      profile: profile ?? null,
      authLoading: authLoading || profileLoading,
    }),
    [session, authLoading, profile, profileLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
