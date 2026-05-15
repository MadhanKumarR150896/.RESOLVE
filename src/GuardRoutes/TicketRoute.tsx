import { Navigate, Outlet } from "react-router";
import { useTicketDetails } from "../pages/Ticket/ticketDetails";
import { useAuthContext } from "../context/AuthContext";
import { Spinner } from "../utils/ReusableElements";

export const TicketRoute = () => {
  const { ticketDetails, ticketLoading } = useTicketDetails();
  const { profile } = useAuthContext();

  if (ticketLoading) return <Spinner />;

  if (!ticketDetails)
    return <Navigate to={`/dashboard/${profile?.role}`} replace />;

  return <Outlet />;
};
