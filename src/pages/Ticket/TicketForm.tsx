import { useEffect, useRef, useState } from "react";
import type {
  AppType,
  FormValues,
  ProfileType,
  ReturnType,
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
import {
  formConfig,
  isRequiredFields,
  notVisibleFields,
  type FieldContext,
  type FieldProps,
} from "./formField";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useForm, type SubmitHandler } from "react-hook-form";
import { generateTicketInfo } from "../../utils/ticketSamples";
import { supabase } from "../../supabase/supabaseClient";
import { useDebouncedAssignee, getAssignees } from "./getAssignees";
import { useQuery } from "@tanstack/react-query";
import { useToasterStore } from "../../store/toasterStore";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type FormProps = {
  onSubmit: (data: FormValues) => Promise<ReturnType>;
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
    formState: { errors, isSubmitting, isDirty },
    setValue,
    resetField,
    handleSubmit,
  } = useForm<FormValues>();
  const [intComView, setIntComView] = useState(false);
  const [intHisView, setIntHisView] = useState(false);
  const [assignee, setAssignee] = useState("");
  const [isAssigned, setIsAssigned] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const config = profile?.role ? formConfig[profile.role] : null;
  const gridOne = config?.filter((field) => field.group === "grid1");
  const gridTwo = config?.filter((field) => field.group === "grid2");
  const debouncedAssignee = useDebouncedAssignee(assignee, 300);
  const { data: assignees = [] } = useQuery({
    ...getAssignees(debouncedAssignee),
    enabled: !!debouncedAssignee && !isAssigned,
  });
  const assigneeRef = useRef<HTMLDivElement>(null);
  const updateToaster = useToasterStore((state) => state.updateToaster);

  const ticketLocked = values?.isLocked && values?.lockedBy !== profile?.id;
  const assigneeLocked =
    values?.assignedTo !== null && values?.assignedTo !== profile?.id;
  const ticketClosed = values?.status === "closed";

  const ctx: FieldContext = {
    role: profile?.role,
    mode,
  };

  useEffect(() => {
    const setValues = () => {
      if (values && mode === "update") {
        reset({
          ticketId: values.ticketId,
          severity: values.severity,
          status: values.status,
          assignedTo: values.assignedTo,
          isLocked: values.isLocked,
          lockedBy: values.lockedBy,
          comments: "",
          intComments: "",
        });
        if (values.assignedName) {
          setAssignee(values.assignedName);
          setIsAssigned(true);
        }
      }
    };
    setValues();
  }, [values, mode, reset]);

  useEffect(() => {
    const handleAssigneeDrop = (e: MouseEvent) => {
      if (
        assigneeRef.current &&
        !assigneeRef.current.contains(e.target as Node)
      )
        setShowDropdown(false);
    };

    document.addEventListener("mousedown", handleAssigneeDrop);

    return () => document.removeEventListener("mousedown", handleAssigneeDrop);
  }, [setShowDropdown]);

  const fieldValues = (field: FieldProps, values: TicketDetails | null) => {
    if (field.props.id === "createdBy" && mode === "create")
      return profile?.name;

    if (
      field.props.id === "assignedName" &&
      mode === "update" &&
      !values?.assignedTo
    )
      return "NA";

    if (
      field.props.id === "lockedName" &&
      mode === "update" &&
      !values?.lockedName
    )
      return null;

    if (values) {
      const value = values[field.props.id as keyof TicketDetails];
      if (typeof value === "string") {
        if (field.props.id === "lockedName") return `Locked by: ${value}`;
        return value;
      }
    }
  };

  const renderHistory = (field: FieldProps, values: TicketDetails | null) => {
    if (values) {
      const value = values[field.props.id as keyof TicketDetails];
      if (Array.isArray(value) && value.length > 0) {
        return value.map((val, i) => (
          <div key={`${val.is_internal}-${i}`} className="text-sm my-1">
            <span>{val.content}</span>
            <div className="text-xs text-neutral-500 mt-0.5">
              <span>{new Date(val.createdAt).toLocaleString()} </span>
              <span>/ {val.createdBy?.name ?? null}</span>
            </div>
          </div>
        ));
      }
    }
  };

  const toggleInternal = (field: FieldProps) => {
    if (field.target === "comments") {
      setIntComView(field.props.id === "commentsIntBt");
    }
    if (field.target === "history") {
      setIntHisView(field.props.id === "historyIntBt");
    }
  };

  const intDisplay = (field: FieldProps) => {
    if (field.name === "TextArea") {
      if (field.props.id === "comments" && intComView) return "hidden";
      if (field.props.id === "intComments" && !intComView) return "hidden";
    }

    if (field.name === "Div") {
      if (field.props.id === "history" && intHisView) return "hidden";
      if (field.props.id === "intHistory" && !intHisView) return "hidden";
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

  const handleIsLocked = async (checked: boolean) => {
    if (values && profile) {
      const { error } = await supabase
        .from("tickets")
        .update({
          is_locked: checked,
          locked_by: checked ? profile?.id : null,
        })
        .eq("id", values.ticketId);

      if (error) {
        setValue("isLocked", !checked);
        setValue("lockedBy", values.lockedBy);
      }
    }
  };

  const handleonSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const response = await onSubmit(data);
      if (response.success) {
        updateToaster({
          type: "success",
          message:
            response.message !== null ? response.message : "Successfully done",
        });
        if (mode === "create") reset();
        if (mode === "update") {
          resetField("comments");
          resetField("intComments");
        }
      }

      if (!response.success) {
        updateToaster({
          type: "error",
          message:
            response.message !== null ? response.message : "Please try again",
        });
      }
    } catch (error) {
      updateToaster({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleonSubmit)}
      className={className}
      {...props}
    >
      {gridOne && gridOne.length > 0 && (
        <div className="grid grid-cols-3 gap-12">
          {gridOne?.map((field, i) => {
            if (notVisibleFields(field, ctx)) return null;
            switch (field.name) {
              case "Span": {
                return (
                  <div key={`${field.name}-${i}`} className={field.grid}>
                    <Span {...(field.props as SpanProps)}>
                      {fieldValues(field, values)}
                    </Span>
                  </div>
                );
              }

              case "SelectGroup": {
                return (
                  <div key={`${field.name}-${i}`} className={field.grid}>
                    <SelectGroup
                      {...(field.props.id
                        ? register(field.props.id as keyof FormValues, {
                            required: isRequiredFields(field),
                            disabled: ticketLocked || ticketClosed,
                          })
                        : {})}
                      error={
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
                return (
                  <div
                    key={`${field.name}-${i}`}
                    className={field.grid}
                    ref={field.props.id === "assignedName" ? assigneeRef : null}
                  >
                    <Input
                      {...(field.props.id !== "assignedName"
                        ? register(field.props.id as keyof FormValues, {
                            required: isRequiredFields(field),
                            disabled: ticketLocked || ticketClosed,
                          })
                        : {})}
                      error={
                        errors[field.props.id as keyof FormValues]
                          ? errors[field.props.id as keyof FormValues]?.message
                          : null
                      }
                      {...(field.props.id === "assignedName"
                        ? {
                            value: assignee,
                            onChange: (e) => {
                              const val = e.target.value;
                              setAssignee(val);
                              if (val === "")
                                setValue("assignedTo", null, {
                                  shouldDirty: true,
                                });
                              setIsAssigned(false);
                              setShowDropdown(val.length > 2);
                            },
                            disabled:
                              ticketLocked || assigneeLocked || ticketClosed,
                            autoComplete: "off",
                          }
                        : {})}
                      {...(field.props as Inputprops)}
                    />
                    {assignees.length > 0 && showDropdown && (
                      <div className="absolute border rounded max-h-30 overflow-y-auto w-full p-1 grid gap-1 z-10 bg-neutral-200">
                        {assignees.map((val, i) => (
                          <div
                            className="cursor-pointer border rounded px-1 py-0.5 bg-neutral-50"
                            key={`${val.id}-${i}`}
                            onClick={() => {
                              if (val.name) {
                                setValue("assignedTo", val.id, {
                                  shouldDirty: true,
                                });
                                setAssignee(val.name);
                                setIsAssigned(true);
                                setShowDropdown(false);
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
            if (notVisibleFields(field, ctx)) return null;
            switch (field.name) {
              case "Button": {
                return (
                  <div key={`${field.name}-${i}`} className={field.grid}>
                    <Button
                      onClick={
                        profile?.role === "agent" && field.target
                          ? () => toggleInternal(field)
                          : field.props.id === "faker"
                            ? fakerValues
                            : undefined
                      }
                      disabled={
                        (field.props.id === "submit" && !isDirty) ||
                        isSubmitting ||
                        (field.props.id === "submit" && ticketLocked) ||
                        (field.props.id === "submit" && ticketClosed)
                      }
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
                        ? intDisplay(field)
                        : ""
                    )}
                  >
                    <TextArea
                      {...(field.props.id
                        ? register(field.props.id as keyof FormValues, {
                            disabled: ticketLocked || ticketClosed,
                          })
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
                        ? intDisplay(field)
                        : ""
                    )}
                  >
                    <Div {...(field.props as DivProps)}>
                      {renderHistory(field, values)}
                    </Div>
                  </div>
                );
              }

              case "Span": {
                return (
                  <div key={`${field.name}-${i}`} className={field.grid}>
                    <Span {...(field.props as SpanProps)}>
                      {fieldValues(field, values)}
                    </Span>
                  </div>
                );
              }

              case "Input": {
                return (
                  <div key={`${field.name}-${i}`} className={field.grid}>
                    <Input
                      {...(field.props.id
                        ? register(field.props.id as keyof FormValues, {
                            disabled: ticketLocked || ticketClosed,
                            onChange:
                              field.props.id === "isLocked"
                                ? (e) => handleIsLocked(e.target.checked)
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
