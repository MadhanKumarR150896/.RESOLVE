import type { OptionHTMLAttributes } from "react";
import type {
  ButtonProps,
  DivProps,
  Inputprops,
  SelectGroupProps,
  SpanProps,
  TextAreaProps,
} from "../../utils/ReusableElements";
import type { Mode } from "./TicketPage";
import type { FormValues } from "../../supabase/requiredTypes";

export type Role = "user" | "agent";

export type FieldContext = {
  role?: Role;
  mode: Mode;
};

export type FieldProps = {
  name: "Span" | "Button" | "Input" | "SelectGroup" | "TextArea" | "Div";
  group: "grid1" | "grid2";
  grid: string;
  props: {
    id: string | keyof FormValues;
  } & (
    | ButtonProps
    | SpanProps
    | Inputprops
    | TextAreaProps
    | SelectGroupProps
    | DivProps
  );
  options?: { drop: string; props: OptionHTMLAttributes<HTMLOptionElement> }[];
  target?: "comments" | "history";
  isRequired?: () => string;
  notVisible?: (ctx: FieldContext) => boolean;
};

export const notVisibleFields = (field: FieldProps, ctx: FieldContext) => {
  if (!field.notVisible) return false;

  return field.notVisible(ctx);
};

export const isRequiredFields = (field: FieldProps) => {
  if (!field.isRequired) return false;

  return field.isRequired();
};

const commonFields: FieldProps[] = [
  {
    name: "Span",
    group: "grid1",
    grid: "row-1 col-1",
    props: {
      label: "Ticket Number",
      id: "ticketNumber",
    },
  },
  {
    name: "Input",
    group: "grid1",
    grid: "row-1 col-1 hidden",
    props: {
      id: "ticketId",
      type: "hidden",
    },
    notVisible: ({ mode }) => mode === "create",
  },
  {
    name: "Span",
    group: "grid1",
    grid: "row-1 col-2",
    props: {
      label: "Date and Time",
      id: "createdAt",
    },
  },
  {
    name: "Span",
    group: "grid1",
    grid: "row-1 col-3",
    props: { label: "Created by", id: "createdBy" },
  },
  {
    name: "Span",
    group: "grid1",
    grid: "row-2 col-1",
    props: { label: "Status", id: "status", placeHolderText: "Open" },
    notVisible: ({ mode, role }) => role === "agent" && mode === "update",
  },
  {
    name: "Span",
    group: "grid1",
    grid: "row-2 col-2",
    props: { label: "Application", id: "application" },
    notVisible: ({ mode }) => mode === "create",
  },
  {
    name: "SelectGroup",
    group: "grid1",
    grid: "row-2 col-2",
    props: {
      label: "Application",
      id: "application",
    },
    isRequired: () => "*required",
    notVisible: ({ mode }) => mode === "update",
  },
  {
    name: "SelectGroup",
    group: "grid1",
    grid: "row-2 col-3",
    options: [
      {
        drop: "Select Severity",
        props: {
          value: "",
        },
      },
      {
        drop: "sev 5 (Minor)",
        props: {
          value: "sev 5",
        },
      },
      {
        drop: "sev 4 (Low)",
        props: {
          value: "sev 4",
        },
      },
      {
        drop: "sev 3 (Medium)",
        props: {
          value: "sev 3",
        },
      },
      {
        drop: "sev 2 (High)",
        props: {
          value: "sev 2",
        },
      },
      {
        drop: "sev 1 (Critical)",
        props: {
          value: "sev 1",
        },
      },
    ],
    props: {
      label: "Severity",
      id: "severity",
    },
    isRequired: () => "*required",
  },
  {
    name: "Input",
    group: "grid1",
    grid: "row-3 col-span-2",
    props: {
      label: "Description",
      id: "description",
      type: "text",
      placeholder: "Please provide a description about the issue",
    },
    isRequired: () => "*required",
    notVisible: ({ mode }) => mode === "update",
  },
  {
    name: "Span",
    group: "grid1",
    grid: "row-3 col-span-2",
    props: {
      label: "Description",
      id: "description",
    },
    notVisible: ({ mode }) => mode === "create",
  },
  {
    name: "Span",
    group: "grid1",
    grid: "row-3 col-3",
    props: {
      label: "Assigned to",
      id: "assignedName",
    },
    notVisible: ({ role, mode }) => role === "agent" && mode === "update",
  },
  {
    name: "Span",
    group: "grid2",
    grid: "row-3 col-1 w-45 mbs-auto mbe-2.5",
    props: {
      id: "lockedName",
      className: "h-6 border-none text-sm rounded",
    },
    notVisible: ({ mode }) => mode === "create",
  },
  {
    name: "Button",
    group: "grid2",
    grid: "row-3 col-1 justify-self-end -mr-36 mt-12",
    props: {
      type: "submit",
      id: "submit",
      label: "Submit",
      className: "min-w-60 py-2 text-xl",
    },
  },
  {
    name: "Button",
    group: "grid2",
    grid: "row-3 col-2 justify-self-end mt-12",
    props: {
      type: "button",
      id: "faker",
      variant: "faker",
      label: "Use me",
      className: "px-4 py-2.5",
    },
    notVisible: ({ mode }) => mode === "update",
  },
];

