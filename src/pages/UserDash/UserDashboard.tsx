import { useNavigate } from "react-router";
import { Button, SearchBox } from "../../utils/ReusableElements";
import { UserTicketsGrid } from "./UserTicketsGrid";
import { useAuthContext } from "../../context/AuthContext";
import { useRef } from "react";
import { supabase } from "../../supabase/supabaseClient";
import { useToasterStore } from "../../store/toasterStore";
import { useUserDashChannel } from "./useUserDashChannel";

const UserDashboard = () => {
  useUserDashChannel();
  const { profile } = useAuthContext();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const updateToaster = useToasterStore((state) => state.updateToaster);

  const checkTicket = async (role: "user" | "agent", ticket: string) => {
    const { data, error } = await supabase
      .from("tickets")
      .select("ticket_number")
      .eq("ticket_number", ticket)
      .single();

    if (error || !data) {
      updateToaster({
        type: "error",
        message: "Ticket not found or invalid",
      });
      return;
    }

    navigate(`/dashboard/${role}/ticket/${ticket}`);
  };

  const searchTicket = async () => {
    const ticketNumber = inputRef.current?.value?.trim();
    if (!ticketNumber || ticketNumber.length !== 7 || !profile) return;
    await checkTicket(profile?.role, ticketNumber);
  };

  const clearInput = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleOnKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      await searchTicket();
      return;
    }

    if (e.key === "Escape") {
      clearInput();
      return;
    }

    if (e.ctrlKey || e.metaKey) {
      return;
    }

    const allowedKeys = [
      "Backspace",
      "Delete",
      "ArrowLeft",
      "ArrowRight",
      "Tab",
    ];
    if (allowedKeys.includes(e.key)) {
      return;
    }

    if (!/^[0-9]$/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handleOnPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const sanitised = e.clipboardData.getData("text").replace(/\D/g, "");
    e.currentTarget.value = sanitised;
  };

  return (
    <>
      <div className="py-16 flex flex-col gap-2 min-w-60 w-70 mx-auto">
        <SearchBox
          ref={inputRef}
          inputProps={{
            placeholder: "0000001",
            inputMode: "numeric",
            onKeyDown: handleOnKeyDown,
            onPaste: handleOnPaste,
            maxLength: 7,
          }}
          buttonProps={{ onClick: searchTicket }}
        />
        <Button
          label="Create Ticket"
          type="button"
          onClick={() => {
            navigate(`/dashboard/${profile?.role}/ticket`);
          }}
        />
      </div>
      <UserTicketsGrid role={profile?.role ?? null} />
    </>
  );
};

export default UserDashboard;
