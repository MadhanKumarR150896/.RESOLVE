import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import type { LucideProps } from "lucide-react";
import type { ButtonHTMLAttributes, HTMLAttributes } from "react";

export type PropId =
  | "ticketId"
  | "ticketNumber"
  | "createdAt"
  | "createdBy"
  | "status"
  | "severity"
  | "application"
  | "description"
  | "assignedTo"
  | "updatedBy"
  | "updatedAt";

export type DropProps = {
  rootProps?: Omit<DropdownMenu.DropdownMenuProps, "open" | "onOpenChange">;
  trigger: {
    props?: DropdownMenu.DropdownMenuTriggerProps;
    buttonProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick">;
    icon: {
      name: "sort" | "filter";
      props?: LucideProps;
    };
  };
  portal?: {
    props?: DropdownMenu.DropdownMenuPortalProps;
    content?: {
      props?: DropdownMenu.DropdownMenuContentProps;
      item?: {
        props?: DropdownMenu.DropdownMenuItemProps;
        divProps?: HTMLAttributes<HTMLDivElement>;
        icon?: {
          name?: string;
          props?: LucideProps;
        };
      }[];
      arrowProps?: DropdownMenu.DropdownMenuArrowProps;
      separator?: {
        props?: DropdownMenu.DropdownMenuSeparatorProps[];
      }[];
    };
  };
};

type TableHeaderConfigProps = {
  name: string;
  props: {
    id: PropId;
    scope: "col" | "row";
    className?: string;
  };
  hasDrop?: DropProps;
};

export const tableHeaderConfig: TableHeaderConfigProps[] = [
  {
    name: "",
    props: {
      id: "ticketId",
      scope: "col",
      className: "rounded-tl rounded-bl",
    },
  },
  {
    name: "Ticket Number",
    props: {
      id: "ticketNumber",
      scope: "col",
    },
    hasDrop: {
      trigger: {
        icon: {
          name: "sort",
          props: {
            size: 14,
            strokeWidth: 2,
          },
        },
      },
    },
  },
  {
    name: "Created At",
    props: {
      id: "createdAt",
      scope: "col",
    },
    hasDrop: {
      trigger: {
        icon: {
          name: "sort",
          props: {
            size: 14,
            strokeWidth: 2,
          },
        },
      },
    },
  },
  {
    name: "Created By",
    props: {
      id: "createdBy",
      scope: "col",
    },
  },
  {
    name: "Status",
    props: {
      id: "status",
      scope: "col",
    },
    hasDrop: {
      trigger: {
        icon: {
          name: "filter",
          props: {
            size: 14,
            strokeWidth: 2,
          },
        },
      },
    },
  },
  {
    name: "Application",
    props: {
      id: "application",
      scope: "col",
    },
    hasDrop: {
      trigger: {
        icon: {
          name: "filter",
          props: {
            size: 14,
            strokeWidth: 2,
          },
        },
      },
    },
  },
  {
    name: "Severity",
    props: {
      id: "severity",
      scope: "col",
    },
    hasDrop: {
      trigger: {
        icon: {
          name: "filter",
          props: {
            size: 14,
            strokeWidth: 2,
          },
        },
      },
    },
  },
  {
    name: "Assigned To",
    props: {
      id: "assignedTo",
      scope: "col",
    },
    hasDrop: {
      trigger: {
        icon: {
          name: "filter",
          props: {
            size: 14,
            strokeWidth: 2,
          },
        },
      },
    },
  },
  {
    name: "Description",
    props: {
      id: "description",
      scope: "col",
    },
  },

  {
    name: "Updated By",
    props: {
      id: "updatedBy",
      scope: "col",
    },
  },
  {
    name: "Updated At",
    props: {
      id: "updatedAt",
      scope: "col",
      className: "border-0 rounded-tr rounded-br",
    },
  },
];
