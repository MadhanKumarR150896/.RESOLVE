import { useState } from "react";
import { useAuthContext } from "../../../contexts/AuthContext";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useFetchAllTickets } from "../../../services/ticketService";
import { AgentTableDataRow } from "./AgentTableDataRow";
import { AgentTableHeaderRow } from "./AgentTableHeaderRow";
import { useConstructParams } from "./useConstructParams";

export const AgentTicketsTable = () => {
  const { profile } = useAuthContext();
  const { getSortParams, getFilterParams } = useConstructParams();
  const sortParams = getSortParams();
  const filterParams = getFilterParams();
  const { data } = useInfiniteQuery(
    useFetchAllTickets(profile, sortParams, filterParams)
  );
  const [colWidth] = useState([3, 9, 12, 8, 7, 8, 7, 8, 18, 8, 12]);

  const tickets = data?.pages.flatMap((page) => page.typedData) ?? [];
  return (
    <table
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
      }}
      className="min-w-470 min-h-150 border-separate border-spacing-0 table-fixed whitespace-nowrap"
    >
      <colgroup>
        {colWidth.map((w, i) => (
          <col key={`agentTableCol-${i + 1}`} style={{ width: `${w}%` }}></col>
        ))}
      </colgroup>
      <thead>
        <AgentTableHeaderRow />
      </thead>
      <tbody>
        {tickets.map((ticket) => (
          <AgentTableDataRow
            key={ticket.id}
            ticket={ticket}
            profile={profile}
          />
        ))}
      </tbody>
    </table>
  );
};
