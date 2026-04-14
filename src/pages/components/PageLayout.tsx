import { Outlet, useParams } from "react-router";
import { Header } from "./Header";
import { useEffect, useState } from "react";

export const PageLayout = () => {
  const params = useParams();
  const [ticketId, setTicketId] = useState<string | null>(null);

  useEffect(() => {
    const checkMode = () => {
      if (params.ticketId) {
        setTicketId(params.ticketId);
      } else {
        setTicketId(null);
      }
    };
    checkMode();
  }, [params.ticketId]);

  return (
    <div className="base gap-2 p-2 min-w-230">
      <Header />
      <main className="min-h-150 flex-1 flex flex-col bg-neutral-100 rounded border shadow shadow-neutral-500">
        <Outlet context={ticketId} />
      </main>
    </div>
  );
};
