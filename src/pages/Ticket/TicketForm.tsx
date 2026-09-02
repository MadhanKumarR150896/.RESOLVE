import { useState } from "react";
import type {
  FormValues,
  ProfileType,
  ReturnType,
  TicketDetails,
} from "../../supabase/requiredTypes";
import { formConfig, type FieldContext, type FieldProps } from "./formConfig";
import { FormProvider, useForm, type SubmitHandler } from "react-hook-form";
import { useToasterStore } from "../../stores/toasterStore";
import { FormGridOne } from "./FormGridOne";
import { FormGridTwo } from "./FormGridTwo";

export type GridProps = {
  gridElements: FieldProps[] | undefined;
  ctx: FieldContext;
  mode: "create" | "update";
  assignee?: string;
  setAssignee?: React.Dispatch<React.SetStateAction<string>>;
  isAssigned?: boolean;
  setIsAssigned?: React.Dispatch<React.SetStateAction<boolean>>;
  ticketLocked: boolean;
  ticketClosed: boolean;
  ticketResolved?: boolean;
};

type FormProps = {
  onSubmit: (data: FormValues) => Promise<ReturnType>;
  profile: ProfileType | null;
  values: TicketDetails | null;
  mode: "create" | "update";
} & Omit<React.FormHTMLAttributes<HTMLFormElement>, "onSubmit">;

export const TicketForm = ({
  onSubmit,
  className,
  profile,
  values,
  mode,
  ...props
}: FormProps) => {
  const methods = useForm<FormValues>();
  const [assignee, setAssignee] = useState("");
  const [isAssigned, setIsAssigned] = useState(false);
  const updateToaster = useToasterStore((state) => state.updateToaster);
  const { reset, resetField, handleSubmit } = methods;

  const config = profile?.role ? formConfig[profile.role] : null;
  const gridOne = config?.filter((field) => field.group === "grid1");
  const gridTwo = config?.filter((field) => field.group === "grid2");

  const ticketLocked = values?.isLocked
    ? values?.lockedBy !== profile?.id
    : values?.lockedBy === profile?.id;
  const ticketClosed = values?.status === "closed";
  const ticketResolved = values?.status === "resolved";

  const ctx: FieldContext = {
    role: profile?.role,
    mode,
  };

  const handleonSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const response = await onSubmit(data);
      console.log(response);
      if (response.success) {
        updateToaster({
          type: "success",
          id: crypto.randomUUID(),
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
        if (values && mode === "update") {
          reset({
            ticketId: values.ticketId,
            severity: values.severity,
            status: values.status,
            assignedTo: values.assignedTo,
            isLocked: values.isLocked,
            lockedBy: values.lockedBy,
          });
          if (values.assignedName) {
            setAssignee(values.assignedName);
            setIsAssigned(true);
          }
        }

        throw new Error(response.message ?? undefined);
      }
    } catch (error) {
      updateToaster({
        type: "error",
        id: crypto.randomUUID(),
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(handleonSubmit)}
        className={className}
        {...props}
      >
        {gridOne && gridOne.length > 0 && (
          <FormGridOne
            gridElements={gridOne}
            ctx={ctx}
            assignee={assignee}
            setAssignee={setAssignee}
            isAssigned={isAssigned}
            setIsAssigned={setIsAssigned}
            ticketClosed={ticketClosed}
            ticketLocked={ticketLocked}
            mode={mode}
          />
        )}
        {gridTwo && gridTwo.length > 0 && (
          <FormGridTwo
            gridElements={gridTwo}
            ctx={ctx}
            mode={mode}
            ticketClosed={ticketClosed}
            ticketLocked={ticketLocked}
            ticketResolved={ticketResolved}
          />
        )}
      </form>
    </FormProvider>
  );
};
