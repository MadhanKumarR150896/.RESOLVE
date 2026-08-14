import { Link } from "react-router";
import { TicketsContainer } from "./TicketsContainer";
import { useAuthContext } from "../../contexts/AuthContext";
import { useDashboardChannel } from "../../channels/dashboardChannel";
import { SearchComp } from "../../components/SearchComp";
import { useQuery } from "@tanstack/react-query";
import { useFetchAOTC, useFetchMetrics } from "../../services/ticketService";
import { AgentMetrics } from "./AgentMetrics";
import { cn } from "../../utils/classMerger";

const DashboardPage = () => {
  useDashboardChannel();
  const { profile } = useAuthContext();
  const profileRole = profile ? profile.role : null;
  const { data: metrics, isLoading: metricsLoading } = useQuery(
    useFetchMetrics(profile)
  );
  const { data: aotc, isLoading: aotcLoading } = useQuery(
    useFetchAOTC(profile)
  );

  const open = metrics?.openCount ?? null;
  const active = metrics?.activeCount ?? null;

  return (
    <>
      <div
        className={`${profileRole === "agent" ? "p-8" : "p-10"} flex gap-4 items-center`}
      >
        {profileRole === "agent" && (
          <div className="flex-3 flex gap-4">
            <AgentMetrics
              count={open}
              isLoading={metricsLoading}
              label="Open"
            />
            <AgentMetrics
              count={active}
              isLoading={metricsLoading}
              label="Active"
            />
            <AgentMetrics
              count={aotc ?? null}
              isLoading={aotcLoading}
              label="Owned"
            />
          </div>
        )}
        <div
          className={cn(
            "flex flex-col gap-2",
            profileRole === "user" ? "h-30 justify-center mx-auto" : "flex-1"
          )}
        >
          <SearchComp profileRole={profileRole} />
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

export default DashboardPage;
