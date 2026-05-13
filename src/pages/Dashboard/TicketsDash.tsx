import { useNavigate } from "react-router";
import { Button, SearchBox } from "../../utils/ReusableElements";
import { TicketsGrid } from "./TicketsGrid";
import { useAuthContext } from "../../context/AuthContext";
import { useRef } from "react";
import { supabase } from "../../supabase/supabaseClient";
import { useToasterStore } from "../../store/toasterStore";
import { useTickets } from "./useTickets";

export const TicketsDash = () => {
  const { profile } = useAuthContext();
  const { tickets, ticketsLoading } = useTickets();
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
    if (!ticketNumber || !profile) return;
    await checkTicket(profile?.role, ticketNumber);
  };

  const clearInput = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      await searchTicket();
    } else if (e.key === "Escape") clearInput();
  };

  return (
    <>
      <div className="py-16 flex flex-col gap-2 min-w-60 w-70 mx-auto">
        <SearchBox
          ref={inputRef}
          inputProps={{ onKeyDown: handleKeyDown }}
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
      <TicketsGrid
        tickets={tickets}
        role={profile?.role ?? null}
        loading={ticketsLoading}
      />
    </>
  );
};
