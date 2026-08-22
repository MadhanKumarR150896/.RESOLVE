import { cn } from "../../utils/classMerger";
import { tableHeaderConfig } from "./agentTableHeader";
import { StaticDropdown, type DropId } from "../../utils/StaticDrop";
import { useGetDropItems } from "./agentTableHeaderDropItems";

export const AgentTableHeaderRow = () => {
  const dropItems = useGetDropItems();
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
              <span>{header.name}</span>
              {header.hasDrop && (
                <StaticDropdown
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
