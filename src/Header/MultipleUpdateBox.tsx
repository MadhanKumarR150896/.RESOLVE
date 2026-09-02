import { useState } from "react";
import { MultipleUpdateForm } from "../pages/Dashboard/AgentTicketTable/MultipleUpdateForm";
import { MultipleUpdateResponse } from "../pages/Dashboard/AgentTicketTable/MultipleUpdateResponse";

export type Result = {
  status: boolean | null;
  ticket_number: string | null;
  ticket_id: string | null;
  message: string | null;
};

export const MultipleUpdateBox = () => {
  const [results, setResults] = useState<Result[] | null>(null);

  return (
    <>
      {results && results.length > 0 ? (
        <MultipleUpdateResponse results={results} setResults={setResults} />
      ) : (
        <MultipleUpdateForm setResults={setResults} />
      )}
    </>
  );
};
