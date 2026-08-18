import { useEffect, useRef, useState } from "react";
import type { FormValues } from "../../supabase/requiredTypes";
import {
  Input,
  SelectGroup,
  Span,
  type Inputprops,
  type SelectGroupProps,
  type SpanProps,
} from "../../utils/Reusables";
import { useQuery } from "@tanstack/react-query";
import { useFetchAssignees } from "../../services/profileService";
import { useDebouncedValue } from "../../utils/debounce";
import { useAuthContext } from "../../contexts/AuthContext";
import { useParams } from "react-router";
import { useFetchTicket } from "../../services/ticketService";
import { useFetchApps } from "../../services/appService";
import type { GridProps } from "./TicketForm";
import { fieldValues, isRequiredFields, notVisibleFields } from "./formUtils";
import { useFormContext } from "react-hook-form";

export const FormGridOne = ({
  gridElements,
  ctx,
  mode,
  assignee,
  setAssignee,
  isAssigned,
  setIsAssigned,
  ticketClosed,
  ticketLocked,
}: GridProps) => {
  const {
    register,
    reset,
    formState: { errors },
    setValue,
  } = useFormContext<FormValues>();
  const { profile } = useAuthContext();
  const { ticketNumber } = useParams();
  const { data: values } = useQuery(useFetchTicket(ticketNumber));
  const { data: apps = [] } = useQuery({
    ...useFetchApps(),
    enabled: !ticketNumber,
  });
  const [showDropdown, setShowDropdown] = useState(false);
  const assigneeRef = useRef<HTMLDivElement>(null);
  const debouncedAssignee = useDebouncedValue(assignee ?? "", 300, 3);
  const { data: assignees = [] } = useQuery({
    ...useFetchAssignees(debouncedAssignee),
    enabled: !!values?.ticketId && !!debouncedAssignee && !isAssigned,
  });

  const assigneeLocked =
    values?.assignedTo !== null && values?.assignedTo !== profile?.id;

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
          setAssignee?.(values.assignedName);
          setIsAssigned?.(true);
        }
      }
    };
    setValues();
  }, [values, mode, reset, setAssignee, setIsAssigned]);

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

  return (
    <div className="grid grid-cols-3 gap-12">
      {gridElements?.map((field, i) => {
        if (notVisibleFields(field, ctx)) return null;
        switch (field.name) {
          case "Span": {
            return (
              <div key={`${field.name}-${i}`} className={field.grid}>
                <Span {...(field.props as SpanProps)}>
                  {fieldValues(field, values, profile, mode)}
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
                          setAssignee?.(val);
                          if (val === "")
                            setValue("assignedTo", null, {
                              shouldDirty: true,
                            });
                          setIsAssigned?.(false);
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
                  <div className="absolute text-sm border rounded max-h-30 overflow-y-auto w-full p-1 grid gap-1 z-10 bg-neutral-200">
                    {assignees.map((val, i) => (
                      <div
                        className="cursor-pointer border rounded px-1 py-0.5 bg-neutral-50"
                        key={`${val.id}-${i}`}
                        onClick={() => {
                          if (val.name) {
                            setValue("assignedTo", val.id, {
                              shouldDirty: true,
                            });
                            setAssignee?.(val.name);
                            setIsAssigned?.(true);
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
  );
};
