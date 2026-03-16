import { NavLink } from "react-router";
import { useAuthContext } from "../../context/AuthContext";
import Logo from "../../assets/Full_logo_L_S.svg";
import {
  DropdownMenu,
  DropdownMenuArrow,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { UserRound } from "lucide-react";
import { supabase } from "../../supabase/supabaseClient";

export const Header = () => {
  const { profile, showStatus } = useAuthContext();

  const supabaseSignout = async () => {
    const { error } = await supabase.auth.signOut({ scope: "local" });

    if (error) {
      showStatus({
        type: "error",
        message: "Sign out failed",
      });
      return;
    }

    showStatus({
      type: "success",
      message: "Successfully signed out",
    });
  };

  return (
    <>
      <header className="flex items-center justify-between h-16 px-3 py-2 rounded border bg-neutral-100 shadow shadow-neutral-500">
        <NavLink
          className="cursor-pointer rounded outline-none select-none"
          to={`/dashboard/${profile?.role}`}
        >
          <img className="h-10 rounded" src={Logo} alt="App_logo" />
        </NavLink>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="inline-flex items-center select-none justify-center size-10 rounded bg-neutral-900 outline-none cursor-pointer">
                <UserRound color="white" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuPortal>
              <DropdownMenuContent
                loop
                className="text-sm min-w-40 bg-neutral-50 p-2 rounded border border-neutral-500 cursor-pointer"
                sideOffset={2}
                align="end"
                alignOffset={-1}
              >
                <DropdownMenuItem
                  className="data-disabled:text-neutral-500 px-2 select-none data-disabled:pointer-events-none"
                  disabled
                >
                  {profile?.name}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="data-disabled:text-neutral-500 px-2 select-none data-disabled:pointer-events-none"
                  disabled
                >
                  {profile?.email}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-neutral-300 h-px m-1"></DropdownMenuSeparator>
                <DropdownMenuItem
                  className="outline-none px-2 py-0.5 rounded select-none hover:bg-neutral-300 focus:bg-neutral-300"
                  onSelect={supabaseSignout}
                >
                  Sign out
                </DropdownMenuItem>
                <DropdownMenuArrow className="fill-neutral-500" />
              </DropdownMenuContent>
            </DropdownMenuPortal>
          </DropdownMenu>
        </div>
      </header>
    </>
  );
};
