import { useSupabaseAuth } from "../services/authService";
import { useTicketsStore } from "../stores/ticketsStore";
import type { ProfileType } from "../supabase/requiredTypes";
import type { DialogBoxProps } from "../utils/CustomDialog";
import type { DropProps } from "../utils/CustomDrop";

export const useHeaderConfig = (profile: ProfileType | null) => {
  const { supabaseSignout } = useSupabaseAuth();
  const { count: ticketsCount } = useTicketsStore((state) => state.ticketState);

  return {
    drop: {
      trigger: {
        buttonProps: {
          className:
            "inline-flex items-center justify-center size-10 rounded bg-neutral-900 p-0 text-white",
        },
        icon: {
          name: "header",
        },
      },
      portal: {
        content: {
          items: [
            {
              name: profile?.name ?? "Profile name",
              props: {
                disabled: true,
                className: "bg-inherit py-0",
              },
            },
            {
              name: profile?.email ?? "Profile email",
              props: {
                disabled: true,
                className:
                  "bg-inherit rounded-none border-b py-0 pbe-1 border-neutral-400",
              },
            },
            {
              name: "Sign out",
              props: {
                onSelect: supabaseSignout,
              },
            },
          ],
          arrow: {
            props: {
              className: "fill-neutral-500",
            },
          },
        },
      },
    } as DropProps,
    dialog: {
      trigger: {
        props: {
          className: "-ms-20",
        },
        buttonProps: {
          className:
            "flex border rounded-md items-center gap-2 px-3 py-2 bg-neutral-900 text-neutral-100",
        },
        title: {
          value: ticketsCount >= 2 ? "Update tickets" : "Update ticket",
          props: {
            className: "font-bold",
          },
        },
        extra: {
          value: ticketsCount.toString(),
          props: {
            className:
              "text-[15px] font-semibold px-2 me-2 bg-neutral-100 text-neutral-900 rounded-md",
          },
        },
        icon: {
          name: "update",
          props: {
            size: 16,
          },
        },
      },
      portal: {
        overlayProps: {
          className: "fixed inset-0 opacity-50",
        },
        content: {
          props: {
            className:
              "fixed bg-neutral-200 rounded-md px-4 py-5 left-[50%] top-[25%] -translate-x-[50%] min-w-100 max-w-120 min-h-80 max-h-100 overflow-auto",
          },
          title: {
            value: "To update multiple tickets:",
            props: {
              className:
                "border border-neutral-400 font-bold bg-neutral-100 w-max px-4 py-1 rounded",
            },
          },
        },
        close: {
          props: {
            className: "absolute right-5 top-5",
          },
          icon: {
            props: {
              size: 20,
            },
          },
        },
      },
    } as DialogBoxProps,
  };
};
