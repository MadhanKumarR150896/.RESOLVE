import { NavLink } from "react-router";
import { useAuthContext } from "../contexts/AuthContext";
import Logo from "../assets/Full_logo_L_S.svg";
import { useSupabaseAuth } from "../services/authService";
import type { DropProps } from "../pages/Dashboard/agentTableHeader";
import { StaticDropdown } from "../utils/StaticDrop";
import { useMemo } from "react";

export const Header = () => {
  const { profile } = useAuthContext();
  const { supabaseSignout } = useSupabaseAuth();

  const drop: DropProps = useMemo(
    () => ({
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
        },
      },
    }),
    [profile, supabaseSignout]
  );

  return (
    <>
      <header className="flex items-center justify-between h-16 min-w-250 px-3 py-2 rounded border bg-neutral-100 shadow shadow-neutral-500">
        <NavLink
          className="cursor-pointer rounded outline-none select-none"
          to={`/dashboard/${profile?.role}`}
        >
          <img className="h-10 rounded" src={Logo} alt="App_logo" />
        </NavLink>
        <StaticDropdown id="header" drop={drop} />
      </header>
    </>
  );
};
