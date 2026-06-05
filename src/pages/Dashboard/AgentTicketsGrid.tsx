import { useState } from "react";
import { HeaderRow } from "./HeaderRow";
import type { TicketsContainerProps } from "./UserTicketsGrid";

export const AgentTicketsGrid = ({
  tickets,
  profile,
}: TicketsContainerProps) => {
  console.log(tickets, profile);
  const [colsWidth] = useState([
    50, 120, 150, 200, 100, 100, 100, 250, 150, 200, 150,
  ]);

  const gridColumnsWidth = colsWidth.map((w) => `${w}px`).join(" ");

  return (
    <div
      role="grid"
      className="grid border rounded border-neutral-500 overflow-auto grid-cols-11"
      style={{
        gridTemplateColumns: gridColumnsWidth,
        scrollbarWidth: "thin",
      }}
    >
      <HeaderRow />
    </div>
  );
};
