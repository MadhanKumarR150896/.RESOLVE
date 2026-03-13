import { Outlet } from "react-router";
import { Header } from "./Header";

export const PageLayout = () => {
  return (
    <div className="base p-2 flex flex-col gap-2">
      <Header />
      <main className="bg-neutral-100 rounded flex-1 border shadow shadow-neutral-500">
        <Outlet />
      </main>
    </div>
  );
};
