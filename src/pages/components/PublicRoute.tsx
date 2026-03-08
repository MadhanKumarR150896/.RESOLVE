import { Navigate, Outlet } from "react-router";
import { useAuthContext } from "../../context/AuthContext";
import { Spinner } from "./Spinner";

export const PublicRoute = () => {
  const { session, profile, authLoading } = useAuthContext();

  if (authLoading) return <Spinner />;

  if (session && profile?.role === "user") {
    return <Navigate to="/dashboard/user" replace />;
  }

  if (session && profile?.role === "agent") {
    return <Navigate to="/dashboard/agent" replace />;
  }

  return <Outlet />;
};
