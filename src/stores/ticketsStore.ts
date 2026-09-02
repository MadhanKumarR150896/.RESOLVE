import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { Tickets } from "../supabase/requiredTypes";

type TicketState = {
  ids: Tickets["id"][];
  count: number;
};

type State = {
  ticketState: TicketState;
};

type Action = {
  selectTicket: (ticketId: string) => void;
  unSelectTicket: (ticketId: string) => void;
  selectAllTicket: (array: string[]) => void;
};

const initialState: TicketState = {
  ids: [],
  count: 0,
};

export const useTicketsStore = create<State & Action>()(
  devtools((set, get) => ({
    ticketState: initialState,

    selectTicket: (id) => {
      set({
        ticketState: {
          ...get().ticketState,
          ids: [...get().ticketState.ids, id],
          count: get().ticketState.count + 1,
        },
      });
    },

    unSelectTicket: (id) => {
      set({
        ticketState: {
          ...get().ticketState,
          ids: get().ticketState.ids.filter((ticketId) => ticketId !== id),
          count: get().ticketState.count - 1,
        },
      });
    },

    selectAllTicket: (array: string[]) => {
      set({
        ticketState:
          array.length === 0
            ? initialState
            : {
                ids: array,
                count: array.length,
              },
      });
    },
  }))
);
