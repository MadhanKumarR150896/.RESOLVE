import { useQuery } from "@tanstack/react-query";
import type { Tickets } from "../../../supabase/requiredTypes";
import { useSearchParams } from "react-router";
import { useGetApps } from "../../../services/appService";
import { useGetAgents } from "../../../services/profileService";

export type SortOperation = {
  type: "sort";
  field: "ticketNumber" | "createdAt" | "updatedAt";
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

export type Param = SortOperation | FilterOperaion;

export const useConstructParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: apps = {} } = useQuery(useGetApps());
  const { data: agents = {} } = useQuery(useGetAgents());

  const getParams = () => {
    let array: Param[] = [];
    searchParams.forEach((value, key) => {
      const [field, val] = value.split(":");
      array = [
        ...array,
        {
          type: key,
          field,
          val,
        } as Param,
      ];
    });
    return array;
  };

  const getSortParams = () => {
    return getParams().filter(({ type }) => type === "sort");
  };

  const getFilterParams = (): Record<string, string[]> => {
    return getParams()
      .filter(({ type }) => type === "filter")
      .reduce<Record<string, string[]>>((obj, each) => {
        const key = each.field;
        if (!obj[key]) {
          obj[key] = [];
        }

        if (key === "application") {
          obj[key].push(apps[each.val]);
        } else if (key === "assignedTo") {
          obj[key].push(agents[each.val]);
        } else {
          obj[key].push(each.val);
        }

        return obj;
      }, {});
  };

  const appendParams = (arr: Param[]) => {
    const newParams = new URLSearchParams();
    arr.forEach((each) => {
      newParams.append(each.type, `${each.field}:${each.val}`);
    });
    setSearchParams(newParams);
  };

  const updateSortParam = (param: SortOperation) => {
    const array = getParams();
    const existing = array.find(({ field }) => field === param.field);

    if (!existing) {
      const arr = [param, ...array];
      appendParams(arr);
      return;
    }

    if (existing && existing.val !== param.val) {
      const arr = array.map((each) =>
        each.field === param.field && each.val !== param.val ? param : each
      );
      appendParams(arr);
      return;
    }

    const curr = new URLSearchParams(searchParams);
    const value = `${param.field}:${param.val}`;
    curr.delete(param.type, value);
    setSearchParams(curr);
  };

  const updateFilterParam = (param: FilterOperaion) => {
    const curr = new URLSearchParams(searchParams);
    const array = getParams();
    const existing = array.find(
      ({ field, val }) => field === param.field && val === param.val
    );
    const value = `${param.field}:${param.val}`;

    if (existing) {
      curr.delete(param.type, value);
      setSearchParams(curr);
      return;
    }

    curr.append(param.type, value);
    setSearchParams(curr);
  };

  return { getSortParams, getFilterParams, updateSortParam, updateFilterParam };
};
