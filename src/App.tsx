import { AuthMessage } from "./pages/components/AuthMessage";
import { Routes, Route } from "react-router";
import { PublicRoute } from "./pages/components/PublicRoute";
import { LoginPage } from "./pages/Login/LoginPage";
import { ProtectedRoute } from "./pages/components/ProtectedRoute";
import { AgentPage } from "./pages/Agent/AgentPage";
import { UserPage } from "./pages/User/UserPage";

const App = () => {
  return (
    <>
      <AuthMessage />
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/" element={<LoginPage />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
          <Route path="/dashboard/user" element={<UserPage />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={["agent"]} />}>
          <Route path="/dashboard/agent" element={<AgentPage />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
