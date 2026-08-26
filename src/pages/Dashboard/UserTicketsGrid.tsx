import { Link } from "react-router";
import { formatDate } from "../../utils/formatDate";
import { cn } from "../../utils/classMerger";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useFetchAllTickets } from "../../services/ticketService";
import { useAuthContext } from "../../contexts/AuthContext";

const bgStatus = {
  open: "bg-red-700 text-neutral-100",
  active: " bg-blue-700 text-neutral-100",
  deferred: "bg-yellow-300 text-neutral-900",
  resolved: "bg-green-700 text-neutral-100",
  closed: "bg-gray-300 text-neutral-900",
};

export const UserTicketsGrid = () => {
  const { profile } = useAuthContext();
  const { data } = useInfiniteQuery(useFetchAllTickets(profile));

  const tickets = data?.pages.flatMap((page) => page.typedData) ?? [];
  return (
    <div className="grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 pbe-4">
      {tickets.map((ticket) => {
        return (
          <Link
            key={ticket.id}
            to={`/dashboard/${profile?.role}/ticket/${ticket.ticket_number}`}
          >
            <div className="flex flex-col gap-2 border-2 text-center border-neutral-400 text-sm rounded p-2 hover:shadow hover:shadow-neutral-500">
              <div className="grid grid-cols-3 gap-2 mbe-0.5">
                <span className="bg-neutral-900 font-extrabold text-neutral-100 py-1 rounded">
                  {ticket.ticket_number}
                </span>
                <span className="bg-neutral-400/70 py-1 rounded font-semibold">
                  {ticket.app}
                </span>
                <span
                  className={cn(
                    "font-bold py-1 rounded",
                    bgStatus[ticket.status]
                  )}
                >
                  {ticket.status}
                </span>
              </div>
              <div className="bg-neutral-500/50 p-2 rounded">
                <p className="line-clamp-1">{ticket.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex flex-col bg-neutral-300 py-1 rounded">
                  <span className="font-semibold">Created @ </span>
                  <span className="text-neutral-600">
                    {formatDate(ticket.created_at)}
                  </span>
                </div>
                <div className="flex flex-col bg-neutral-300 py-1 rounded">
                  <span className="font-semibold">Updated @ </span>
                  <span className="text-neutral-600">
                    {formatDate(ticket.updated_at)}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};
