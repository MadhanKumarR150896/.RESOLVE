import { useAuthContext } from "../../context/AuthContext";
import { useGetApps } from "../../supabase/getApps";
import { TicketForm } from "../components/TicketForm";

export const UserTicketForm = () => {
  const { profile } = useAuthContext();
  const { Apps } = useGetApps();
  return (
    <TicketForm
      className="px-24 py-20 flex flex-col gap-12"
      profile={profile}
      apps={Apps}
      mode="create"
    />
  );
};
