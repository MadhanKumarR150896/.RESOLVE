import { useState } from "react";
import type {
  AppType,
  FormValues,
  ProfileType,
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
} from "./ReusableElements";
import { formConfig, type FieldProps } from "./formField";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useForm, type SubmitHandler } from "react-hook-form";
import { generateTicketInfo } from "../../utils/ticketSamples";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type FormProps = {
  onSubmit: SubmitHandler<FormValues>;
  profile?: ProfileType | null;
  apps?: AppType[] | null;
  mode?: "create" | "update";
} & Omit<React.FormHTMLAttributes<HTMLFormElement>, "onSubmit">;

export const TicketForm = ({
  onSubmit,
  className,
  profile,
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

  const children = (field: FieldProps) => {
    if (field.name === "Span") {
      if (field.props.id === "createdBy" && mode === "create")
        return profile?.name;
      return "";
    }
  };

  const fakerValues = () => {
    const result = generateTicketInfo();

    setValue("description", result.description, {
      shouldValidate: true,
    });
    setValue("severity", result.severity);
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

  return (
    <form
      onSubmit={handleSubmit(handleonSubmit)}
      className={className}
      {...props}
    >
      {gridOne && gridOne.length > 0 && (
        <div className="grid grid-cols-3 gap-12">
          {gridOne?.map((field, i) => {
            switch (field.name) {
              case "Span": {
                if (profile?.role === "agent") {
                  if (field.props.id === "status" && mode === "update")
                    return null;
                  if (field.props.id === "assignedTo" && mode === "update")
                    return null;
                }
                return (
                  <div key={`${field.name}-${i}`} className={field.grid}>
                    <Span {...(field.props as SpanProps)}>
                      {field.name === "Span" ? children(field) : ""}
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
                return (
                  <div key={`${field.name}-${i}`} className={field.grid}>
                    <SelectGroup
                      {...(field.props.id
                        ? register(field.props.id as keyof FormValues, {
                            required:
                              field.props.id === "application"
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
                return (
                  <div key={`${field.name}-${i}`} className={field.grid}>
                    <Input
                      {...(field.props.id
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
                      {...(field.props as Inputprops)}
                    />
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
                        : "",
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
                        : "",
                    )}
                  >
                    <Div {...(field.props as DivProps)}></Div>
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
                      {field.name === "Span" ? children(field) : ""}
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
                        ? register(field.props.id as keyof FormValues)
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
