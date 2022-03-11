import React, { useContext, useEffect } from "react";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import { Login } from "./pages/Auth/Login";
import App from "./App";
import { ForgetPassword } from "./pages/Auth/ForgetPassword";
import { SignUp } from "./pages/Auth/SignUp";
import UserProfile from "./pages/Profile/UserProfile";
import UserContext from "./context/User/UserContext";
import LSF from "./pages/Label-Studio/LSF";
import { ConfirmForgetPassword } from "./pages/Auth/ConfirmForgetPassword";

function RequireAuth({ children }) {
  let location = useLocation();
  let userContext = useContext(UserContext);
  if (!userContext.access) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}
function GlobalRoutes() {
  let userContext = useContext(UserContext);
  useEffect(() => {
    if (userContext.access) {
      userContext.loadUser();
    }
    // eslint-disable-next-line
  }, []);

  return (
    <Routes>
      <Route path="/">
        <Route index element={<App />} />
        <Route path="lsf-test" element={<LSF />} />
        <Route path="login" element={<Login />} />
        <Route path="sign-up/:inviteCode" element={<SignUp />} />
        <Route path="forget-password" element={<ForgetPassword />} />
        <Route
          path="profile/*"
          element={
            <RequireAuth>
              <UserProfile />
            </RequireAuth>
          }
        />
        <Route path="forget-password/confirm/:key/:token" element={<ConfirmForgetPassword />} />
      </Route>
    </Routes>
  );
}

export default GlobalRoutes;
