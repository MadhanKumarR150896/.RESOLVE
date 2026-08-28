import { Navigate, Outlet, useParams } from "react-router";
import { useAuthContext } from "../contexts/AuthContext";
import { Spinner } from "../utils/Reusables";

type RouterProps = {
  allowedRoles: ("user" | "agent")[];
};

export const ProtectedRoute = ({ allowedRoles }: RouterProps) => {
  const { session, profile, authLoading } = useAuthContext();
  const { role } = useParams<{ role: "user" | "agent" }>();

  if (authLoading) return <Spinner />;

  if (!session) return <Navigate to="/signin" replace />;

  if (!profile) return <Spinner />;

  if (!allowedRoles.includes(profile.role))
    return <Navigate to="/signin" replace />;

  if (role !== profile.role)
    return <Navigate to={`/dashboard/${profile.role}`} replace />;

  return <Outlet />;
};
