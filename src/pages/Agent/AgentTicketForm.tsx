import { useOutletContext } from "react-router";
import { useAuthContext } from "../../context/AuthContext";
import { useGetApps } from "../../supabase/getApps";
import { TicketForm } from "../components/TicketForm";
import type { SubmitHandler } from "react-hook-form";
import type { FormValues } from "../../supabase/requiredTypes";
import { supabase } from "../../supabase/supabaseClient";

export const AgentTicketForm = () => {
  const { profile } = useAuthContext();
  const ticketId = useOutletContext<string | null>();
  const { Apps } = useGetApps();

  const createAgentTicket: SubmitHandler<FormValues> = async (formData) => {
    try {
      const { data, error } = await supabase.rpc("create_ticket_for_agent", {
        p_application: formData.application,
        p_severity: formData.severity,
        p_description: formData.description,
        p_comments: formData.comments,
        p_intcomments: formData.intComments,
      });

      if (error || !data.success) throw error;

      console.log(data);
      return data.success;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const updateUserTicket = () => {
    console.log("agent update");
  };

  return (
    <TicketForm
      onSubmit={ticketId ? updateUserTicket : createAgentTicket}
      className="px-24 py-20 flex flex-col gap-14"
      profile={profile}
      apps={Apps}
      mode={ticketId ? "update" : "create"}
    />
  );
};
