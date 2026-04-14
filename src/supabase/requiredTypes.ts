import type { Database as Required } from "./database.types";

export type Profiles = Required["public"]["Tables"]["profiles"]["Row"];
export type Apps = Required["public"]["Tables"]["apps"]["Row"];
export type Tickets = Required["public"]["Tables"]["tickets"]["Row"];
export type Comments = Required["public"]["Tables"]["comments"]["Row"];

export type ProfileType = Omit<Profiles, "created_at" | "is_active">;

export type AppType = Omit<Apps, "created_at" | "is_active">;

interface commentsProps {
  comments: string;
  intComments: string;
}

export interface FormValues extends commentsProps {
  severity: Tickets["severity"];
  status: Tickets["status"];
  application: string;
  description: string;
  assignedTo: string;
  isLocked: boolean;
}
