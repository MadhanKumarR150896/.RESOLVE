import { useAuthContext } from "../../context/AuthContext";
import { TicketForm } from "./TicketForm";
import type {
  FormValues,
  FunctionArgs,
  ReturnType,
} from "../../supabase/requiredTypes";
import { supabase } from "../../supabase/supabaseClient";
import { useFetchTicket } from "./fetchTicket";
import { useParams } from "react-router";
import { Spinner } from "../../utils/Spinner";
import { useQuery } from "@tanstack/react-query";
import { getApps } from "./getApps";

export type Mode = "update" | "create";

type Config = {
  create: string;
  update: string;
  className: string;
};

type RPCMethods =
  | "create_ticket_for_user"
  | "update_ticket_for_user"
  | "create_ticket_for_agent"
  | "update_ticket_for_agent";

const profileConfig: Record<"user" | "agent", Config> = {
  user: {
    create: "create_ticket_for_user",
    update: "update_ticket_for_user",
    className: "px-24 py-20 flex flex-col gap-12",
  },
  agent: {
    create: "create_ticket_for_agent",
    update: "update_ticket_for_agent",
    className: "px-24 py-20 flex flex-col gap-14",
  },
};

export const TicketPage = () => {
  const { profile } = useAuthContext();
  const { ticketDetails, isLoading } = useFetchTicket();
  const { data: apps = [] } = useQuery(getApps());
  const { ticketNumber } = useParams();

  const role = profile?.role as "user" | "agent";
  const mode: Mode = ticketNumber ? "update" : "create";
  const config = profileConfig[role];
  const rpcMethod = config[mode] as RPCMethods;

  const handleOnSubmit = async (formData: FormValues): Promise<ReturnType> => {
    const payload: FunctionArgs =
      role === "agent"
        ? mode === "create"
          ? {
              p_application: formData.application,
              p_severity: formData.severity,
              p_description: formData.description,
              p_comments: formData.comments,
              p_intcomments: formData.intComments,
            }
          : {
              p_ticketid: formData.ticketId,
              p_status: formData.status,
              p_severity: formData.severity,
              p_assignedto: formData.assignedTo ?? undefined,
              p_comments: formData.comments,
              p_intcomments: formData.intComments,
              p_islocked: formData.isLocked,
              p_lockedby: formData.lockedBy ?? undefined,
            }
        : mode === "create"
          ? {
              p_application: formData.application,
              p_severity: formData.severity,
              p_description: formData.description,
              p_comments: formData.comments,
            }
          : {
              p_ticketid: formData.ticketId,
              p_severity: formData.severity,
              p_comments: formData.comments,
            };

    const { data, error } = await supabase.rpc(rpcMethod, payload);
    if (error) throw error;
    return data;
  };

  if (ticketNumber && isLoading) return <Spinner />;

  return (
    <TicketForm
      onSubmit={handleOnSubmit}
      className={config.className}
      profile={profile}
      values={ticketDetails}
      apps={apps}
      mode={mode}
    />
  );
};
