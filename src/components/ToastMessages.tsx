import { Loader, CircleCheck, X, CircleX } from "lucide-react";
import { useToasterStore } from "../stores/toasterStore";

const icons = {
  loading: Loader,
  error: CircleX,
  success: CircleCheck,
  signedin: CircleCheck,
  signedout: CircleCheck,
  signinfailed: CircleX,
  signoutfailed: CircleX,
};

export const ToastMessages = () => {
  const toasters = useToasterStore((state) => state.toasters);
  const removeToaster = useToasterStore((state) => state.removeToaster);

  if (toasters.length === 0) return null;

  return (
    <div className="absolute right-16 top-22 flex flex-col gap-2">
      {toasters.map((toaster) => {
        const MessageIcon = icons[toaster.type];
        return (
          <div
            key={`${toaster.id}-${toaster.type}`}
            className={`flex gap-4 items-center border shadow shadow-neutral-900 bg-neutral-200 z-50 text-sm py-2 px-3 rounded`}
          >
            <MessageIcon
              className={`mt-0.75 self-start ${toaster.type === "loading" ? "animate-spin" : ""}`}
              size={20}
            />
            <span className="w-65">{toaster.message}</span>

            <button
              className="ml-auto mt-1 self-start cursor-pointer"
              onClick={() => removeToaster(toaster.id)}
            >
              <X strokeWidth={3} size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
