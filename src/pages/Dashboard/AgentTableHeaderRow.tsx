import { ArrowUpDown, Filter } from "lucide-react";
import { cn } from "../../utils/classMerger";
import { tableHeaderConfig } from "./agentTableHeader";

export const AgentTableHeaderRow = () => {
  return (
    <tr className="sticky top-0 bg-neutral-900 text-neutral-100 text-left">
      {tableHeaderConfig.map((head) => (
        <th
          key={head.name}
          {...head.props}
          className={cn("h-8 px-3 border-r", head.props.className)}
        >
          <div className="flex items-center justify-between">
            <span>{head.name}</span>
            {(head.props.id === "createdAt" ||
              head.props.id === "ticketNumber") && (
              <button className="hover:cursor-pointer">
                <ArrowUpDown size={14} strokeWidth={2} />
              </button>
            )}
            {(head.props.id === "status" ||
              head.props.id === "application" ||
              head.props.id === "assignedTo" ||
              head.props.id === "severity") && (
              <button className="hover:cursor-pointer">
                <Filter size={14} strokeWidth={2} />
              </button>
            )}
          </div>
        </th>
      ))}
    </tr>
  );
};
