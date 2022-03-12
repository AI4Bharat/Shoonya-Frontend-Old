import React from "react";
import { Route, Routes } from "react-router-dom";
import { Login } from "./pages/Auth/Login";
import App from "./App";
import { ForgetPassword } from "./pages/Auth/ForgetPassword";
import LSF from "./pages/Label-Studio/LSF";
import DataManagerTest from "./pages/DataManager/dm2";
import {SignUp} from "./pages/Auth/SignUp";
import { ConfirmForgetPassword } from "./pages/Auth/ConfirmForgetPassword";

function GlobalRoutes() {
  return (
    <Routes>
      <Route path="/">
        <Route index element={<App />} />
        <Route path="lsf-test" element={<LSF />} />
        <Route path="datamanager" element={<DataManagerTest/>}/>
        <Route path="login" element={<Login />} />
        <Route path="sign-up/:inviteCode" element={<SignUp />} />
        <Route path="forget-password" element={<ForgetPassword />} />
        <Route path="forget-password/confirm/:key/:token" element={<ConfirmForgetPassword />} />
      </Route>
    </Routes>
  );
}

export default GlobalRoutes;
