import { useAuthContext } from "../../context/AuthContext";
import { useGetApps } from "../../supabase/getApps";
import { TicketForm } from "../components/TicketForm";
import { type SubmitHandler } from "react-hook-form";
import type { FormValues } from "../../supabase/requiredTypes";
import { supabase } from "../../supabase/supabaseClient";
import { useFetchTicket } from "../../supabase/fetchTicket";
import { useParams } from "react-router";
import { Spinner } from "../../utils/Spinner";

export const UserTicketForm = () => {
  const { profile } = useAuthContext();
  const { ticketDetails, isLoading } = useFetchTicket();
  const { apps } = useGetApps();
  const { ticketNumber } = useParams();

  const createUserTicket: SubmitHandler<FormValues> = async (formData) => {
    try {
      const { data, error } = await supabase.rpc("create_ticket_for_user", {
        p_application: formData.application,
        p_severity: formData.severity,
        p_description: formData.description,
        p_comments: formData.comments,
      });

      if (error || !data.success) throw error;
      return data.success;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const updateUserTicket: SubmitHandler<FormValues> = async (formData) => {
    try {
      const { data, error } = await supabase.rpc("update_ticket_for_user", {
        p_ticketid: formData.ticketId,
        p_severity: formData.severity,
        p_comments: formData.comments,
      });

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
      onSubmit={ticketNumber ? updateUserTicket : createUserTicket}
      className="px-24 py-20 flex flex-col gap-12"
      profile={profile}
      values={ticketDetails}
      apps={apps}
      mode={ticketNumber ? "update" : "create"}
    />
  );
};
