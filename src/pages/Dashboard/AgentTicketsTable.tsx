import { useState } from "react";
import { cn } from "../../utils/classMerger";
import { tableHeaderConfig } from "./agentTableHeader";
import { useAuthContext } from "../../contexts/AuthContext";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useFetchAllTickets } from "../../services/ticketService";
import { AgentTableRow } from "./AgentTableRow";

export const AgentTicketsTable = () => {
  const { profile } = useAuthContext();
  const { data } = useInfiniteQuery({ ...useFetchAllTickets(profile) });
  const [colWidth] = useState([3, 8, 12, 8, 7, 8, 7, 9, 18, 8, 12]);

  const tickets = data?.pages.flatMap((page) => page.typedData) ?? [];

  return (
    <table className="min-w-470 border-separate border-spacing-0 table-fixed whitespace-nowrap">
      <colgroup>
        {colWidth.map((w, i) => (
          <col key={`agentTableCol-${i + 1}`} style={{ width: `${w}%` }}></col>
        ))}
      </colgroup>
      <thead className="">
        <tr className="sticky top-0 bg-neutral-900 text-neutral-100 text-left">
          {tableHeaderConfig.map((head) => (
            <th
              key={head.name}
              {...head.props}
              className={cn("h-8 px-3 border-r", head.props.className)}
            >
              {head.name}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {tickets.map((ticket) => (
          <AgentTableRow key={ticket.id} ticket={ticket} profile={profile} />
        ))}
      </tbody>
    </table>
  );
};
