import { Link } from "react-router";
import { TicketsContainer } from "./TicketsContainer";
import { useAuthContext } from "../../context/AuthContext";
import { useTicketsChannel } from "./useTicketsChannel";
import { SearchComponent } from "../../utils/SearchComponent";
import { useQuery } from "@tanstack/react-query";
import { getMetrics } from "./getMetrics";
import { getAOTC } from "./getAOTC";
import { MetricsBox } from "./MetricsBox";
import { cn } from "../../utils/classMerger";

const TicketsDashboard = () => {
  useTicketsChannel();
  const { profile } = useAuthContext();
  const profileRole = profile ? profile.role : null;
  const { data: metrics, isLoading: metricsLoading } = useQuery(
    getMetrics(profile)
  );
  const { data: aotc, isLoading: aotcLoading } = useQuery(getAOTC(profile));

  const open = metrics?.openCount ?? null;
  const active = metrics?.activeCount ?? null;

  return (
    <>
      <div className="p-4 flex gap-4 items-center">
        {profileRole === "agent" && (
          <div className="flex-3 flex gap-4">
            <MetricsBox count={open} isLoading={metricsLoading} label="Open" />
            <MetricsBox
              count={active}
              isLoading={metricsLoading}
              label="Active"
            />
            <MetricsBox
              count={aotc ?? null}
              isLoading={aotcLoading}
              label="Owned"
            />
          </div>
        )}
        <div
          className={cn(
            "flex flex-col gap-2",
            profileRole === "user" ? "py-12 mx-auto" : "flex-1"
          )}
        >
          <SearchComponent profileRole={profileRole} />
          <Link to={`/dashboard/${profileRole}/ticket`}>
            <div className="bg-neutral-900 text-neutral-100 text-center rounded py-2 hover:cursor-pointer hover:bg-neutral-800 font-semibold">
              Create Ticket
            </div>
          </Link>
        </div>
      </div>
      <TicketsContainer />
    </>
  );
};

export default TicketsDashboard;
