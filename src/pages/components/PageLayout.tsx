import { Outlet } from "react-router";
import { Header } from "./Header";

export const PageLayout = () => {
  return (
    <div className="base gap-2 p-2 min-w-264">
      <Header />
      <main className="min-h-150 flex-1 flex flex-col bg-neutral-100 rounded border shadow shadow-neutral-500">
        <Outlet />
      </main>
    </div>
  );
};
