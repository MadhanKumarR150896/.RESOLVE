import { Link } from "react-router";
import { UserTicketsGrid } from "./UserTicketsGrid";
import { useAuthContext } from "../../context/AuthContext";

import { useUserDashChannel } from "../supabaseUtils/useUserDashChannel";
import { SearchComponent } from "../../utils/SearchComponent";

const UserDashboard = () => {
  useUserDashChannel();
  const { profile } = useAuthContext();
  const profileRole = profile ? profile.role : null;

  return (
    <>
      <div className="py-16 flex flex-col gap-2 mx-auto">
        <SearchComponent profileRole={profileRole} />
        <Link to={`/dashboard/${profileRole}/ticket`}>
          <div className="bg-neutral-900 text-neutral-100 text-center rounded py-2 hover:cursor-pointer hover:bg-neutral-800 font-semibold">
            Create Ticket
          </div>
        </Link>
      </div>
      <UserTicketsGrid role={profileRole} />
    </>
  );
};

export default UserDashboard;
