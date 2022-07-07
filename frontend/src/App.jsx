import { Routes, Route } from "react-router-dom";

import Login from "./pages/auth/index";
import Home from "./pages/home/index";

function App() {
  return (
    <Routes>
      <Route path="*" element={<Home />} />
      <Route path="login" element={<Login />} />
    </Routes>
  );
}

export default App;
