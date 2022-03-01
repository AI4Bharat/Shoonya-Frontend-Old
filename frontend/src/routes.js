import React from "react";
import { Route, Routes } from "react-router-dom";
import { Login } from "./pages/Auth/Login";
import App from "./App";
import { ForgetPassword } from "./pages/Auth/ForgetPassword";
import {SignUp} from "./pages/Auth/SignUp";

function GlobalRoutes() {
  return (
    <Routes>
      <Route path="/">
        <Route index element={<App />} />
        <Route path="login" element={<Login />} />
        <Route path="sign-up" element={<SignUp />} />
        <Route path="forget-password" element={<ForgetPassword />} />
      </Route>
    </Routes>
  );
}

export default GlobalRoutes;
