import { Outlet, useParams } from "react-router";
import { Header } from "./Header";
import { useEffect, useState } from "react";
import { supabase } from "../../supabase/supabaseClient";
import { type TicketDetails } from "../../supabase/requiredTypes";

export const PageLayout = () => {
  const params = useParams();
  const [ticketDetails, setTicketDetails] = useState<TicketDetails | null>(
    null
  );

  const fetchTicketDetails = async (ticketNumber: string) => {
    const { data, error } = await supabase
      .from("tickets")
      .select(
        `ticketNumber:ticket_number,
        createdAt:created_at,
        createdBy:profiles!created_by(name),
        status,
        application:apps (
          name
        ),
        severity,
        description,
        assignedTo:profiles!assigned_to(name),
        isLocked:is_locked,
        lockedBy:profiles!locked_by(name),
        allHistory:comments (
          content,
          createdAt:created_at,
          createdBy:profiles!created_by(name),
          isInternal:is_internal
        )
        `
      )
      .eq("ticket_number", ticketNumber)
      .single();

    if (!error && data) {
      setTicketDetails(data);
    }
  };

  useEffect(() => {
    const checkMode = async () => {
      if (params.ticketNumber) {
        await fetchTicketDetails(params.ticketNumber);
      } else {
        setTicketDetails(null);
      }
    };
    checkMode();
  }, [params.ticketNumber]);

  return (
    <div className="base gap-2 p-2 min-w-230">
      <Header />
      <main className="min-h-150 flex-1 flex flex-col bg-neutral-100 rounded border shadow shadow-neutral-500">
        <Outlet context={ticketDetails} />
      </main>
    </div>
  );
};
