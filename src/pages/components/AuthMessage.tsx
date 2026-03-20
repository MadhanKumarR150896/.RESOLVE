import { Loader, CircleAlert, CircleCheck, X } from "lucide-react";
import { useAuthContext } from "../../context/AuthContext";

const icons = {
  loading: Loader,
  error: CircleAlert,
  success: CircleCheck,
};

export const AuthMessage = () => {
  const { authStatus, setAuthStatus } = useAuthContext();

  if (authStatus.type === "initial") return null;

  const MessageIcon = icons[authStatus.type];

  return (
    <div className="min-w-70 flex items-center gap-4 border-none shadow shadow-neutral-900 bg-neutral-200 z-50 text-sm py-2 px-3 rounded absolute right-16 top-24">
      <MessageIcon
        className={authStatus.type === "loading" ? "animate-spin" : ""}
        size={20}
      />
      <span>{authStatus.message}</span>

      <button
        className="ml-auto"
        onClick={() =>
          setAuthStatus({
            type: "initial",
            message: "",
          })
        }
      >
        <X strokeWidth={3} size={12} />
      </button>
    </div>
  );
};
