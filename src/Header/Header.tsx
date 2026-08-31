import { NavLink } from "react-router";
import { useAuthContext } from "../contexts/AuthContext";
import Logo from "../assets/Full_logo_L_S.svg";
import { CustomDropdown } from "../utils/CustomDrop";
import { useTicketsStore } from "../stores/ticketsStore";
import { useHeaderConfig } from "./headerConfig";
import { CustomDialogBox } from "../utils/CustomDialog";

export const Header = () => {
  const { profile } = useAuthContext();
  const { drop, dialog } = useHeaderConfig(profile);
  const { ticketsCount } = useTicketsStore((state) => state);

  return (
    <>
      <header className="flex items-center justify-between h-16 min-w-250 px-3 py-2 rounded border bg-neutral-100 shadow shadow-neutral-500">
        <NavLink
          className="cursor-pointer rounded outline-none select-none"
          to={`/dashboard/${profile?.role}`}
        >
          <img className="h-10 rounded" src={Logo} alt="App_logo" />
        </NavLink>
        {profile?.role === "agent" && ticketsCount >= 1 && (
          <CustomDialogBox dialog={dialog}>hi</CustomDialogBox>
        )}
        <CustomDropdown id="header" drop={drop} />
      </header>
    </>
  );
};
