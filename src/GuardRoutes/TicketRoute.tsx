import { Navigate, Outlet, useParams } from "react-router";
import { useAuthContext } from "../context/AuthContext";
import { Spinner } from "../utils/ReusableElements";
import { useQuery } from "@tanstack/react-query";
import { useGetTicket } from "../pages/Ticket/getTicket";

export const TicketRoute = () => {
  const { ticketNumber } = useParams();
  const { data: ticketDetails, isLoading: ticketLoading } = useQuery(
    useGetTicket(ticketNumber)
  );
  const { profile } = useAuthContext();

  if (ticketLoading) return <Spinner />;

  if (!ticketDetails)
    return <Navigate to={`/dashboard/${profile?.role}`} replace />;

  return <Outlet />;
};
