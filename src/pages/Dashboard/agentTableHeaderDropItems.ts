import { useQuery } from "@tanstack/react-query";
import type { DropId, DropItemProps } from "../../utils/StaticDrop";
import { useFetchApps } from "../../services/appService";
import { useFetchAgents } from "../../services/profileService";

export const useGetDropItems = (): Partial<Record<DropId, DropItemProps[]>> => {
  const { data: apps = [] } = useQuery(useFetchApps());
  const { data: agents = [] } = useQuery(useFetchAgents());
  return {
    ticketNumber: ["Ascending", "Descending"].map((item) => ({
      name: item,
      icon: {
        name: item === "Ascending" ? "ascending" : "descending",
      },
    })),
    createdAt: ["Ascending", "Descending"].map((item) => ({
      name: item,
      icon: {
        name: item === "Ascending" ? "ascending" : "descending",
      },
    })),
    status: ["open", "active", "deferred", "resolved", "closed"].map(
      (item) => ({
        name: item,
        icon: {
          name: "status",
        },
      })
    ),
    severity: ["sev 1", "sev 2", "sev 3", "sev 4", "sev 5"].map((item) => ({
      name: item,
      icon: {
        name: "severity",
      },
    })),
    application: apps.map((app) => ({
      name: app.name,
      icon: {
        name: "application",
      },
    })),
    assignedTo: agents.map((agent) => ({
      name: agent.name ?? "Agent X",
      icon: {
        name: "profile",
      },
    })),
  };
};
