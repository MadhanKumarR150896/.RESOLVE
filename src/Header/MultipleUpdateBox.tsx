import { useState, type SyntheticEvent } from "react";
import { Button, SelectGroup, TextArea } from "../utils/Reusables";

const sevOptions = [
  { drop: "Select Severity", value: "" },
  { drop: "sev 5 (Minor)", value: "sev 5" },
  { drop: "sev 4 (Low)", value: "sev 4" },
  { drop: "sev 3 (Medium)", value: "sev 3" },
  { drop: "sev 2 (High)", value: "sev 2" },
  { drop: "sev 1 (Critical)", value: "sev 1" },
];

const statusOptions = [
  { drop: "Select Status", value: "" },
  { drop: "open", value: "open" },
  { drop: "active", value: "active" },
  { drop: "deferred", alue: "deferred" },
  { drop: "resolved", value: "resolved" },
  { drop: "closed", value: "closed" },
];

export const MultipleUpdateBox = () => {
  const [severity, setSeverity] = useState("");
  const [status, setStatus] = useState("");
  const [comments, setComments] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!severity && !status && !comments) return;
    setIsLoading(true);
  };
  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className="border border-neutral-400 grid grid-cols-2 gap-4 text-sm mbs-4 bg-neutral-100 rounded px-4 pbs-2 pbe-4"
    >
      <fieldset>
        <SelectGroup
          label="Severity"
          id="severity"
          className="border-neutral-400"
          name="severity"
          value={severity}
          onChange={(e) => setSeverity(e.target.value)}
        >
          {sevOptions.map((option) => (
            <option key={`header-sev-${option.value}`} value={option.value}>
              {option.drop}
            </option>
          ))}
        </SelectGroup>
      </fieldset>
      <fieldset>
        <SelectGroup
          label="Status"
          id="status"
          name="status"
          className="border-neutral-400"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          {statusOptions.map((option) => (
            <option key={`header-status-${option.value}`} value={option.value}>
              {option.drop}
            </option>
          ))}
        </SelectGroup>
      </fieldset>
      <fieldset className="col-span-2">
        <TextArea
          name="comments"
          id="comments"
          label="Comments"
          className="h-25 border-neutral-400"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
        />
      </fieldset>
      <Button
        disabled={isLoading}
        className="col-span-2 place-self-center px-12"
        onClick={() => console.log("button")}
      >
        Submit
      </Button>
    </form>
  );
};
