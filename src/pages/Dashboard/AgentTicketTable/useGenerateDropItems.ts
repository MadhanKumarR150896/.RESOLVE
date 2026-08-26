import { useQuery } from "@tanstack/react-query";
import type { DropId, DropItemProps } from "../../../utils/StaticDrop";
import { useFetchApps } from "../../../services/appService";
import { useFetchAgents } from "../../../services/profileService";
import { useConstructParams } from "./useConstructParams";
import type { Tickets } from "../../../supabase/requiredTypes";
import { useSearchParams } from "react-router";

export const useGenerateDropItems = (): Partial<
  Record<DropId, DropItemProps[]>
> => {
  const { data: apps = [] } = useQuery(useFetchApps());
  const { data: agents = [] } = useQuery(useFetchAgents());
  const { updateSortParam, updateFilterParam } = useConstructParams();
  const [searchParams] = useSearchParams();

  return {
    ticketNumber: ["Ascending", "Descending"].map((item) => ({
      name: item,
      props: {
        onSelect: () =>
          updateSortParam({
            type: "sort",
            field: "ticketNumber",
            val: item === "Ascending" ? "asc" : "desc",
          }),
      },
      icon: {
        name: item === "Ascending" ? "ascending" : "descending",
      },
      selected: {
        state: searchParams.has(
          "sort",
          `ticketNumber:${item === "Ascending" ? "asc" : "desc"}`
        ),
        name: "check",
      },
    })),
    createdAt: ["Ascending", "Descending"].map((item) => ({
      name: item,
      props: {
        onSelect: () =>
          updateSortParam({
            type: "sort",
            field: "createdAt",
            val: item === "Ascending" ? "asc" : "desc",
          }),
      },
      icon: {
        name: item === "Ascending" ? "ascending" : "descending",
      },
      selected: {
        state: searchParams.has(
          "sort",
          `createdAt:${item === "Ascending" ? "asc" : "desc"}`
        ),
        name: "check",
      },
    })),
    status: ["open", "active", "deferred", "resolved", "closed"].map(
      (item) => ({
        name: item,
        props: {
          onSelect: (e) => {
            e.preventDefault();
            updateFilterParam({
              type: "filter",
              field: "status",
              val: item as Tickets["status"],
            });
          },
        },
        icon: {
          name: "status",
        },
        selected: {
          state: searchParams.has("filter", `status:${item}`),
          name: "check",
        },
      })
    ),
    severity: ["sev 1", "sev 2", "sev 3", "sev 4", "sev 5"].map((item) => ({
      name: item,
      props: {
        onSelect: (e) => {
          e.preventDefault();
          updateFilterParam({
            type: "filter",
            field: "severity",
            val: item as Tickets["severity"],
          });
        },
      },
      icon: {
        name: "severity",
      },
      selected: {
        state: searchParams.has("filter", `severity:${item}`),
        name: "check",
      },
    })),
    application: apps.map((app) => ({
      name: app.name,
      props: {
        onSelect: (e) => {
          e.preventDefault();
          updateFilterParam({
            type: "filter",
            field: "application",
            val: app.name,
          });
        },
      },
      icon: {
        name: "application",
      },
      selected: {
        state: searchParams.has("filter", `application:${app.name}`),
        name: "check",
      },
    })),
    assignedTo: agents.map((agent) => ({
      name: agent.name ?? "Agent X",
      props: {
        onSelect: (e) => {
          e.preventDefault();
          updateFilterParam({
            type: "filter",
            field: "assignedTo",
            val: agent.name ?? "Agent X",
          });
        },
      },
      icon: {
        name: "profile",
      },
      selected: {
        state: searchParams.has("filter", `assignedTo:${agent.name}`),
        name: "check",
      },
    })),
    updatedAt: ["Ascending", "Descending"].map((item) => ({
      name: item,
      props: {
        onSelect: () =>
          updateSortParam({
            type: "sort",
            field: "updatedAt",
            val: item === "Ascending" ? "asc" : "desc",
          }),
      },
      icon: {
        name: item === "Ascending" ? "ascending" : "descending",
      },
      selected: {
        state: searchParams.has(
          "sort",
          `updatedAt:${item === "Ascending" ? "asc" : "desc"}`
        ),
        name: "check",
      },
    })),
  };
};
