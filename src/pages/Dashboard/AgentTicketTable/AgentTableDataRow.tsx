import { Link } from "react-router";
import type { FullTicket, ProfileType } from "../../../supabase/requiredTypes";
import {
  tableDataConfig,
  type DivP,
  type InputP,
  type LinkP,
  type SpanP,
} from "./agentTableData";
import { formatDate } from "../../../utils/formatDate";
import { useState, type DragEvent } from "react";
import { useTicketsStore } from "../../../stores/ticketsStore";

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

export const AgentTableDataRow = ({ ticket, profile }: AgentTableRowProps) => {
  const [isSelected, setIsSelected] = useState(false);
  const { selectTicket, unSelectTicket } = useTicketsStore((state) => state);

  const handleDragStart = (e: DragEvent<HTMLTableRowElement>) => {
    if (!isSelected) {
      e.dataTransfer.clearData();
      const dragElement = document.createElement("div");
      dragElement.innerText = ticket.ticket_number;
      dragElement.classList.add("dragElement");
      document.body.appendChild(dragElement);
      e.dataTransfer.setDragImage(dragElement, 60, 25);
      e.dataTransfer.setData(
        "application/json",
        JSON.stringify({
          id: ticket.id,
          ticket_number: ticket.ticket_number,
          status: ticket.status,
          assigned_to: ticket.assigned_to,
        })
      );

      requestAnimationFrame(() => {
        dragElement.remove();
      });
    }
  };
  return (
    <tr
      draggable={isSelected ? false : true}
      onDragStart={(e) => handleDragStart(e)}
      className={`bg-neutral-200 even:bg-neutral-50 ${isSelected ? "" : "hover:cursor-default"} ${isSelected ? "" : "active:cursor-grabbing"} h-8 ${textColor[ticket.status]} text-[15px] *:px-4 ${isSelected ? "select-none" : "select-auto"}`}
    >
      {tableDataConfig.map((cell) => {
        switch (cell.name) {
          case "Input": {
            return (
              <td key={`${ticket.id}-${cell.props.id}`} {...cell.props}>
                <div className="flex flex-col">
                  <input
                    disabled={ticket.status === "closed"}
                    value={ticket[cell.value] ?? ""}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setIsSelected(true);
                        selectTicket(ticket.id);
                      } else {
                        setIsSelected(false);
                        unSelectTicket(ticket.id);
                      }
                    }}
                    {...(cell.innerProps as InputP)}
                  />
                </div>
              </td>
            );
          }

          case "Link": {
            return (
              <td key={`${ticket.id}-${cell.props.id}`} {...cell.props}>
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
              <td key={`${ticket.id}-${cell.props.id}`} {...cell.props}>
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
              <td key={`${ticket.id}-${cell.props.id}`} {...cell.props}>
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
