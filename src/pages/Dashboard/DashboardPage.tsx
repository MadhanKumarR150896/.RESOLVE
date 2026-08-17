import { Link } from "react-router";
import { TicketsContainer } from "./TicketsContainer";
import { useAuthContext } from "../../contexts/AuthContext";
import { useDashboardChannel } from "../../channels/dashboardChannel";
import { SearchComp } from "../../components/SearchComp";
import { useQuery } from "@tanstack/react-query";
import { useFetchAOTC, useFetchMetrics } from "../../services/ticketService";
import { AgentMetrics } from "./AgentMetrics";
import { cn } from "../../utils/classMerger";
import type { DragEvent } from "react";
import type { metricUpdate } from "../../supabase/requiredTypes";
import { supabase } from "../../supabase/supabaseClient";
import { useToasterStore } from "../../stores/toasterStore";

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

  const updateToaster = useToasterStore((state) => state.updateToaster);

  const open = metrics?.openCount ?? 0;
  const active = metrics?.activeCount ?? 0;

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const data: metricUpdate = JSON.parse(
      e.dataTransfer.getData("application/json")
    );

    try {
      if (e.currentTarget.id === "activeCount") {
        if (data.status === "active") return;
        const { error } = await supabase
          .from("tickets")
          .update({
            status: "active",
          })
          .eq("id", data.id);

        if (error) throw new Error(error.message);
      } else if (e.currentTarget.id === "ownedCount") {
        if (data.assigned_to === profile?.id) return;
        const { error } = await supabase
          .from("tickets")
          .update({
            assigned_to: profile?.id,
          })
          .eq("id", data.id);

        if (error) throw new Error(error.message);
      }
      updateToaster({
        type: "success",
        message: `Ticket ${data.ticket_number} is updated`,
      });
    } catch (err) {
      updateToaster({
        type: "error",
        message:
          err instanceof Error ? err.message : "An unexpected error occurred",
      });
    }
  };

  return (
    <>
      <div className="p-10 flex gap-4 items-center">
        {profileRole === "agent" && (
          <div className="flex-3 flex gap-4">
            <AgentMetrics
              count={open}
              isLoading={metricsLoading}
              dropTarget={false}
              id="openCount"
              label="Open"
            />
            <AgentMetrics
              count={active}
              isLoading={metricsLoading}
              dropTarget={true}
              id="activeCount"
              label="Active"
              handleDrop={handleDrop}
            />
            <AgentMetrics
              count={aotc ?? null}
              isLoading={aotcLoading}
              dropTarget={true}
              id="ownedCount"
              label="Owned"
              handleDrop={handleDrop}
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
