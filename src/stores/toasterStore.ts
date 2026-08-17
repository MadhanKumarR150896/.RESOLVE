import { create } from "zustand";
import { devtools } from "zustand/middleware";

type StatusType = "initial" | "loading" | "error" | "success";

type Toaster = {
  type: StatusType;
  message: string;
};

type TimeoutId = ReturnType<typeof setTimeout> | null;

type State = {
  toaster: Toaster;
  timeoutId: TimeoutId;
};

type Action = {
  updateToaster: (toaster: State["toaster"]) => void;
  removeToaster: () => void;
};

export const initialToaster: Toaster = {
  type: "initial",
  message: "",
};

export const useToasterStore = create<State & Action>()(
  devtools((set, get) => ({
    toaster: initialToaster,
    timeoutId: null,

    updateToaster: (toaster) => {
      const previousId = get().timeoutId;
      if (previousId) clearTimeout(previousId);

      const newId = setTimeout(() => {
        set({
          toaster: initialToaster,
          timeoutId: null,
        });
      }, 3000);

      set({ toaster: toaster, timeoutId: newId });
    },

    removeToaster: () => {
      set({
        toaster: initialToaster,
        timeoutId: null,
      });
    },
  }))
);
