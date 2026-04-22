import { useEffect, useRef, useState } from "react";
import type {
  AppType,
  FormValues,
  ProfileType,
  TicketDetails,
} from "../../supabase/requiredTypes";
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
} from "../../utils/ReusableElements";
import { formConfig, type FieldProps } from "./formField";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useForm, type SubmitHandler } from "react-hook-form";
import { generateTicketInfo } from "../../utils/ticketSamples";
import { supabase } from "../../supabase/supabaseClient";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Assignees = {
  id: string;
  name: string | null;
};

type FormProps = {
  onSubmit: SubmitHandler<FormValues>;
  profile: ProfileType | null;
  values: TicketDetails | null;
  apps: AppType[] | null;
  mode: "create" | "update";
} & Omit<React.FormHTMLAttributes<HTMLFormElement>, "onSubmit">;

export const TicketForm = ({
  onSubmit,
  className,
  profile,
  values,
  apps,
  mode,
  ...props
}: FormProps) => {
  const {
    register,
    reset,
    formState: { errors, isSubmitting },
    setValue,
    handleSubmit,
  } = useForm<FormValues>();
  const [intComView, setIntComView] = useState(false);
  const [intHisView, setHisComView] = useState(false);
  const [assignee, setAssignee] = useState("");
  const [isAssigned, setIsAssigned] = useState(false);
  const [assignees, setAssignees] = useState<Assignees[]>([]);
  const config = profile?.role ? formConfig[profile.role] : null;
  const gridOne = config?.filter((field) => field.group === "grid1");
  const gridTwo = config?.filter((field) => field.group === "grid2");
  const assigneeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleAssigneeDrop = (e: MouseEvent) => {
      if (
        assigneeRef.current &&
        !assigneeRef.current.contains(e.target as Node)
      )
        setAssignees([]);
    };

    document.addEventListener("mousedown", handleAssigneeDrop);

    return () => document.removeEventListener("mousedown", handleAssigneeDrop);
  }, []);

  useEffect(() => {
    if (isAssigned) return;

    let isStale = false;

    const timeout = setTimeout(async () => {
      if (assignee.length < 3) {
        setAssignees([]);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("id,name")
        .eq("is_active", true)
        .ilike("name", `%${assignee}%`);

      if (!isStale && !error && data) setAssignees(data);
    }, 400);

    return () => {
      clearTimeout(timeout);
      isStale = true;
    };
  }, [assignee, isAssigned]);

  const toggleInternal = (field: FieldProps) => {
    if (field.target === "comments") {
      setIntComView(field.props.id === "commentsIntBt");
    }
    if (field.target === "history") {
      setHisComView(field.props.id === "historyIntBt");
    }
  };

  const display = (field: FieldProps) => {
    if (field.name === "TextArea") {
      if (field.props.id === "comments" && intComView) return "hidden";
      if (field.props.id === "intComments" && !intComView) return "hidden";
    }

    if (field.name === "Div") {
      if (field.props.id === "history" && intHisView) return "hidden";
      if (field.props.id === "intHistory" && !intHisView) return "hidden";
    }
  };

  const fieldValues = (field: FieldProps, values: TicketDetails | null) => {
    if (field.props.id === "createdBy" && mode === "create")
      return profile?.name;
    if (
      field.props.id === "assignedTo" &&
      mode === "update" &&
      !values?.assignedTo
    )
      return "NA";

    if (values) {
      const value = values[field.props.id as keyof TicketDetails];
      if (typeof value === "string") {
        return value;
      }

      if (Array.isArray(value) && value.length > 0) {
        return value.map((val, i) => (
          <div key={`${val.isInternal}-${i}`} className="text-sm my-1">
            <span>{val.content}</span>
            <div className="text-xs text-neutral-500 mt-0.5">
              <span>{new Date(val.createdAt).toLocaleString()} </span>
              <span>/ {val.createdBy ? val.createdBy.name : ""}</span>
            </div>
          </div>
        ));
      }
    }
  };

  const fakerValues = () => {
    const result = generateTicketInfo();

    setValue("description", result.description, {
      shouldValidate: true,
    });
    setValue("severity", result.severity, {
      shouldValidate: true,
    });
    setValue("comments", result.comments);
    setValue("intComments", "Internal Comments");
  };

  const handleonSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const response = await onSubmit(data);
      if (response) reset();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (values && mode === "update") {
      setValue("severity", values.severity);
      setValue("status", values.status);
      setValue("assignedTo", values.assignedTo);
      setValue("isLocked", values.isLocked);
      setValue("lockedBy", values.lockedBy);
    }
  }, [values, mode, setValue]);

  return (
    <form
      onSubmit={handleSubmit(handleonSubmit)}
      className={className}
      onFocus={(e) => {
        const tagName = e.target.tagName;
        if (profile && ["INPUT", "SELECT", "TEXTAREA"].includes(tagName)) {
          setValue("isLocked", true);
          setValue("lockedBy", profile.id);
        }
      }}
      {...props}
    >
      {gridOne && gridOne.length > 0 && (
        <div className="grid grid-cols-3 gap-12">
          {gridOne?.map((field, i) => {
            switch (field.name) {
              case "Span": {
                if (
                  profile?.role === "agent" &&
                  field.props.id === "status" &&
                  mode === "update"
                )
                  return null;
                if (
                  profile?.role === "agent" &&
                  field.props.id === "assignedTo" &&
                  mode === "update"
                )
                  return null;

                if (field.props.id === "application" && mode === "create")
                  return null;
                if (field.props.id === "description" && mode === "create")
                  return null;
                return (
                  <div key={`${field.name}-${i}`} className={field.grid}>
                    <Span {...(field.props as SpanProps)}>
                      {fieldValues(field, values)}
                    </Span>
                  </div>
                );
              }

              case "SelectGroup": {
                if (
                  profile?.role === "agent" &&
                  field.props.id === "status" &&
                  mode === "create"
                )
                  return null;
                if (field.props.id === "application" && mode === "update")
                  return null;
                return (
                  <div key={`${field.name}-${i}`} className={field.grid}>
                    <SelectGroup
                      {...(field.props.id
                        ? register(field.props.id as keyof FormValues, {
                            required:
                              field.props.id === "application" ||
                              field.props.id === "severity"
                                ? "*required"
                                : false,
                          })
                        : {})}
                      error={
                        field.props.id &&
                        errors[field.props.id as keyof FormValues]
                          ? errors[field.props.id as keyof FormValues]?.message
                          : null
                      }
                      {...(field.props as SelectGroupProps)}
                    >
                      {field.options ? (
                        field.options?.map((option) => {
                          return (
                            <option
                              key={`${field.name}-${option.props.value}`}
                              {...option.props}
                            >
                              {option.drop}
                            </option>
                          );
                        })
                      ) : (
                        <>
                          <option value="">Select Application</option>
                          {apps?.map((option) => {
                            return (
                              <option
                                key={`${field.name}-${option.id}`}
                                value={option.id}
                              >
                                {option.name}
                              </option>
                            );
                          })}
                        </>
                      )}
                    </SelectGroup>
                  </div>
                );
              }

              case "Input": {
                if (
                  profile?.role === "agent" &&
                  field.props.id === "assignedTo" &&
                  mode === "create"
                )
                  return null;
                if (field.props.id === "description" && mode === "update")
                  return null;
                return (
                  <div
                    key={`${field.name}-${i}`}
                    className={field.grid}
                    ref={field.props.id === "assignedName" ? assigneeRef : null}
                  >
                    <Input
                      {...(field.props.id !== "assignedName"
                        ? register(field.props.id as keyof FormValues, {
                            required:
                              field.props.id === "description"
                                ? "*required"
                                : false,
                          })
                        : {})}
                      error={
                        field.props.id &&
                        errors[field.props.id as keyof FormValues]
                          ? errors[field.props.id as keyof FormValues]?.message
                          : null
                      }
                      {...(field.props.id === "assignedName"
                        ? {
                            value: values?.assignedName
                              ? values.assignedName
                              : assignee,
                            onChange: (e) => {
                              setAssignee(e.target.value);
                              setIsAssigned(false);
                            },
                            disabled: values?.assignedName ? true : false,
                          }
                        : {})}
                      {...(field.props as Inputprops)}
                    />
                    {assignees && assignees.length > 0 && (
                      <div className="absolute border rounded max-h-30 overflow-y-auto w-full p-1 grid gap-1 z-10 bg-neutral-200">
                        {assignees.map((val, i) => (
                          <div
                            className="cursor-pointer border rounded px-1 py-0.5 bg-neutral-50"
                            key={`${val.id}-${i}`}
                            onClick={() => {
                              if (val.name) {
                                setValue("assignedTo", val.id);
                                setAssignee(val.name);
                                setIsAssigned(true);
                                setAssignees([]);
                              }
                            }}
                          >
                            {val.name}
                          </div>
                        ))}
                      </div>
                    )}
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
                if (field.props.id === "faker" && mode === "update")
                  return null;
                return (
                  <div key={`${field.name}-${i}`} className={field.grid}>
                    <Button
                      label={
                        field.props.id === "Submit" && isSubmitting
                          ? "Submitting..."
                          : "Submit"
                      }
                      onClick={
                        profile?.role === "agent" && field.target
                          ? () => toggleInternal(field)
                          : field.props.id === "faker"
                            ? fakerValues
                            : undefined
                      }
                      disabled={isSubmitting}
                      {...(field.props as ButtonProps)}
                    ></Button>
                  </div>
                );
              }

              case "TextArea": {
                return (
                  <div
                    key={`${field.name}-${i}`}
                    className={cn(
                      field.grid,
                      profile?.role === "agent" && field.name === "TextArea"
                        ? display(field)
                        : ""
                    )}
                  >
                    <TextArea
                      {...(field.props.id
                        ? register(field.props.id as keyof FormValues)
                        : {})}
                      {...(field.props as TextAreaProps)}
                    />
                  </div>
                );
              }

              case "Div": {
                return (
                  <div
                    key={`${field.name}-${i}`}
                    className={cn(
                      field.grid,
                      profile?.role === "agent" && field.name === "Div"
                        ? display(field)
                        : ""
                    )}
                  >
                    <Div {...(field.props as DivProps)}>
                      {fieldValues(field, values)}
                    </Div>
                  </div>
                );
              }

              case "Span": {
                if (
                  profile?.role === "agent" &&
                  field.props.id === "lockedBy" &&
                  mode === "create"
                )
                  return null;
                return (
                  <div key={`${field.name}-${i}`} className={field.grid}>
                    <Span {...(field.props as SpanProps)}>
                      {fieldValues(field, values)}
                    </Span>
                  </div>
                );
              }

              case "Input": {
                if (
                  profile?.role === "agent" &&
                  field.props.id === "isLocked" &&
                  mode === "create"
                )
                  return null;
                return (
                  <div key={`${field.name}-${i}`} className={field.grid}>
                    <Input
                      {...(field.props.id
                        ? register(field.props.id as keyof FormValues, {
                            disabled:
                              field.props.id === "isLocked" && values?.isLocked,
                            onChange:
                              field.props.id === "isLocked"
                                ? (event) => {
                                    if (profile && event.target.checked) {
                                      setValue("lockedBy", profile.id);
                                    } else {
                                      setValue("lockedBy", "");
                                    }
                                  }
                                : undefined,
                          })
                        : {})}
                      {...(field.props as Inputprops)}
                    />
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
