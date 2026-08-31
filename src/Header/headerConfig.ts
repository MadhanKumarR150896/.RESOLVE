import { useSupabaseAuth } from "../services/authService";
import { useTicketsStore } from "../stores/ticketsStore";
import type { ProfileType } from "../supabase/requiredTypes";
import type { DialogBoxProps } from "../utils/CustomDialog";
import type { DropProps } from "../utils/CustomDrop";

export const useHeaderConfig = (profile: ProfileType | null) => {
  const { supabaseSignout } = useSupabaseAuth();
  const { ticketsCount } = useTicketsStore((state) => state);

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
        content: {},
        close: {
          icon: {},
        },
      },
    } as DialogBoxProps,
  };
};
