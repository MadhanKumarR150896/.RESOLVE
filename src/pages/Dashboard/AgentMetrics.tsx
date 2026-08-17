import type { DragEvent } from "react";
import { Spinner } from "../../utils/Reusables";

export const AgentMetrics = ({
  id,
  count,
  isLoading,
  label,
  dropTarget,
  handleDrop,
}: {
  id: "openCount" | "activeCount" | "ownedCount";
  count: number | null;
  isLoading: boolean;
  label: string;
  dropTarget: boolean;
  handleDrop?: (e: DragEvent<HTMLDivElement>) => void;
}) => {
  return (
    <div
      onDragOver={
        dropTarget
          ? (e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = "move";
            }
          : undefined
      }
      onDrop={(e) => handleDrop?.(e)}
      id={id}
      className="input h-30 w-full flex flex-col items-center gap-2 bg-neutral-200 text-neutral-600"
    >
      <div className="flex-1 flex items-center">
        {count && !isLoading ? (
          <span className="font-extrabold text-7xl">{count}</span>
        ) : (
          <Spinner className="h-full" />
        )}
      </div>
      <span className="font-semibold text-[20px]">{label}</span>
    </div>
  );
};
