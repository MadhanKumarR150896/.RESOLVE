import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDate } from "../../utils/formatDate";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useGetTickets } from "./getTickets";
import { useAuthContext } from "../../context/AuthContext";
import { Button, Spinner } from "../../utils/ReusableElements";
import { ArrowUp } from "lucide-react";

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

export const TicketsGrid = ({ role }: { role: "user" | "agent" | null }) => {
  const { profile } = useAuthContext();
  const {
    data: tickets,
    isLoading: ticketsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    ...useGetTickets(),
    enabled: !!profile,
  });
  const [arrowVisible, setArrowVisible] = useState(false);
  const rootContainerRef = useRef<HTMLDivElement>(null);
  const topContainerRef = useRef<HTMLDivElement>(null);
  const bottomContainerRef = useRef<HTMLDivElement>(null);

  const backToTop = () => {
    rootContainerRef.current?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(async (entry) => {
          if (entry.target === bottomContainerRef.current) {
            if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
              await fetchNextPage();
            }
          }
          if (entry.target === topContainerRef.current) {
            setArrowVisible(!entry.isIntersecting);
          }
        });
      },
      {
        root: rootContainerRef.current,
        rootMargin: "200px 0px 400px 0px",
        threshold: 0,
      }
    );

    if (bottomContainerRef.current) {
      observer.observe(bottomContainerRef.current);
    }

    if (topContainerRef.current) {
      observer.observe(topContainerRef.current);
    }

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (ticketsLoading) return <Spinner />;

  return (
    <div
      ref={rootContainerRef}
      className="px-8 overflow-y-auto"
      style={{ scrollbarWidth: "none" }}
    >
      <div
        ref={topContainerRef}
        className="h-px md:col-span-2 lg:col-span-3 xl:col-span-4"
      ></div>
      {tickets?.pages.map((page, i) => {
        return (
          <div
            className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pbe-8"
            key={i}
          >
            {page.data.map((ticket) => {
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
      })}
      <div
        ref={bottomContainerRef}
        className="h-px md:col-span-2 lg:col-span-3 xl:col-span-4"
      >
        {hasNextPage && isFetchingNextPage && <Spinner />}
      </div>
      <Button
        variant="backtotop"
        onClick={backToTop}
        className={!arrowVisible ? "hidden" : ""}
      >
        <ArrowUp />
      </Button>
    </div>
  );
};
