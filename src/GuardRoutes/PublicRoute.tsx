import { Navigate, Outlet } from "react-router";
import { useAuthContext } from "../contexts/AuthContext";
import { Spinner } from "../utils/Reusables";

export const PublicRoute = () => {
  const { session, profile, authLoading } = useAuthContext();

  if (authLoading) return <Spinner />;

  if (session && profile) {
    return <Navigate to={`/dashboard/${profile.role}`} replace />;
  }

  return <Outlet />;
};
