import { Link } from "react-router";
import { useAuthContext } from "../../context/AuthContext";
import { SearchComponent } from "../../utils/SearchComponent";
import { getMetrics } from "./getMetrics";
import { useQuery } from "@tanstack/react-query";
import { MetricsBox } from "./MetricsBox";
import { getAOTC } from "./getAOTC";

const AgentDashboard = () => {
  const { profile } = useAuthContext();
  const profileRole = profile ? profile.role : null;
  const { data, isLoading } = useQuery(getMetrics(profile));
  const { data: aotc, isLoading: aotcLoading } = useQuery(getAOTC(profile?.id));

  const open = data?.openCount ?? null;
  const active = data?.activeCount ?? null;

  return (
    <>
      <div className="grid grid-cols-4 p-4 gap-4">
        <MetricsBox count={open} isLoading={isLoading} label="Open" />
        <MetricsBox count={active} isLoading={isLoading} label="Active" />
        <MetricsBox
          count={aotc ?? null}
          isLoading={aotcLoading}
          label="Owned"
        />
        <div className="col-4 flex flex-col gap-4 justify-center">
          <SearchComponent profileRole={profileRole} />
          <Link to={`/dashboard/${profileRole}/ticket`}>
            <div className="bg-neutral-900 text-neutral-100 text-center rounded py-2 hover:cursor-pointer hover:bg-neutral-800 font-semibold">
              Create Ticket
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default AgentDashboard;
