import { AuthMessage } from "./pages/components/AuthMessage";
import { Routes, Route } from "react-router";
import { PublicRoute } from "./GuardRoutes/PublicRoute";
import { SigninPage } from "./pages/Signin/SigninPage";
import { ProtectedRoute } from "./GuardRoutes/ProtectedRoute";
import { PageLayout } from "./pages/components/PageLayout";
import { AgentDashboard } from "./pages/Agent/AgentDashboard";
import { UserDashboard } from "./pages/User/UserDashboard";
import { UserTicketForm } from "./pages/User/UserTicketForm";
import { AgentTicketForm } from "./pages/Agent/AgentTicketForm";
import { Navigate } from "react-router";

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
            <Route path="ticket" element={<UserTicketForm />} />
            <Route path="ticket/:ticketId" element={<UserTicketForm />} />
          </Route>
        </Route>
        <Route element={<ProtectedRoute allowedRoles={["agent"]} />}>
          <Route path="/dashboard/agent" element={<PageLayout />}>
            <Route index element={<AgentDashboard />} />
            <Route path="ticket" element={<AgentTicketForm />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/signin" replace />} />
      </Routes>
    </>
  );
};

export default App;
