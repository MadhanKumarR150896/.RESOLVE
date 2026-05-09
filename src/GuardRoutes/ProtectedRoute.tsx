import { Navigate, Outlet } from "react-router";
import { useAuthContext } from "../context/AuthContext";
import { Spinner } from "../utils/Spinner";

type RouterProps = {
  allowedRoles: ("user" | "agent")[];
};

export const ProtectedRoute = ({ allowedRoles }: RouterProps) => {
  const { session, profile, authLoading } = useAuthContext();

  if (authLoading) return <Spinner />;

  if (!session) return <Navigate to="/signin" replace />;

  if (!profile) return <Spinner />;

  if (!allowedRoles.includes(profile.role))
    return <Navigate to="/signin" replace />;

  return <Outlet />;
};
