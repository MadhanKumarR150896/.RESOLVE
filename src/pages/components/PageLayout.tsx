import { Outlet } from "react-router";
import { Header } from "./Header";

export const PageLayout = () => {
  return (
    <div className="base gap-2 p-2">
      <Header />
      <main className="flex-1 bg-neutral-100 rounded border shadow shadow-neutral-500">
        <Outlet />
      </main>
    </div>
  );
};
