import type { Database as Required } from "./database.types";

export type Profiles = Required["public"]["Tables"]["profiles"]["Row"];
export type Apps = Required["public"]["Tables"]["apps"]["Row"];
export type Tickets = Required["public"]["Tables"]["tickets"]["Row"];
export type Comments = Required["public"]["Tables"]["comments"]["Row"];

export type ProfileType = Omit<Profiles, "created_at" | "is_active">;

export type AppType = Omit<Apps, "created_at" | "is_active">;

type comments = {
  comments: string;
  intComments: string;
};

export type FormValues = {
  ticketId: Tickets["id"];
  application: Tickets["app_id"];
  severity: Tickets["severity"];
  description: Tickets["description"];
  status: Tickets["status"];
  assignedTo: Tickets["assigned_to"];
  isLocked: Tickets["is_locked"];
  lockedBy: Tickets["locked_by"];
} & comments;

export type history = {
  content: Comments["content"];
  createdAt: Comments["created_at"];
  createdBy: { name: Profiles["name"] };
  is_internal: Comments["is_internal"];
};

export type TicketDetails = {
  ticketId: Tickets["id"];
  ticketNumber: Tickets["ticket_number"];
  createdAt: Tickets["created_at"];
  createdBy: Profiles["name"];
  severity: Tickets["severity"];
  status: Tickets["status"];
  application: Tickets["app_id"];
  description: Tickets["description"];
  assignedTo: Profiles["id"] | null;
  assignedName: Profiles["name"] | null;
  isLocked: Tickets["is_locked"];
  lockedBy: Profiles["id"] | null;
  lockedName: Profiles["name"] | null;
  history: history[];
  intHistory: history[];
};

export type FunctionArgs = Required["public"]["Functions"][
  | "create_ticket_for_agent"
  | "create_ticket_for_user"
  | "update_ticket_for_agent"
  | "update_ticket_for_user"]["Args"];

export type ReturnType = Required["public"]["CompositeTypes"]["type_response"];
