//import { ArrowUpDown, Filter } from "lucide-react";
import { cn } from "../../utils/classMerger";
import { tableHeaderConfig } from "./agentTableHeader";
import { StaticDropdown, type DropId } from "../../utils/StaticDrop";

export const AgentTableHeaderRow = () => {
  return (
    <tr className="sticky top-0 bg-neutral-900 text-neutral-100 text-left">
      {tableHeaderConfig.map((head) => {
        const dropId = head.props.id as DropId;
        return (
          <th
            key={head.name}
            {...head.props}
            className={cn("h-8 ps-3 pe-2 border-r", head.props.className)}
          >
            <div className="flex justify-between">
              <span>{head.name}</span>
              {head.hasDrop && (
                <StaticDropdown id={dropId} drop={head.hasDrop} />
              )}
            </div>
          </th>
        );
      })}
    </tr>
  );
};
