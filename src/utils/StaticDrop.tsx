import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Check,
  ChevronsDown,
  ChevronsDownUp,
  ChevronsUp,
  Filter,
  UserCog2,
  UserRound,
  type LucideProps,
} from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { cn } from "./classMerger";
import { useHandleDrop } from "../customHooks/useHandleDrop";
import { useRef, type ButtonHTMLAttributes, type HTMLAttributes } from "react";
import type { Tickets } from "../supabase/requiredTypes";

const icons = {
  sort: ArrowUpDown,
  filter: Filter,
  header: UserRound,
  ascending: ArrowUp,
  descending: ArrowDown,
  severity: ChevronsUp,
  status: ChevronsDown,
  profile: UserCog2,
  application: ChevronsDownUp,
  check: Check,
};

export type DropId =
  | "createdAt"
  | "ticketNumber"
  | "status"
  | "application"
  | "assignedTo"
  | "severity"
  | "updatedAt"
  | "header";

export type DropItemProps = {
  name:
    | "Ascending"
    | "Descending"
    | Tickets["status"]
    | Tickets["severity"]
    | string;
  props?: DropdownMenu.DropdownMenuItemProps;
  divProps?: HTMLAttributes<HTMLDivElement>;
  icon?: {
    name:
      | "ascending"
      | "descending"
      | "severity"
      | "status"
      | "application"
      | "profile";
    props?: LucideProps;
  };
  selected?: {
    state: boolean;
    name: "check";
    props?: LucideProps;
  };
};

export type DropProps = {
  rootProps?: Omit<DropdownMenu.DropdownMenuProps, "open" | "onOpenChange">;
  trigger: {
    props?: DropdownMenu.DropdownMenuTriggerProps;
    buttonProps?: Pick<ButtonHTMLAttributes<HTMLButtonElement>, "className">;
    icon: {
      name: "sort" | "filter" | "header";
      props?: LucideProps;
    };
  };
  portal: {
    props?: DropdownMenu.DropdownMenuPortalProps;
    divProps?: HTMLAttributes<HTMLDivElement>;
    content: {
      props?: DropdownMenu.DropdownMenuContentProps;
      items?: DropItemProps[];
      arrow?: {
        props?: DropdownMenu.DropdownMenuArrowProps;
      };
    };
  };
};

type StaticDropProps = {
  id: DropId;
  drop: DropProps;
};

export const StaticDropdown = ({ id, drop }: StaticDropProps) => {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const { showDrop, setShowDrop } = useHandleDrop(targetRef);
  const TriggerIcon = icons[drop.trigger.icon.name];
  const trigger = drop.trigger;
  const portal = drop.portal;
  const items = portal ? portal.content.items : null;

  return (
    <div id={`${id}-dropBtn`} className="flex">
      <DropdownMenu.Root
        modal={false}
        open={showDrop}
        onOpenChange={setShowDrop}
        {...drop.rootProps}
      >
        <DropdownMenu.Trigger {...trigger.props} asChild>
          <button
            {...trigger.buttonProps}
            className={cn(
              "cursor-pointer outline-none px-0.75",
              drop.trigger.buttonProps?.className
            )}
          >
            <TriggerIcon {...trigger.icon.props} />
          </button>
        </DropdownMenu.Trigger>
        {portal && (
          <DropdownMenu.Portal {...portal.props}>
            <div ref={targetRef} {...portal.divProps}>
              <DropdownMenu.Content
                loop
                sideOffset={1}
                align="end"
                alignOffset={-1}
                {...portal.content.props}
                className={cn(
                  "flex flex-col gap-1 text-sm min-w-40 bg-neutral-100 p-1 rounded border border-neutral-400 cursor-pointer",
                  portal.content.props?.className
                )}
              >
                {items &&
                  items.length > 0 &&
                  items.map((item) => {
                    const ItemIcon = item.icon ? icons[item.icon.name] : null;
                    const SelectedIcon = item.selected?.state
                      ? icons[item.selected.name]
                      : null;
                    return (
                      <DropdownMenu.Item
                        key={`${id}-drop-${item.name}`}
                        {...item.props}
                        className={cn(
                          "outline-none py-0.5 rounded-[3px] bg-neutral-300 hover:bg-neutral-700 hover:text-neutral-100 focus:bg-neutral-700 focus:text-neutral-100 data-disabled:text-neutral-500 px-2 select-none data-disabled:pointer-events-none",
                          item.props?.className
                        )}
                      >
                        <div
                          {...item.divProps}
                          className={cn(
                            "flex items-center gap-4",
                            item.divProps?.className
                          )}
                        >
                          {item.icon && ItemIcon && (
                            <ItemIcon size={14} {...item.icon.props} />
                          )}
                          {item.name}
                          {item.selected?.state && SelectedIcon && (
                            <SelectedIcon
                              size={12}
                              {...item.selected.props}
                              className={cn(
                                "ml-auto",
                                item.selected?.props?.className
                              )}
                            />
                          )}
                        </div>
                      </DropdownMenu.Item>
                    );
                  })}
                {portal.content.arrow && (
                  <DropdownMenu.Arrow {...portal.content.arrow.props} />
                )}
              </DropdownMenu.Content>
            </div>
          </DropdownMenu.Portal>
        )}
      </DropdownMenu.Root>
    </div>
  );
};
