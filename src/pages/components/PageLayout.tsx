import { Outlet } from "react-router";
import { Header } from "./Header";

export const PageLayout = () => {
  return (
    <div className="flex flex-col h-dvh bg-neutral-50 text-neutral-900 text-base gap-2 p-2 min-w-230">
      <Header />
      <main className="min-h-180 flex-1 overflow-hidden flex flex-col bg-neutral-100 rounded border shadow shadow-neutral-500">
        <Outlet />
      </main>
    </div>
  );
};
