import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import type {
  FullTicket,
  Metrics,
  ProfileType,
  TicketDetails,
} from "../supabase/requiredTypes";
import { supabase } from "../supabase/supabaseClient";
import { formatDate } from "../utils/formatDate";
import type { Param } from "../pages/Dashboard/AgentTicketTable/useConstructParams";

const field = {
  ticketNumber: "ticket_number",
  createdAt: "created_at",
  updatedAt: "updated_at",
  status: "status",
  application: "app_id",
  severity: "severity",
  assignedTo: "assigned_to",
} as const;

const fetchTicket = async (ticketNumber: string): Promise<TicketDetails> => {
  const { data, error } = await supabase
    .from("tickets")
    .select(
      ` id,
        ticket_number,
        created_at,
        created_by:profiles!created_by(name),
        status,
        app:apps(name),
        severity,
        description,       
        assigned:profiles!assigned_to(id,name),
        is_locked,
        locked:profiles!locked_by(id,name),
        comments:comments (
          content,
          createdAt:created_at,
          createdBy:profiles!created_by(name),
          is_internal
        )
      `
    )
    .eq("ticket_number", ticketNumber)
    .order("created_at", { referencedTable: "comments", ascending: false })
    .single();

  if (error) throw error;
  if (!data) throw new Error("Ticket not found");

  return {
    ticketId: data.id,
    ticketNumber: data.ticket_number,
    createdAt: formatDate(data.created_at),
    createdBy: data.created_by.name,
    status: data.status,
    application: data.app.name,
    severity: data.severity,
    description: data.description,
    assignedTo: data.assigned?.id ?? null,
    assignedName: data.assigned?.name ?? null,
    isLocked: data.is_locked,
    lockedBy: data.locked?.id ?? null,
    lockedName: data.locked?.name ?? null,
    history: data.comments.filter((comment) => !comment.is_internal),
    intHistory: data.comments.filter((comment) => comment.is_internal),
  };
};

export const useFetchTicket = (ticketNumber: string | undefined) => {
  return queryOptions({
    queryKey: ["ticket", ticketNumber],
    queryFn: () => {
      if (!ticketNumber) throw new Error("Invalid Ticket Number");
      return fetchTicket(ticketNumber);
    },
    enabled: !!ticketNumber,
  });
};

export type BulkTickets = {
  typedData: FullTicket[];
  cursor: string | null;
};

type FetchTicketsProps = {
  pageParam: null | string;
  sortParams: Param[];
  filterParams: Map<string, string[]>;
};

const fetchAllTickets = async ({
  pageParam,
  sortParams,
  filterParams,
}: FetchTicketsProps): Promise<BulkTickets> => {
  let query = supabase
    .from("tickets")
    .select(
      `id,ticket_number,created_at,created_by:profiles!created_by(name),status,severity,updated_at,updated_by:profiles!updated_by(name),app:apps(name),description,assigned:profiles!assigned_to(id,name)`
    );

  const queryGenerator = (subQuery: typeof query) => {
    for (const sp of sortParams) {
      subQuery = subQuery.order(field[sp.field], {
        ascending: sp.val !== "desc",
      });
    }
    for (const [key, value] of filterParams) {
      subQuery = subQuery.in(field[key as keyof typeof field], value);
    }
    return subQuery;
  };

  if (!pageParam) {
    if (sortParams.length || filterParams.size) {
      queryGenerator(query).limit(20);
    } else {
      query = query.order("created_at", { ascending: false }).limit(20);
    }
  } else {
    query = query
      .order("created_at", { ascending: false })
      .lt("created_at", pageParam)
      .limit(20);
  }

  const { data, error } = await query;

  if (error) throw error;
  if (!data) throw new Error("Tickets not found");

  const lastTicket = data.length > 0 ? data[data.length - 1] : null;
  const cursor = lastTicket ? lastTicket.created_at : null;
  const typedData = data.map((ticket) => ({
    id: ticket.id,
    ticket_number: ticket.ticket_number,
    created_at: ticket.created_at,
    status: ticket.status,
    severity: ticket.severity,
    updated_at: ticket.updated_at,
    description: ticket.description,
    app: ticket.app.name,
    created_by: ticket.created_by.name,
    updated_by: ticket.updated_by.name,
    assigned_to: ticket.assigned?.id ?? null,
    assigned_name: ticket.assigned?.name ?? null,
  }));

  return { typedData, cursor };
};

export const useFetchAllTickets = (
  profile: ProfileType | null,
  sortParams: Param[] = [],
  filterParams: Map<string, string[]> = new Map()
) => {
  return infiniteQueryOptions({
    queryKey: [
      "allTickets",
      { sortParams, filterParams: [...filterParams.entries()] },
    ],
    queryFn: ({ pageParam }) => {
      if (!profile) throw new Error("Invalid Profile");
      return fetchAllTickets({
        pageParam,
        sortParams,
        filterParams,
      });
    },
    initialPageParam: null as null | string,
    getNextPageParam: (lastPage) => lastPage.cursor,
  });
};

const fetchAgentOwnedTicketsCount = async (profileId: string) => {
  const { count, error } = await supabase
    .from("tickets")
    .select("*", { count: "exact", head: true })
    .eq("assigned_to", profileId);

  if (error) throw error;
  if (!count)
    throw new Error("Unable to get count of tickets assigned to this agent");

  return count;
};

export const useFetchAOTC = (profile: ProfileType | null) => {
  return queryOptions({
    queryKey: ["AgentTicketCount"],
    queryFn: () => {
      if (!profile) throw new Error("Invalid Profile");
      return fetchAgentOwnedTicketsCount(profile.id);
    },
    enabled: !!(profile?.role === "agent"),
  });
};

const fetchMetrics = async (): Promise<Metrics> => {
  const { data, error } = await supabase.rpc("get_metrics");

  if (error) throw error;
  if (!data) throw new Error("Unable to get counts");

  return data;
};

export const useFetchMetrics = (profile: ProfileType | null) => {
  return queryOptions({
    queryKey: ["ticketMetrics"],
    queryFn: () => {
      if (!profile) throw new Error("Invalid Profile");
      return fetchMetrics();
    },
    enabled: !!(profile?.role === "agent"),
  });
};
