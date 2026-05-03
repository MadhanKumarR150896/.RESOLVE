import { Loader, CircleAlert, CircleCheck, X } from "lucide-react";
import { useToasterStore } from "../../store/toasterStore";

const icons = {
  loading: Loader,
  error: CircleAlert,
  success: CircleCheck,
};

export const ToastMessage = () => {
  const toaster = useToasterStore((state) => state.toaster);
  const removeToaster = useToasterStore((state) => state.removeToaster);

  if (toaster.type === "initial") return null;

  const MessageIcon = icons[toaster.type];

  return (
    <div className="min-w-70 flex items-center gap-4 border-none shadow shadow-neutral-900 bg-neutral-200 z-50 text-sm py-2 px-3 rounded absolute right-16 top-24">
      <MessageIcon
        className={toaster.type === "loading" ? "animate-spin" : ""}
        size={20}
      />
      <span>{toaster.message}</span>

      <button className="ml-auto" onClick={removeToaster}>
        <X strokeWidth={3} size={12} />
      </button>
    </div>
  );
};
