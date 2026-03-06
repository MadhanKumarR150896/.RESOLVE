import { Routes, Route } from "react-router";
import { LoginPage } from "./pages/Login/LoginPage";
import { AgentPage } from "./pages/Agent/AgentPage";
import { UserPage } from "./pages/User/UserPage";
import { ProtectedRoute } from "./pages/components/ProtectedRoute";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
        <Route path="/dashboard/user" element={<UserPage />} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={["agent"]} />}>
        <Route path="/dashboard/agent" element={<AgentPage />} />
      </Route>
    </Routes>
  );
};

export default App;
