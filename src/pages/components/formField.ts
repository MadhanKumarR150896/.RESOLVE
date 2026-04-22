import type { OptionHTMLAttributes } from "react";
import type {
  ButtonProps,
  DivProps,
  Inputprops,
  SelectGroupProps,
  SpanProps,
  TextAreaProps,
} from "../../utils/ReusableElements";

export type FieldProps = {
  name: "Span" | "Button" | "Input" | "SelectGroup" | "TextArea" | "Div";
  group: "grid1" | "grid2";
  grid: string;
  props:
    | ButtonProps
    | SpanProps
    | Inputprops
    | TextAreaProps
    | SelectGroupProps
    | DivProps;
  options?: { drop: string; props: OptionHTMLAttributes<HTMLOptionElement> }[];
  target?: "comments" | "history";
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
  },
  {
    name: "Span",
    group: "grid1",
    grid: "row-2 col-2",
    props: { label: "Application", id: "application" },
  },
  {
    name: "SelectGroup",
    group: "grid1",
    grid: "row-2 col-2",
    props: {
      label: "Application",
      id: "application",
    },
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
        drop: "Sev 5 (Minor)",
        props: {
          value: "sev 5",
        },
      },
      {
        drop: "Sev 4 (Low)",
        props: {
          value: "sev 4",
        },
      },
      {
        drop: "Sev 3 (Medium)",
        props: {
          value: "sev 3",
        },
      },
      {
        drop: "Sev 2 (High)",
        props: {
          value: "sev 2",
        },
      },
      {
        drop: "Sev 1 (Critical)",
        props: {
          value: "sev 1",
        },
      },
    ],
    props: {
      label: "Severity",
      id: "severity",
    },
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
  },
  {
    name: "Span",
    group: "grid1",
    grid: "row-3 col-span-2",
    props: {
      label: "Description",
      id: "description",
    },
  },
  {
    name: "Span",
    group: "grid1",
    grid: "row-3 col-3",
    props: {
      label: "Assigned to",
      id: "assignedTo",
    },
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
          drop: "Open",
          props: {
            value: "open",
          },
        },
        { drop: "Active", props: { value: "active" } },
        { drop: "Deferred", props: { value: "deferred" } },
        { drop: "Resolved", props: { value: "resolved" } },
        { drop: "Closed", props: { value: "closed" } },
      ],
      props: {
        label: "Status",
        id: "status",
      },
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
      name: "Span",
      group: "grid2",
      grid: "row-3 col-2 justify-self-end mbs-auto mbe-2.5 me-10",
      props: {
        id: "lockedBy",
        className: "h-6 w-40 px-2 border-none text-sm",
      },
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
    },
  ],
};
