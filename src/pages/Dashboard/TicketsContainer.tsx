import { useEffect, useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useAuthContext } from "../../contexts/AuthContext";
import { Button, Spinner } from "../../utils/Reusables";
import { ArrowUp } from "lucide-react";
import { useFetchAllTickets } from "../../services/ticketService";
import { UserTicketsGrid } from "./UserTicketsGrid";
import { AgentTicketsTable } from "./AgentTicketTable/AgentTicketsTable";
import { useConstructParams } from "./AgentTicketTable/useConstructParams";
import { AgentTableDataRow } from "./AgentTicketTable/AgentTableDataRow";
import { UserTicketCard } from "./UserTicketCard";

export const TicketsContainer = () => {
  const { profile } = useAuthContext();
  const { getSortParams, getFilterParams } = useConstructParams();
  const sortParams = getSortParams();
  const filterParams = getFilterParams();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery(useFetchAllTickets(profile, sortParams, filterParams));

  const [arrowVisible, setArrowVisible] = useState(false);
  const rootContainerRef = useRef<HTMLDivElement>(null);
  const topContainerRef = useRef<HTMLDivElement>(null);
  const bottomContainerRef = useRef<HTMLDivElement>(null);

  const isAgent = profile?.role === "agent";
  const isUser = profile?.role === "user";

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
        rootMargin: "400px 0px 1000px 0px",
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

  const tickets = data?.pages.flatMap((page) => page.typedData) ?? [];
  const ticketIds = tickets
    ? tickets.filter(({ status }) => status !== "closed").map(({ id }) => id)
    : [];

  return (
    <div
      style={{
        scrollbarWidth: `${profile?.role === "user" ? "none" : "thin"}`,
      }}
      ref={rootContainerRef}
      className={`px-4 h-160 overflow-auto ${profile?.role === "user" ? "" : "me-2"}`}
    >
      <div ref={topContainerRef} className="h-px"></div>
      {isAgent && (
        <AgentTicketsTable ticketIds={ticketIds}>
          {tickets.map((ticket) => (
            <AgentTableDataRow
              key={ticket.id}
              ticket={ticket}
              profile={profile}
            />
          ))}
        </AgentTicketsTable>
      )}
      {isUser && (
        <UserTicketsGrid>
          {tickets.map((ticket) => (
            <UserTicketCard key={ticket.id} ticket={ticket} profile={profile} />
          ))}
        </UserTicketsGrid>
      )}
      <div ref={bottomContainerRef} className="h-px">
        {isFetchingNextPage && <Spinner className="h-12" />}
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
