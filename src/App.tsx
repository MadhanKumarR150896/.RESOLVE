import { Routes, Route } from "react-router";
import { LoginPage } from "./pages/Login/LoginPage";
import { AgentPage } from "./pages/Agent/AgentPage";
import { UserPage } from "./pages/User/UserPage";

const App = () => {
  return (
    <Routes>
      <Route index element={<LoginPage />} />
      <Route path="user" element={<UserPage />}></Route>
      <Route path="agent" element={<AgentPage />}></Route>
    </Routes>
  );
};

export default App;