export const formConfig: Record<string, FieldProps[]> = {
  user: [
    ...commonFields,
    {
      name: "TextArea",
      group: "grid2",
      grid: "row-1 col-1",
      props: {
        label: "Comments",
        id: "comments",
        placeholder: "Please provide more details here",
      },
    },
    {
      name: "Div",
      group: "grid2",
      grid: "row-1 col-2",
      props: { label: "History", id: "history" },
    },
  ],
  agent: [
    ...commonFields,
    {
      name: "SelectGroup",
      group: "grid1",
      grid: "row-2 col-1",
      options: [
        {
          drop: "open",
          props: {
            value: "open",
          },
        },
        { drop: "active", props: { value: "active" } },
        { drop: "deferred", props: { value: "deferred" } },
        { drop: "resolved", props: { value: "resolved" } },
        { drop: "closed", props: { value: "closed" } },
      ],
      props: {
        label: "Status",
        id: "status",
      },
      notVisible: ({ mode, role }) => role === "agent" && mode === "create",
    },
    {
      name: "Input",
      group: "grid1",
      grid: "row-3 col-3 hidden",
      props: {
        id: "assignedTo",
        type: "hidden",
      },
    },
    {
      name: "Input",
      group: "grid1",
      grid: "row-3 col-3 relative",
      props: {
        label: "Assigned to",
        id: "assignedName",
        type: "text",
      },
      notVisible: ({ mode, role }) => mode === "create" && role === "agent",
    },
    {
      name: "Button",
      group: "grid2",
      target: "comments",
      grid: "row-1 col-1",
      props: {
        type: "button",
        id: "commentsBt",
        label: "Comments",
        className: "py-0.5 px-2 hover:bg-neutral-900",
      },
    },
    {
      name: "Button",
      group: "grid2",
      target: "comments",
      grid: "row-1 col-1 ms-27",
      props: {
        type: "button",
        id: "commentsIntBt",
        label: "Internal",
        className: "py-0.5 px-2 bg-neutral-500 text-white hover:bg-neutral-500",
      },
    },
    {
      name: "Button",
      group: "grid2",
      target: "history",
      grid: "row-1 col-2",
      props: {
        type: "button",
        id: "historyBt",
        label: "History",
        className: "py-0.5 px-2 hover:bg-neutral-900",
      },
    },
    {
      name: "Button",
      group: "grid2",
      target: "history",
      grid: "row-1 col-2 ms-20",
      props: {
        type: "button",
        id: "historyIntBt",
        label: "Internal",
        className: "py-0.5 px-2 bg-neutral-500 text-white hover:bg-neutral-500",
      },
    },
    {
      name: "TextArea",
      group: "grid2",
      grid: "row-2 col-1",
      props: {
        id: "comments",
        placeholder: "Please provide more details here",
      },
    },
    {
      name: "TextArea",
      group: "grid2",
      grid: "row-2 col-1",
      props: {
        id: "intComments",
        placeholder: "Please provide internal details here",
        className: "border-neutral-900",
      },
    },
    {
      name: "Div",
      group: "grid2",
      grid: "row-2 col-2",
      props: {
        id: "history",
      },
    },
    {
      name: "Div",
      group: "grid2",
      grid: "row-2 col-2",
      props: {
        id: "intHistory",
        className: "border-neutral-900",
      },
    },
    {
      name: "Input",
      group: "grid2",
      grid: "row-3 col-2 hidden",
      props: {
        id: "lockedBy",
        type: "hidden",
      },
      notVisible: ({ mode, role }) => role === "agent" && mode === "create",
    },
    {
      name: "Input",
      group: "grid2",
      grid: "row-3 col-2 mbs-auto mbe-3 justify-self-end",
      props: {
        id: "isLocked",
        type: "checkbox",
        className: "h-5 w-5 accent-neutral-900",
      },
      notVisible: ({ mode, role }) => role === "agent" && mode === "create",
    },
  ],
};
