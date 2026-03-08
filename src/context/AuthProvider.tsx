import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AuthContext } from "./AuthContext";
import { supabase } from "../supabase/supabaseClient";
import type { Session } from "@supabase/supabase-js";

type AuthProviderProps = {
  children: ReactNode;
};

type StatusType = "initial" | "loading" | "error" | "signedin" | "signedout";

export type AuthStatus = {
  type: StatusType;
  message: string;
};

type RoleType = "user" | "agent";

export type Profile = {
  id: string;
  name: string;
  email: string;
  role: RoleType;
  image: string;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authStatus, setAuthStatus] = useState<AuthStatus>({
    type: "initial",
    message: "",
  });

  const timeoutTracker = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showStatus = useCallback((status: AuthStatus) => {
    setAuthStatus(status);

    if (timeoutTracker.current) {
      clearTimeout(timeoutTracker.current);
    }

    timeoutTracker.current = setTimeout(() => {
      setAuthStatus({
        type: "initial",
        message: "",
      });
    }, 5000);
  }, []);

  const fetchProfile = async (profileId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select(`id,name:full_name,email,role,image:avatar_url`)
      .eq("id", profileId)
      .single<Profile>();
    if (!error && data) {
      setProfile({
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
        image: data.image,
      });
    }
  };

  useEffect(() => {
    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);

      if (data.session) {
        await fetchProfile(data.session.user.id);
      } else {
        setProfile(null);
      }

      setAuthLoading(false);
    };

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);

      if (session) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value = useMemo(
    () => ({
      authStatus,
      setAuthStatus,
      session,
      profile,
      authLoading,
      showStatus,
    }),
    [authStatus, setAuthStatus, session, profile, authLoading, showStatus],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
