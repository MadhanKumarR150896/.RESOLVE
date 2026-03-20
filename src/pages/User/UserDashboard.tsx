import { Search } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "../components/FormElements";

export const UserDashboard = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="my-16 flex flex-col gap-2 min-w-60 w-70 m-auto">
        <div className="flex justify-between border rounded py-1 px-2 gap-2 border-neutral-500">
          <input className="outline-none" type="text" />
          <button type="button">
            <Search strokeWidth={1} />
          </button>
        </div>
        <Button
          type="button"
          onClick={() => {
            navigate("/dashboard/user/ticket");
          }}
        >
          Create Ticket
        </Button>
      </div>
    </>
  );
};
