import { Loader, CircleAlert, CircleCheck } from "lucide-react";
import { useAuthContext } from "../../context/AuthContext";

const icons = {
  loading: Loader,
  error: CircleAlert,
  signedin: CircleCheck,
  signedout: CircleCheck,
};

export const AuthMessage = () => {
  const { authStatus } = useAuthContext();

  if (authStatus.type === "initial") return null;

  const MessageIcon = icons[authStatus.type];

  return (
    <div
      className="w-70 flex items-center gap-4 border-none shadow shadow-neutral-900 bg-neutral-200 z-50 text-sm py-2 px-4 rounded absolute right-16 top-24
        "
    >
      <MessageIcon
        className={authStatus.type === "loading" ? "animate-spin" : ""}
        size={20}
      />
      <span>{authStatus.message}</span>
    </div>
  );
};
