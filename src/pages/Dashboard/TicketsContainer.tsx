import { useEffect, useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useAuthContext } from "../../contexts/AuthContext";
import { Button, Spinner } from "../../utils/Reusables";
import { ArrowUp } from "lucide-react";
import { useFetchAllTickets } from "../../services/ticketService";
import { UserTicketsGrid } from "./UserTicketsGrid";
import { AgentTicketsTable } from "./AgentTicketsTable";

export const TicketsContainer = () => {
  const { profile } = useAuthContext();
  const {
    data,
    isLoading: ticketsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    ...useFetchAllTickets(profile),
  });

  const [arrowVisible, setArrowVisible] = useState(false);
  const rootContainerRef = useRef<HTMLDivElement>(null);
  const topContainerRef = useRef<HTMLDivElement>(null);
  const bottomContainerRef = useRef<HTMLDivElement>(null);

  const isAgent = profile?.role === "agent";

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

  if (ticketsLoading) return <Spinner />;

  const tickets = data?.pages.flatMap((page) => page.typedData) ?? [];

  return (
    <div
      ref={rootContainerRef}
      className="px-4 overflow-y-auto"
      style={{ scrollbarWidth: "none" }}
    >
      <div
        ref={topContainerRef}
        className="h-px md:col-span-2 lg:col-span-3 xl:col-span-4"
      ></div>
      {isAgent ? (
        <AgentTicketsTable tickets={tickets} profile={profile} />
      ) : (
        <UserTicketsGrid tickets={tickets} profile={profile} />
      )}
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
