import { useAuthContext } from "../../context/AuthContext";
import { useGetApps } from "../../supabase/getApps";
import { TicketForm } from "../components/TicketForm";
import type { SubmitHandler } from "react-hook-form";
import type { FormValues } from "../../supabase/requiredTypes";
import { supabase } from "../../supabase/supabaseClient";
import { useFetchTicket } from "../../supabase/fetchTicket";
import { useParams } from "react-router";
import { Spinner } from "../../utils/Spinner";

export const AgentTicketForm = () => {
  const { profile } = useAuthContext();
  const { ticketDetails, isLoading, fetchTicketDetails } = useFetchTicket();
  const { apps } = useGetApps();
  const { ticketNumber } = useParams();

  const createAgentTicket: SubmitHandler<FormValues> = async (formData) => {
    try {
      const { data, error } = await supabase.rpc("create_ticket_for_agent", {
        p_application: formData.application,
        p_severity: formData.severity,
        p_description: formData.description,
        p_comments: formData.comments,
        p_intcomments: formData.intComments,
      });

      console.log(data);
      if (error || !data.success) throw error;
      return data.success;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const updateAgentTicket: SubmitHandler<FormValues> = async (formData) => {
    try {
      const { data, error } = await supabase.rpc("update_ticket_for_agent", {
        p_ticketid: formData.ticketId,
        p_status: formData.status,
        p_severity: formData.severity,
        p_assignedto: formData.assignedTo ?? undefined,
        p_comments: formData.comments,
        p_intcomments: formData.intComments,
        p_islocked: formData.isLocked,
        p_lockedby: formData.lockedBy ?? undefined,
      });

      console.log(data);
      if (error || !data.success) throw error;
      return data.success;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  if (ticketNumber && isLoading) return <Spinner />;

  return (
    <TicketForm
      onSubmit={ticketNumber ? updateAgentTicket : createAgentTicket}
      className="px-24 py-20 flex flex-col gap-14"
      profile={profile}
      values={ticketDetails}
      reFetchTicket={fetchTicketDetails}
      apps={apps}
      mode={ticketNumber ? "update" : "create"}
    />
  );
};
