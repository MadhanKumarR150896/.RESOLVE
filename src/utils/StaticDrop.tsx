import { ArrowUpDown, Filter, UserRound } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import type { DropId } from "../contexts/DropProvider";
import { useDropContext } from "../contexts/DropContext";
import type { DropProps } from "../pages/Dashboard/agentTableHeader";
import { cn } from "./classMerger";

const icons = {
  sort: ArrowUpDown,
  filter: Filter,
  header: UserRound,
};

type StaticDropProps = {
  id: DropId;
  drop: DropProps;
};

export const StaticDropdown = ({ id, drop }: StaticDropProps) => {
  const { showDrop, setShowDrop } = useDropContext();
  const TriggerIcon = icons[drop.trigger.icon.name];

  return (
    <div id={`${id}-dropBtn`}>
      <DropdownMenu.Root
        modal={false}
        open={showDrop === id}
        onOpenChange={(open) => {
          if (!open) {
            setShowDrop((prev) => (prev === id ? null : prev));
          }
        }}
        {...drop.rootProps}
      >
        <DropdownMenu.Trigger {...drop.trigger.props} asChild>
          <button
            onClick={() => setShowDrop((prev) => (prev === id ? null : id))}
            {...drop.trigger.buttonProps}
            className={cn(
              "cursor-pointer",
              drop.trigger.buttonProps?.className
            )}
          >
            <TriggerIcon {...drop.trigger.icon.props} />
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            loop
            className="text-sm min-w-40 bg-neutral-50 p-2 rounded border border-neutral-500 cursor-pointer"
            sideOffset={2}
            align="end"
            alignOffset={-1}
          >
            <DropdownMenu.Item className="outline-none py-0.5 rounded hover:bg-neutral-300 focus:bg-neutral-300 data-disabled:text-neutral-500 px-2 select-none data-disabled:pointer-events-none">
              Option 1
            </DropdownMenu.Item>
            <DropdownMenu.Item className="outline-none py-0.5 rounded hover:bg-neutral-300 focus:bg-neutral-300 data-disabled:text-neutral-500 px-2 select-none data-disabled:pointer-events-none">
              Option 2
            </DropdownMenu.Item>

            <DropdownMenu.Item className="outline-none py-0.5 rounded hover:bg-neutral-300 focus:bg-neutral-300 data-disabled:text-neutral-500 px-2 select-none data-disabled:pointer-events-none">
              Option 3
            </DropdownMenu.Item>
            <DropdownMenu.Arrow className="fill-neutral-400" />
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
};
