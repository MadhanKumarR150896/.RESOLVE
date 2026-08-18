import type { ProfileType, TicketDetails } from "../../supabase/requiredTypes";
import type { FieldContext, FieldProps } from "./formConfig";

export const notVisibleFields = (field: FieldProps, ctx: FieldContext) => {
  if (!field.notVisible) return false;

  return field.notVisible(ctx);
};

export const isRequiredFields = (field: FieldProps) => {
  if (!field.isRequired) return false;

  return field.isRequired();
};

export const fieldValues = (
  field: FieldProps,
  values: TicketDetails | undefined,
  profile: ProfileType | null,
  mode: "create" | "update"
) => {
  if (field.props.id === "createdBy" && mode === "create") return profile?.name;

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
