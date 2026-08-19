import { User } from "lucide-react";

type SigninDetailsProps = {
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
};

export const SigninDetails = ({
  setEmail,
  setPassword,
}: SigninDetailsProps) => (
  <div className="flex flex-col gap-4 text-sm">
    <div className="w-max self-center flex gap-2 items-center text-xs font-medium px-2 py-1 rounded border shadow shadow-neutral-500">
      <User size={18} /> Try signing in as Agent/User
    </div>
    <div className="flex gap-8 font-semibold">
      <button
        onClick={() => {
          setEmail("user1@resolve.com");
          setPassword("resolve@user");
        }}
        className="bg-neutral-900 hover:bg-neutral-800 text-neutral-50 text-center rounded px-4 py-2 cursor-pointer"
      >
        User Account
      </button>

      <button
        onClick={() => {
          setEmail("agent1@resolve.com");
          setPassword("resolve@agent");
        }}
        className="bg-neutral-900 hover:bg-neutral-800 text-neutral-50 text-center rounded px-4 py-2 cursor-pointer"
      >
        Agent Account
      </button>
    </div>
  </div>
);
