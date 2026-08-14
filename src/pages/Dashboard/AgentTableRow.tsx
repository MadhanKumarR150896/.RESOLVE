import { Link } from "react-router";
import type { FullTicket, ProfileType } from "../../supabase/requiredTypes";
import {
  tableDataConfig,
  type DivP,
  type InputP,
  type LinkP,
  type SpanP,
} from "./agentTableData";
import { formatDate } from "../../utils/formatDate";

type AgentTableRowProps = {
  ticket: FullTicket;
  profile: ProfileType | null;
};

const textColor = {
  open: "text-red-600",
  active: " text-blue-600",
  deferred: "text-yellow-600",
  resolved: "text-green-600",
  closed: "text-gray-600",
};

export const AgentTableRow = ({ ticket, profile }: AgentTableRowProps) => {
  return (
    <tr
      className={`bg-neutral-200 even:bg-neutral-50 h-8 ${textColor[ticket.status]} text-[15px] *:px-4`}
    >
      {tableDataConfig.map((cell) => {
        switch (cell.name) {
          case "Input": {
            return (
              <td key={`${ticket.id}-${cell.name}`} {...cell.props}>
                <div className="flex flex-col">
                  <input
                    {...(cell.innerProps as InputP)}
                    value={ticket[cell.value] ?? ""}
                  />
                </div>
              </td>
            );
          }

          case "Link": {
            return (
              <td key={`${ticket.id}-${cell.name}`} {...cell.props}>
                <div className="flex flex-col">
                  <Link
                    to={`/dashboard/${profile?.role}/ticket/${ticket[cell.value]}`}
                    {...(cell.innerProps as LinkP)}
                  >
                    {ticket[cell.value]}
                  </Link>
                </div>
              </td>
            );
          }

          case "Span": {
            return (
              <td key={`${ticket.id}-${cell.name}`} {...cell.props}>
                <div className="flex flex-col">
                  <span {...(cell.innerProps as SpanP)}>
                    {cell.value === "created_at" || cell.value === "updated_at"
                      ? formatDate(ticket[cell.value])
                      : ticket[cell.value]}
                  </span>
                </div>
              </td>
            );
          }

          case "Div": {
            return (
              <td key={`${ticket.id}-${cell.name}`} {...cell.props}>
                <div className="flex flex-col">
                  <div {...(cell.innerProps as DivP)}>{ticket[cell.value]}</div>
                </div>
              </td>
            );
          }
        }
      })}
    </tr>
  );
};
