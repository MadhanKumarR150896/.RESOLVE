import { Navigate, Outlet, useParams } from "react-router";
import { useAuthContext } from "../contexts/AuthContext";
import { Spinner } from "../utils/Reusables";
import { useQuery } from "@tanstack/react-query";
import { useFetchTicket } from "../services/ticketService";

export const TicketRoute = () => {
  const { ticketNumber } = useParams();
  const { data: ticketDetails, isLoading: ticketLoading } = useQuery(
    useFetchTicket(ticketNumber)
  );
  const { profile } = useAuthContext();

  if (ticketLoading) return <Spinner />;

  if (!ticketDetails)
    return <Navigate to={`/dashboard/${profile?.role}`} replace />;

  return <Outlet />;
};
