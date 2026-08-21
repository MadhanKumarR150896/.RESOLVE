import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import type { LucideProps } from "lucide-react";
import type { ButtonHTMLAttributes, HTMLAttributes } from "react";
import type { Tickets } from "../../supabase/requiredTypes";

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
    buttonProps?: Pick<ButtonHTMLAttributes<HTMLButtonElement>, "className">;
    icon: {
      name: "sort" | "filter" | "header";
      props?: LucideProps;
    };
  };
  portal?: {
    props?: DropdownMenu.DropdownMenuPortalProps;
    divProps?: HTMLAttributes<HTMLDivElement>;
    content: {
      props?: DropdownMenu.DropdownMenuContentProps;
      items: {
        name:
          | "Ascending"
          | "Descending"
          | Tickets["status"]
          | Tickets["severity"]
          | string;
        props?: DropdownMenu.DropdownMenuItemProps;
        divProps?: HTMLAttributes<HTMLDivElement>;
        icon?: {
          name: "ascending" | "descending" | "severity" | "status";
          props?: LucideProps;
        };
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
      portal: {
        content: {
          items: [
            {
              name: "Ascending",
              icon: {
                name: "ascending",
              },
            },
            {
              name: "Descending",
              icon: {
                name: "descending",
              },
            },
          ],
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
      portal: {
        content: {
          items: [
            {
              name: "Ascending",
              icon: {
                name: "ascending",
              },
            },
            {
              name: "Descending",
              icon: {
                name: "descending",
              },
            },
          ],
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
      portal: {
        content: {
          items: [
            {
              name: "open",
              icon: {
                name: "status",
              },
            },
            {
              name: "active",
              icon: {
                name: "status",
              },
            },
            {
              name: "deferred",
              icon: {
                name: "status",
              },
            },
            {
              name: "resolved",
              icon: {
                name: "status",
              },
            },
            {
              name: "closed",
              icon: {
                name: "status",
              },
            },
          ],
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
      portal: {
        content: {
          items: [],
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
      portal: {
        content: {
          items: [
            {
              name: "sev 1",
              icon: {
                name: "severity",
              },
            },
            {
              name: "sev 2",
              icon: {
                name: "severity",
              },
            },

            {
              name: "sev 3",
              icon: {
                name: "severity",
              },
            },
            {
              name: "sev 4",
              icon: {
                name: "severity",
              },
            },
            {
              name: "sev 5",
              icon: {
                name: "severity",
              },
            },
          ],
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
      portal: {
        content: {
          items: [],
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
