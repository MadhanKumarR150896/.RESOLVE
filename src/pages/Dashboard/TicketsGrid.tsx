import { Link } from "react-router";
import type { TicketThumbnail } from "../../supabase/requiredTypes";
import { Spinner } from "../../utils/Spinner";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDate } from "../../utils/formatDate";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const bgStatus = {
  open: "bg-red-700 text-neutral-100",
  active: " bg-blue-700 text-neutral-100",
  deferred: "bg-yellow-300 text-neutral-900",
  resolved: "bg-green-700 text-neutral-100",
  closed: "bg-gray-300 text-neutral-900",
};

export const TicketsGrid = ({
  tickets,
  loading,
  role,
}: {
  tickets: TicketThumbnail[];
  loading: boolean;
  role: "user" | "agent" | null;
}) => {
  if (loading) return <Spinner />;
  return (
    <div
      className="px-8 grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 overflow-y-auto"
      style={{ scrollbarWidth: "none" }}
    >
      {tickets?.map((ticket) => {
        return (
          <Link
            key={ticket.id}
            to={`/dashboard/${role}/ticket/${ticket.ticket_number}`}
          >
            <div className="flex flex-col gap-2 border-2 text-center border-neutral-400 text-sm rounded p-2 hover:shadow hover:shadow-neutral-500">
              <div className="grid grid-cols-3 gap-2 mbe-0.5">
                <span className="bg-neutral-900 font-extrabold text-neutral-100 py-1 rounded">
                  {ticket.ticket_number}
                </span>
                <span className="bg-neutral-400/70 py-1 rounded font-semibold">
                  {ticket.app.name}
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
