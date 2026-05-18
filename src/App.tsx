import { ToastMessage } from "./pages/components/ToastMessage";
import { Routes, Route } from "react-router";
import { lazy, Suspense } from "react";
import { PublicRoute } from "./GuardRoutes/PublicRoute";
import { ProtectedRoute } from "./GuardRoutes/ProtectedRoute";
import { PageLayout } from "./pages/components/PageLayout";
import { TicketRoute } from "./GuardRoutes/TicketRoute";
import { Navigate } from "react-router";
import { Spinner } from "./utils/ReusableElements";

const SigninPage = lazy(() => import("./pages/Signin/SigninPage"));
const TicketsDash = lazy(() => import("./pages/Dashboard/TicketsDash"));
const TicketPage = lazy(() => import("./pages/Ticket/TicketPage"));

const App = () => {
  return (
    <>
      <ToastMessage />
      <Suspense fallback={<Spinner />}>
        <Routes>
          <Route path="/" element={<Navigate to="/signin" replace />} />
          <Route element={<PublicRoute />}>
            <Route path="/signin" element={<SigninPage />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
            <Route path="/dashboard/user" element={<PageLayout />}>
              <Route index element={<TicketsDash />} />
              <Route path="ticket" element={<TicketPage />} />
              <Route element={<TicketRoute />}>
                <Route path="ticket/:ticketNumber" element={<TicketPage />} />
              </Route>
            </Route>
          </Route>
          <Route element={<ProtectedRoute allowedRoles={["agent"]} />}>
            <Route path="/dashboard/agent" element={<PageLayout />}>
              <Route index element={<TicketsDash />} />
              <Route path="ticket" element={<TicketPage />} />
              <Route element={<TicketRoute />}>
                <Route path="ticket/:ticketNumber" element={<TicketPage />} />
              </Route>
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/signin" replace />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default App;
