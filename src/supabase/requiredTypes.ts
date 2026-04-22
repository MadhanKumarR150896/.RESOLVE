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
  application: Tickets["app_id"];
  severity: Tickets["severity"];
  description: Tickets["description"];
  status: Tickets["status"];
  assignedTo: Tickets["assigned_to"];
  isLocked: Tickets["is_locked"];
  lockedBy: Tickets["locked_by"];
} & comments;

type history = {
  content: Comments["content"];
  createdAt: Comments["created_at"];
  createdBy: { name: Profiles["name"] };
  isInternal: Comments["is_internal"];
};

export type TicketDetails = {
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
  lockedBy: Profiles["name"] | null;
  history: history[];
  intHistory: history[];
};
