import { cn } from "../../../utils/classMerger";
import { tableHeaderConfig } from "./agentTableHeader";
import { CustomDropdown, type DropId } from "../../../utils/CustomDrop";
import { useGenerateDropItems } from "./useGenerateDropItems";
import { useTicketsStore } from "../../../stores/ticketsStore";

export const AgentTableHeaderRow = ({ ticketIds }: { ticketIds: string[] }) => {
  const dropItems = useGenerateDropItems();
  const { ticketState, selectAllTicket } = useTicketsStore((state) => state);

  const ticketsCount = ticketState.count;

  return (
    <tr className="sticky top-0 bg-neutral-900 text-neutral-100 text-left">
      {tableHeaderConfig.map((header) => {
        const dropId = header.props.id as DropId;
        return (
          <th
            key={header.name}
            {...header.props}
            className={cn("h-8 ps-3 pe-2 border-r", header.props.className)}
          >
            <div className="flex justify-between">
              {header.props.id === "ticketId" && (
                <input
                  type="checkbox"
                  className="mx-auto accent-amber-50"
                  checked={
                    ticketIds.length > 0 && ticketIds.length === ticketsCount
                  }
                  onChange={(e) =>
                    selectAllTicket(e.target.checked ? ticketIds : [])
                  }
                />
              )}
              <span>{header.name}</span>
              {header.hasDrop && (
                <CustomDropdown
                  id={dropId}
                  drop={{
                    ...header.hasDrop,
                    portal: {
                      ...header.hasDrop.portal,
                      content: {
                        ...header.hasDrop.portal.content,
                        items: dropItems[dropId],
                      },
                    },
                  }}
                />
              )}
            </div>
          </th>
        );
      })}
    </tr>
  );
};
