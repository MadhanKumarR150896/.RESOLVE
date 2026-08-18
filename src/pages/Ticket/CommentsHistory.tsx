import type { History } from "../../supabase/requiredTypes";
import { formatDate } from "../../utils/formatDate";

type Props = {
  value: History[] | undefined;
};

export const CommentsHistory = ({ value }: Props) => {
  return (
    <>
      {value?.map((val, i) => (
        <div key={`${val.is_internal}-${i}`} className="text-sm my-1">
          <span>{val.content}</span>
          <div className="text-xs text-neutral-500 mt-0.5">
            <span>Updated by {val.createdBy?.name ?? null} </span>
            <span>( {formatDate(val.createdAt)} )</span>
          </div>
        </div>
      ))}
    </>
  );
};
