import { Outlet } from "react-router";
import { Header } from "../Header/Header";

export const PageLayout = () => {
  return (
    <div
      style={{ scrollbarWidth: "thin" }}
      className="flex flex-col h-dvh w-dvw bg-neutral-50 text-neutral-900 text-base gap-2 p-2 overflow-auto"
    >
      <Header />
      <main className="min-w-250 flex-1 flex flex-col bg-neutral-100 rounded border shadow shadow-neutral-500">
        <Outlet />
      </main>
    </div>
  );
};
