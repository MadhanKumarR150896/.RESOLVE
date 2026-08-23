import type {
  HTMLAttributes,
  InputHTMLAttributes,
  LinkHTMLAttributes,
} from "react";
import type { PropId } from "./agentTableHeader";

export type LinkP = LinkHTMLAttributes<HTMLAnchorElement>;
export type InputP = InputHTMLAttributes<HTMLInputElement>;
export type SpanP = HTMLAttributes<HTMLSpanElement>;
export type DivP = HTMLAttributes<HTMLDivElement>;

type Value =
  | "id"
  | "ticket_number"
  | "created_at"
  | "status"
  | "updated_at"
  | "app"
  | "description"
  | "severity"
  | "created_by"
  | "updated_by"
  | "assigned_name";

type TableDataConfigProps = {
  name: "Span" | "Input" | "Div" | "Link";
  value: Value;
  props: {
    id: PropId;
    header: PropId;
  } & HTMLAttributes<HTMLTableCellElement>;
  innerProps: {
    id: Value;
  } & (InputP | DivP | SpanP | LinkP);
};

export const tableDataConfig: TableDataConfigProps[] = [
  {
    name: "Input",
    value: "id",
    props: {
      id: "ticketId",
      header: "ticketId",
    },
    innerProps: {
      type: "checkbox",
      id: "id",
      className: "accent-black",
    },
  },
  {
    name: "Link",
    value: "ticket_number",
    props: {
      id: "ticketNumber",
      header: "ticketNumber",
    },
    innerProps: {
      id: "ticket_number",
      className: "underline w-min",
    },
  },
  {
    name: "Span",
    value: "created_at",
    props: {
      id: "createdAt",
      header: "createdAt",
    },
    innerProps: {
      id: "created_at",
    },
  },
  {
    name: "Span",
    value: "created_by",
    props: {
      id: "createdBy",
      header: "createdBy",
    },
    innerProps: {
      id: "created_by",
    },
  },
  {
    name: "Span",
    value: "status",
    props: {
      id: "status",
      header: "status",
    },
    innerProps: {
      id: "status",
    },
  },
  {
    name: "Span",
    value: "app",
    props: {
      id: "application",
      header: "application",
    },
    innerProps: {
      id: "app",
    },
  },
  {
    name: "Span",
    value: "severity",
    props: {
      id: "severity",
      header: "severity",
    },
    innerProps: {
      id: "severity",
    },
  },
  {
    name: "Span",
    value: "assigned_name",
    props: {
      id: "assignedTo",
      header: "assignedTo",
    },
    innerProps: {
      id: "assigned_name",
    },
  },
  {
    name: "Div",
    value: "description",
    props: {
      id: "description",
      header: "description",
    },
    innerProps: {
      id: "description",
      className: "w-75 truncate",
    },
  },

  {
    name: "Span",
    value: "updated_by",
    props: {
      id: "updatedBy",
      header: "updatedBy",
    },
    innerProps: {
      id: "updated_by",
    },
  },
  {
    name: "Span",
    value: "updated_at",
    props: {
      id: "updatedAt",
      header: "updatedAt",
    },
    innerProps: {
      id: "updated_at",
    },
  },
];
