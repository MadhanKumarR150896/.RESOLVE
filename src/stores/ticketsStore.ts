import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { Tickets } from "../supabase/requiredTypes";

type State = {
  ticketsId: Tickets["id"][];
  ticketsCount: number;
};

type Action = {
  selectTicket: (ticketId: string) => void;
  unSelectTicket: (ticketId: string) => void;
};

export const useTicketsStore = create<State & Action>()(
  devtools((set, get) => ({
    ticketsId: [],
    ticketsCount: 0,

    selectTicket: (id) => {
      set({
        ticketsId: [...get().ticketsId, id],
        ticketsCount: get().ticketsCount + 1,
      });
    },

    unSelectTicket: (id) => {
      set({
        ticketsId: get().ticketsId.filter((ticketId) => ticketId !== id),
        ticketsCount: get().ticketsCount - 1,
      });
    },
  }))
);
