import { create } from "zustand";
import { devtools } from "zustand/middleware";

type StatusType =
  | "loading"
  | "error"
  | "success"
  | "signedin"
  | "signedout"
  | "signinfailed"
  | "signoutfailed";

type Toaster = {
  type: StatusType;
  id: string;
  message: string;
};

type State = {
  toasters: Toaster[];
};

type Action = {
  updateToaster: (toaster: Toaster) => void;
  clearToasters: (toasterId: string) => void;
  removeToaster: (toasterId: string) => void;
};

export const useToasterStore = create<State & Action>()(
  devtools((set, get) => ({
    toasters: [],

    updateToaster: (toaster) => {
      if (toaster.type === "loading") {
        set({ toasters: [...get().toasters, toaster] });
        return;
      }
      setTimeout(() => {
        set({
          toasters: get().toasters.filter((each) => each.id !== toaster.id),
        });
      }, 5000);

      set({ toasters: [...get().toasters, toaster] });
    },

    clearToasters: (toasterId) => {
      set({
        toasters: get().toasters.filter((each) => each.id === toasterId),
      });
    },

    removeToaster: (toasterId) => {
      set({
        toasters: get().toasters.filter((each) => each.id !== toasterId),
      });
    },
  }))
);
