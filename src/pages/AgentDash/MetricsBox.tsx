import { Spinner } from "../../utils/ReusableElements";

export const MetricsBox = ({
  count,
  isLoading,
  label,
}: {
  count: number | null;
  isLoading: boolean;
  label: string;
}) => {
  return (
    <div className="input h-30 w-full flex flex-col items-center gap-2 bg-neutral-200 text-neutral-600">
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
