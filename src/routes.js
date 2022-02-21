import React from "react";
import { Route, Routes } from "react-router-dom";
import { Login } from "../src/pages/Auth/Login";
import App from "./App";

function GlobalRoutes() {
  return (
    <Routes>
      <Route path="/">
        <Route index element={<App />} />
        <Route path="login" element={<Login />} />
      </Route>
    </Routes>
  );
}

export default GlobalRoutes;
