import { useNavigate } from "react-router";
import { Button, SearchBox } from "../components/ReusableElements";

export const UserDashboard = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="my-16 flex flex-col gap-2 min-w-60 w-70 m-auto">
        <SearchBox />
        <Button
          label="Create Ticket"
          type="button"
          onClick={() => {
            navigate("/dashboard/user/ticket");
          }}
        />
      </div>
    </>
  );
};
