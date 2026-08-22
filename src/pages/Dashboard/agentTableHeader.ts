import type { DropProps } from "../../utils/StaticDrop";

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
        content: {},
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
        content: {},
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
        content: {},
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
        content: {},
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
        content: {},
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
