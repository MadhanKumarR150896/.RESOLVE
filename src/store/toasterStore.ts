import { create } from "zustand";

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

export const useToasterStore = create<State & Action>((set, get) => ({
  toaster: {
    type: "initial",
    message: "",
  },
  timeoutId: null,

  updateToaster: (toaster) => {
    set({ toaster: toaster });

    const previousId = get().timeoutId;
    if (previousId) clearTimeout(previousId);

    const newId = setTimeout(() => {
      set({
        toaster: {
          type: "initial",
          message: "",
        },
      });
    }, 4000);

    set({ timeoutId: newId });
  },

  removeToaster: () => {
    set({
      toaster: {
        type: "initial",
        message: "",
      },
    });
  },
}));
