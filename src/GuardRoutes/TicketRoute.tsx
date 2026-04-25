import { Navigate, Outlet } from "react-router";
import { useFetchTicket } from "../supabase/fetchTicket";
import { Spinner } from "../utils/Spinner";
import { useAuthContext } from "../context/AuthContext";

export const TicketRoute = () => {
  const { ticketDetails, isLoading } = useFetchTicket();
  const { profile } = useAuthContext();

  if (isLoading) return <Spinner />;

  if (!ticketDetails)
    return <Navigate to={`/dashboard/${profile?.role}`} replace />;

  return <Outlet />;
};
