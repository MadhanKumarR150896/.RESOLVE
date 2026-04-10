import { useNavigate } from "react-router";
import { Button, SearchBox } from "../components/ReusableElements";

export const AgentDashboard = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="flex flex-col gap-2 min-w-60 w-70 my-16 m-auto">
        <SearchBox />
        <Button
          label="Create Ticket"
          type="button"
          onClick={() => {
            navigate("/dashboard/agent/ticket");
          }}
        />
      </div>
    </>
  );
};
