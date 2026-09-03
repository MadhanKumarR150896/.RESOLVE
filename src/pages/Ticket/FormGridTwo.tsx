import { useParams } from "react-router";
import { useAuthContext } from "../../contexts/AuthContext";
import type { FormValues } from "../../supabase/requiredTypes";
import { cn } from "../../utils/classMerger";
import {
  Button,
  Div,
  Input,
  Span,
  TextArea,
  type ButtonProps,
  type DivProps,
  type Inputprops,
  type SpanProps,
  type TextAreaProps,
} from "../../utils/Reusables";
import { useQuery } from "@tanstack/react-query";
import { useFetchTicket } from "../../services/ticketService";
import type { GridProps } from "./TicketForm";
import { fieldValues, notVisibleFields } from "./formUtils";
import { useFormContext } from "react-hook-form";
import type { FieldProps } from "./formConfig";
import { useState } from "react";
import { useToasterStore } from "../../stores/toasterStore";
import { supabase } from "../../supabase/supabaseClient";
import { generateTicketInfo } from "./ticketSamples";
import { CommentsHistory } from "./CommentsHistory";
import { LockIcon, UnlockIcon } from "lucide-react";

const icon = {
  lock: LockIcon,
  unlock: UnlockIcon,
};

export const FormGridTwo = ({
  gridElements,
  ctx,
  mode,
  ticketClosed,
  ticketLocked,
  ticketResolved,
}: GridProps) => {
  const {
    register,
    setValue,
    formState: { isSubmitting, isDirty },
  } = useFormContext<FormValues>();
  const { profile } = useAuthContext();
  const { ticketNumber } = useParams();
  const { data: values } = useQuery(useFetchTicket(ticketNumber));
  const updateToaster = useToasterStore((state) => state.updateToaster);
  const [intComView, setIntComView] = useState(false);
  const [intHisView, setIntHisView] = useState(false);

  const toggleInternal = (field: FieldProps) => {
    if (field.target === "comments") {
      setIntComView(field.props.id === "commentsIntBt");
    } else if (field.target === "history") {
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

  const handleIsLocked = async (checked: boolean) => {
    try {
      if (values && profile) {
        const { error } = await supabase
          .from("tickets")
          .update({
            is_locked: checked,
            locked_by: checked ? profile?.id : null,
            status: values.status === "open" ? "active" : values.status,
          })
          .eq("id", values.ticketId);

        if (error) {
          setValue("isLocked", !checked);
          setValue("lockedBy", values.lockedBy);
          setValue("status", values.status);
          throw new Error(error.message);
        }

        updateToaster({
          type: "success",
          id: crypto.randomUUID(),
          message: `Ticket ${values.ticketNumber} is updated`,
        });
      }
    } catch (err) {
      updateToaster({
        type: "error",
        id: crypto.randomUUID(),
        message:
          err instanceof Error ? err.message : "An unexpected error occurred",
      });
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

  return (
    <div className="grid grid-cols-2 gap-y-3 gap-x-12">
      {gridElements?.map((field, i) => {
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
                    isSubmitting ||
                    (field.props.id === "submit" &&
                      mode === "update" &&
                      (!isDirty || ticketLocked || ticketClosed))
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
                  {(field.props.id === "history" ||
                    field.props.id === "intHistory") && (
                    <CommentsHistory value={values?.[field.props.id]} />
                  )}
                </Div>
              </div>
            );
          }

          case "Span": {
            return (
              <div key={`${field.name}-${i}`} className={field.grid}>
                <Span
                  {...(field.props as SpanProps)}
                  className={cn(
                    field.props.className,
                    values?.isLocked === false ? "border-none" : ""
                  )}
                >
                  {fieldValues(field, values, profile, mode)}
                </Span>
              </div>
            );
          }

          case "Input": {
            const hasIcon =
              field.props.id === "isLocked" && values?.isLocked
                ? "lock"
                : "unlock";
            const Icon = icon[hasIcon];
            return (
              <div key={`${field.name}-${i}`} className={field.grid}>
                {hasIcon && <Icon size={26} className="-mbe-6" color="black" />}
                <Input
                  {...(field.props.id
                    ? register(field.props.id as keyof FormValues, {
                        disabled:
                          ticketLocked || ticketClosed || ticketResolved,
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
  );
};
