import { useState } from "react";
import type { AppType, ProfileType } from "../../supabase/requiredTypes";
import {
  Button,
  Span,
  Input,
  SelectGroup,
  TextArea,
  type ButtonProps,
  Div,
  type SpanProps,
  type Inputprops,
  type TextAreaProps,
  type SelectGroupProps,
  type DivProps,
} from "./ReusableElements";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type FieldProps = {
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
  options?: { value: string; drop: string }[];
  target?: "comments" | "history";
};

type FormProps = {
  profile?: ProfileType | null;
  apps?: AppType[] | null;
  mode?: "create" | "update";
} & React.FormHTMLAttributes<HTMLFormElement>;

const commonFields: FieldProps[] = [
  {
    name: "Span",
    group: "grid1",
    grid: "row-1 col-1",
    props: {
      label: "Ticket Number",
      id: "ticketNumber",
      placeHolderText: "#######",
    },
  },
  {
    name: "Span",
    group: "grid1",
    grid: "row-1 col-2",
    props: {
      label: "Date and Time",
      id: "dateAndTime",
      placeHolderText: "----/--/-- --:--:--",
    },
  },
  {
    name: "Span",
    group: "grid1",
    grid: "row-1 col-3",
    props: { label: "Created by", id: "createdBy" },
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
      { value: "sev 5", drop: "Sev 5 (Minor)" },
      { value: "sev 4", drop: "Sev 4 (Low)" },
      { value: "sev 3", drop: "Sev 3 (Medium)" },
      { value: "sev 2", drop: "Sev 2 (High)" },
      { value: "sev 1", drop: "Sev 1 (Critical)" },
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

const formConfig: Record<string, FieldProps[]> = {
  user: [
    ...commonFields,
    {
      name: "Span",
      group: "grid1",
      grid: "row-2 col-1",
      props: { label: "Status", id: "status", placeHolderText: "Open" },
    },
    {
      name: "Span",
      group: "grid1",
      grid: "row-3 col-3",
      props: {
        label: "Assigned to",
        id: "assignedTo",
        placeHolderText: "Agent#",
      },
    },
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
      props: { label: "History", id: "history", className: "h-full" },
    },
  ],
  agent: [
    ...commonFields,
    {
      name: "SelectGroup",
      group: "grid1",
      grid: "row-2 col-1",
      options: [
        { value: "open", drop: "Open" },
        { value: "active", drop: "Active" },
        { value: "deferred", drop: "Deferred" },
        { value: "resolved", drop: "Resolved" },
        { value: "closed", drop: "Closed" },
      ],
      props: {
        label: "Status",
        id: "status",
      },
    },
    {
      name: "Input",
      group: "grid1",
      grid: "row-3 col-3",
      props: {
        label: "Assigned to",
        id: "assignedTo",
        type: "text",
        placeholder: "Agent#",
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
        label: "history",
        id: "history",
        labelClass: "hidden",
      },
    },
    {
      name: "Div",
      group: "grid2",
      grid: "row-2 col-2",
      props: {
        label: "intHistory",
        id: "intHistory",
        labelClass: "hidden",
        className: "border-neutral-900",
      },
    },
  ],
};

export const TicketForm = ({
  className,
  profile,
  apps,
  mode,
  ...props
}: FormProps) => {
  const [intComView, setIntComView] = useState(false);
  const [intHisView, setHisComView] = useState(false);
  const config = profile?.role ? formConfig[profile.role] : null;
  const gridOne = config?.filter((field) => field.group === "grid1");
  const gridTwo = config?.filter((field) => field.group === "grid2");

  const toggleInternal = (field: FieldProps) => {
    if (field.target === "comments") {
      setIntComView(field.props.id === "commentsIntBt");
    }
    if (field.target === "history") {
      setHisComView(field.props.id === "historyIntBt");
    }
  };

  return (
    <form className={className} {...props}>
      {gridOne && gridOne.length > 0 && (
        <div className="grid grid-cols-3 gap-12">
          {gridOne?.map((field, i) => {
            switch (field.name) {
              case "Span": {
                const children =
                  field.props.id === "createdBy" && mode === "create"
                    ? profile?.name
                    : "";
                return (
                  <div key={`${field.name}-${i}`} className={field.grid}>
                    <Span {...(field.props as SpanProps)}>{children}</Span>
                  </div>
                );
              }

              case "SelectGroup": {
                return (
                  <div key={`${field.name}-${i}`} className={field.grid}>
                    <SelectGroup {...(field.props as SelectGroupProps)}>
                      {field.options
                        ? field.options?.map((option) => {
                            return (
                              <option
                                key={`${field.name}-${option.value}`}
                                value={option.value}
                              >
                                {option.drop}
                              </option>
                            );
                          })
                        : apps?.map((option) => {
                            return (
                              <option
                                key={`${field.name}-${option.id}`}
                                value={option.id}
                              >
                                {option.name}
                              </option>
                            );
                          })}
                    </SelectGroup>
                  </div>
                );
              }

              case "Input": {
                return (
                  <div key={`${field.name}-${i}`} className={field.grid}>
                    <Input {...(field.props as Inputprops)} />
                  </div>
                );
              }
            }
          })}
        </div>
      )}
      {gridTwo && gridTwo.length > 0 && (
        <div className="grid grid-cols-2 gap-y-3 gap-x-12">
          {gridTwo.map((field, i) => {
            switch (field.name) {
              case "Button": {
                return (
                  <div key={`${field.name}-${i}`} className={field.grid}>
                    <Button
                      onClick={
                        profile?.role === "agent" && field.target
                          ? () => toggleInternal(field)
                          : undefined
                      }
                      {...(field.props as ButtonProps)}
                    ></Button>
                  </div>
                );
              }

              case "TextArea": {
                const display =
                  field.props.id === "comments" && intComView
                    ? "hidden"
                    : field.props.id === "intComments" && !intComView
                      ? "hidden"
                      : "";

                return (
                  <div
                    key={`${field.name}-${i}`}
                    className={cn(
                      field.grid,
                      profile?.role === "agent" ? display : "",
                    )}
                  >
                    <TextArea {...(field.props as TextAreaProps)} />
                  </div>
                );
              }

              case "Div": {
                const display =
                  field.props.id === "history" && intHisView
                    ? "hidden"
                    : field.props.id === "intHistory" && !intHisView
                      ? "hidden"
                      : "";
                return (
                  <div
                    key={`${field.name}-${i}`}
                    className={cn(
                      field.grid,
                      profile?.role === "agent" ? display : "",
                    )}
                  >
                    <Div {...(field.props as DivProps)}></Div>
                  </div>
                );
              }
            }
          })}
        </div>
      )}
    </form>
  );
};
