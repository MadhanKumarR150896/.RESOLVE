import { ToastMessages } from "./components/ToastMessages";
import { Routes, Route } from "react-router";
import { lazy, Suspense } from "react";
import { PublicRoute } from "./GuardRoutes/PublicRoute";
import { ProtectedRoute } from "./GuardRoutes/ProtectedRoute";
import { PageLayout } from "./components/PageLayout";
import { TicketRoute } from "./GuardRoutes/TicketRoute";
import { Navigate } from "react-router";
import { Spinner } from "./utils/Reusables";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthProvider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const SigninPage = lazy(() => import("./pages/Signin/SigninPage"));
const DashboardPage = lazy(() => import("./pages/Dashboard/DashboardPage"));
const TicketPage = lazy(() => import("./pages/Ticket/TicketPage"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastMessages />

        <Suspense fallback={<Spinner />}>
          <Routes>
            <Route path="/" element={<Navigate to="/signin" replace />} />
            <Route element={<PublicRoute />}>
              <Route path="/signin" element={<SigninPage />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
              <Route path="/dashboard/user" element={<PageLayout />}>
                <Route index element={<DashboardPage />} />
                <Route path="ticket" element={<TicketPage />} />
                <Route element={<TicketRoute />}>
                  <Route path="ticket/:ticketNumber" element={<TicketPage />} />
                </Route>
              </Route>
            </Route>
            <Route element={<ProtectedRoute allowedRoles={["agent"]} />}>
              <Route path="/dashboard/agent" element={<PageLayout />}>
                <Route index element={<DashboardPage />} />
                <Route path="ticket" element={<TicketPage />} />
                <Route element={<TicketRoute />}>
                  <Route path="ticket/:ticketNumber" element={<TicketPage />} />
                </Route>
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/signin" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
    </QueryClientProvider>
  );
};

export default App;
