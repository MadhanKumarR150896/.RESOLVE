import { createContext, useContext } from "react";
import type { DropId } from "./DropProvider";

export type DropContextType = {
  showDrop: DropId | null;
  setShowDrop: React.Dispatch<React.SetStateAction<DropId | null>>;
};

export const DropContext = createContext<DropContextType | null>(null);

export const useDropContext = () => {
  const context = useContext(DropContext);

  if (!context) {
    throw new Error(
      "Please make sure the component using the DropContext is wrapped by the provider"
    );
  }

  return context;
};
