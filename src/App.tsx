import { AuthMessage } from "./pages/components/AuthMessage";
import { Routes, Route } from "react-router";
import { PublicRoute } from "./GuardRoutes/PublicRoute";
import { SigninPage } from "./pages/Signin/SigninPage";
import { ProtectedRoute } from "./GuardRoutes/ProtectedRoute";
import { PageLayout } from "./pages/components/PageLayout";
import { AgentDashboard } from "./pages/Dashboard/AgentDashboard";
import { UserDashboard } from "./pages/Dashboard/UserDashboard";
import { TicketPage } from "./pages/Ticket/TicketPage";
import { Navigate } from "react-router";
import { TicketRoute } from "./GuardRoutes/TicketRoute";

const App = () => {
  return (
    <>
      <AuthMessage />
      <Routes>
        <Route path="/" element={<Navigate to="/signin" replace />} />
        <Route element={<PublicRoute />}>
          <Route path="/signin" element={<SigninPage />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
          <Route path="/dashboard/user" element={<PageLayout />}>
            <Route index element={<UserDashboard />} />
            <Route path="ticket" element={<TicketPage />} />
            <Route element={<TicketRoute />}>
              <Route path="ticket/:ticketNumber" element={<TicketPage />} />
            </Route>
          </Route>
        </Route>
        <Route element={<ProtectedRoute allowedRoles={["agent"]} />}>
          <Route path="/dashboard/agent" element={<PageLayout />}>
            <Route index element={<AgentDashboard />} />
            <Route path="ticket" element={<TicketPage />} />
            <Route element={<TicketRoute />}>
              <Route path="ticket/:ticketNumber" element={<TicketPage />} />
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/signin" replace />} />
      </Routes>
    </>
  );
};

export default App;
