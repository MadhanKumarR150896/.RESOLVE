import { useState, type ReactNode } from "react";
import { AgentTableHeaderRow } from "./AgentTableHeaderRow";

type AgentTableProps = {
  ticketIds: string[];
  children: ReactNode;
};

export const AgentTicketsTable = ({ children, ticketIds }: AgentTableProps) => {
  const [colWidth] = useState([3, 9, 12, 8, 7, 8, 7, 8, 18, 8, 12]);

  return (
    <table
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
      }}
      className="min-w-470 border-separate border-spacing-0 table-fixed whitespace-nowrap"
    >
      <colgroup>
        {colWidth.map((w, i) => (
          <col key={`agentTableCol-${i + 1}`} style={{ width: `${w}%` }}></col>
        ))}
      </colgroup>
      <thead>
        <AgentTableHeaderRow ticketIds={ticketIds} />
      </thead>
      <tbody>{children}</tbody>
    </table>
  );
};
