import { SearchBox } from "../utils/Reusables";
import { supabase } from "../supabase/supabaseClient";
import { useToasterStore } from "../stores/toasterStore";
import { useNavigate } from "react-router";
import { useState } from "react";

type SearchCompProps = {
  profileRole: "user" | "agent" | null;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  buttonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
} & React.HTMLAttributes<HTMLDivElement>;

export const SearchComp = ({
  className,
  profileRole,
  inputProps,
  buttonProps,
}: SearchCompProps) => {
  const navigate = useNavigate();
  const updateToaster = useToasterStore((state) => state.updateToaster);

  const [searchValue, setSearchValue] = useState("");

  const searchTicket = async () => {
    const ticketNumber = searchValue.trim();
    if (!ticketNumber || ticketNumber.length !== 7 || !profileRole) return;
    const { data, error } = await supabase
      .from("tickets")
      .select("ticket_number")
      .eq("ticket_number", ticketNumber)
      .single();

    if (error || !data) {
      updateToaster({
        type: "error",
        message: "Ticket not found or invalid",
      });
      return;
    }

    navigate(`/dashboard/${profileRole}/ticket/${ticketNumber}`);
  };

  const handleOnKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      await searchTicket();
      return;
    }
    if (e.key === "Escape") {
      setSearchValue("");
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
    const sanitised = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 7);
    setSearchValue(sanitised);
  };
  return (
    <div className={className}>
      <SearchBox
        inputProps={{
          value: searchValue,
          onChange: (e) => setSearchValue(e.target.value),
          inputMode: "numeric",
          onKeyDown: handleOnKeyDown,
          onPaste: handleOnPaste,
          maxLength: 7,
          placeholder: "Search your ticket...",
          ...inputProps,
        }}
        buttonProps={{
          onClick: searchTicket,
          ...buttonProps,
        }}
      />
    </div>
  );
};
