import type { ReactNode } from "react";

type UserGridProps = {
  children: ReactNode;
};

export const UserTicketsGrid = ({ children }: UserGridProps) => {
  return (
    <div className="h-full grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 pbe-4">
      {children}
    </div>
  );
};
