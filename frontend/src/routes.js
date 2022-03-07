import React from "react";
import { Route, Routes } from "react-router-dom";
import { Login } from "./pages/Auth/Login";
import App from "./App";
import { ForgetPassword } from "./pages/Auth/ForgetPassword";
import LSF from "./pages/Label-Studio/LSF";

function GlobalRoutes() {
  return (
    <Routes>
      <Route path="/">
        <Route index element={<App />} />
        <Route path="login" element={<Login />} />
        <Route path="forget-password" element={<ForgetPassword />} />
        <Route path="lsf-test" element={<LSF />} />
      </Route>
    </Routes>
  );
}

export default GlobalRoutes;
