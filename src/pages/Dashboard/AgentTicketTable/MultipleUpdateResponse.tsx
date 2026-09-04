import { CircleCheck, CircleX } from "lucide-react";
import { Button } from "../../../utils/Reusables";
import type { Result } from "../../../Header/MultipleUpdateBox";
import { useTicketsStore } from "../../../stores/ticketsStore";

const resultIcon = {
  success: CircleCheck,
  failed: CircleX,
};

type UpdateResponseProps = {
  results: Result[];
  setResults: React.Dispatch<React.SetStateAction<Result[] | null>>;
};

export const MultipleUpdateResponse = ({
  results,
  setResults,
}: UpdateResponseProps) => {
  const { selectAllTicket } = useTicketsStore((state) => state);

  const handleRetry = () => {
    const remains = results
      .filter(({ status }) => status !== true)
      .map(({ ticket_id }) => ticket_id)
      .filter((ticket_id) => ticket_id !== null);
    selectAllTicket(remains);
    setResults(null);
  };
  return (
    <div style={{ scrollbarWidth: "thin" }} className="w-full max-h-80">
      <div className="my-4 rounded p-4 bg-neutral-100 text-sm border border-neutral-900 max-h-60 overflow-auto">
        {results.map((result) => {
          if (result.status === null) return null;
          const res = result.status === true ? "success" : "failed";
          const ResultIcon = resultIcon[res];
          return (
            <div className="flex gap-2 mbe-1">
              <ResultIcon
                size={16}
                color={`${result.status === true ? "green" : "red"}`}
                className="shrink-0 mt-0.75"
              />
              <span className="">{result.message}</span>
            </div>
          );
        })}
      </div>
      <div className="flex gap-4 justify-center">
        <Button className="px-8 text-sm" onClick={() => selectAllTicket([])}>
          Clear
        </Button>
        {results.find(({ status }) => status !== true)?.status === false && (
          <Button className="px-8 text-sm" onClick={handleRetry}>
            Retry
          </Button>
        )}
      </div>
    </div>
  );
};
