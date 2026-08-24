import { useEffect, useState } from "react";
import type { Tickets } from "../../../supabase/requiredTypes";
import { useSearchParams } from "react-router";

type SortOperation = {
  type: "sort";
  field: "ticketNumber" | "createdAt";
  val: "asc" | "desc";
};

type StatusFilter = {
  type: "filter";
  field: "status";
  val: Tickets["status"];
};

type SeverityFilter = {
  type: "filter";
  field: "severity";
  val: Tickets["severity"];
};

type AppFilter = {
  type: "filter";
  field: "application";
  val: string;
};

type AssignedToFilter = {
  type: "filter";
  field: "assignedTo";
  val: string;
};

type FilterOperaion =
  | StatusFilter
  | SeverityFilter
  | AssignedToFilter
  | AppFilter;

type Params = SortOperation | FilterOperaion;

export const useConstructSearchParams = () => {
  const [opsParams, setOpsParams] = useState<Params[] | []>([]);
  const [, setSearchParams] = useSearchParams();

  useEffect(() => {
    const searchParams = new URLSearchParams();

    opsParams.forEach((ops) => {
      searchParams.append(ops.type, `${ops.field}:${ops.val}`);
    });

    setSearchParams(searchParams);
  }, [opsParams, setSearchParams]);

  const setParams = (obj: Params) => {
    if (obj.type === "sort") {
      setOpsParams((prev) => {
        const matchingOp = prev.find(({ field }) => field === obj.field);

        if (!matchingOp) {
          return [...prev, obj];
        }

        if (matchingOp.val !== obj.val) {
          return [...prev.filter(({ field }) => field !== obj.field), obj];
        }

        return prev.filter(({ field }) => field !== obj.field);
      });
    }

    if (obj.type === "filter") {
      setOpsParams((prev) => {
        const matchingOp = prev.find(
          ({ field, val }) => field === obj.field && val === obj.val
        );

        if (matchingOp) {
          return prev.filter(({ val }) => val !== matchingOp.val);
        }

        return [...prev, obj];
      });
    }
  };

  return { setParams };
};
