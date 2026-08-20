import { useEffect, useState, type ReactNode } from "react";
import { DropContext } from "./DropContext";

export type DropId =
  | "createdAt"
  | "ticketNumber"
  | "status"
  | "application"
  | "assignedTo"
  | "severity"
  | "header";

export const DropProvider = ({ children }: { children: ReactNode }) => {
  const [showDrop, setShowDrop] = useState<DropId | null>(null);

  const handleDrop = () => {
    setShowDrop(null);
  };

  useEffect(() => {
    if (showDrop) {
      window.addEventListener("scroll", handleDrop, { capture: true });
    }

    return () => {
      window.removeEventListener("scroll", handleDrop, { capture: true });
    };
  }, [showDrop]);

  const value = { showDrop, setShowDrop };
  return <DropContext.Provider value={value}>{children}</DropContext.Provider>;
};
