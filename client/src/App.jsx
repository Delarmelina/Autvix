import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import { VerifyLogin } from "./services/methods/usermethods";
import "./App.css";

import Login from "./pages/auth/index";
import Home from "./pages/home/index";

function App() {
  const [isLogged, setIsLogged] = useState(1);

  async function verifyLogin() {
    const code = await VerifyLogin();
    if (code === 0) {
      setIsLogged(0);
    }
  }

  useEffect(() => {
    verifyLogin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }
  , []);

  return (
    <Routes>
      <Route path="*" element={isLogged === 0 ? <Home /> : null} />
      <Route path="login" element={isLogged === 0 ? null : <Login />} />
    </Routes>
  );
}

export default App;
