import { Navigate, Outlet } from "react-router";
import { useTicketDetails } from "../pages/Ticket/ticketDetails";
import { Spinner } from "../utils/Spinner";
import { useAuthContext } from "../context/AuthContext";

export const TicketRoute = () => {
  const { ticketDetails, ticketLoading } = useTicketDetails();
  const { profile } = useAuthContext();

  if (ticketLoading) return <Spinner />;

  if (!ticketDetails)
    return <Navigate to={`/dashboard/${profile?.role}`} replace />;

  return <Outlet />;
};
