import React, { useContext, useEffect } from "react";
import App from "./App";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import { Login } from "./pages/Auth/Login";
import { ForgetPassword } from "./pages/Auth/ForgetPassword";
import { SignUp } from "./pages/Auth/SignUp";
import { ConfirmForgetPassword } from "./pages/Auth/ConfirmForgetPassword";
import Organization from "./pages/Organization/Organization";
import UserProfile from "./pages/Profile/UserProfile";
import Workspace from "./pages/Workspace/Workspace";
import UserContext from "./context/User/UserContext";
import LSF from "./pages/Label-Studio/LSF";
import { Result, Button } from "antd";
import DefinedLayout from "./components/Layout/DefinedLayout";
import PropTypes from "prop-types";
import CreateProject from "./pages/CreateProject/CreateProject";
import CreateCollectionProject from "./pages/CreateProject/CreateCollectionProject";
import ViewCollectionProject from "./pages/ViewProject/ViewCollectionProject";

function RequireAuth({ children }) {
  let location = useLocation();
  let userContext = useContext(UserContext);
  if (!userContext.refresh || !userContext.access) {
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
    if (localStorage.getItem("shoonya_refresh_token")) {
      userContext.loadUser();
      console.log("Fetching user")
    }
    // eslint-disable-next-line
  }, [userContext.refresh]);

  return (
    <Routes>
      <Route index element={<App />} />
      <Route path="login" element={<Login />} />
      <Route path="sign-up/:inviteCode" element={<SignUp />} />
      <Route path="forget-password" element={<ForgetPassword />} />
      <Route
        path="forget-password/confirm/:key/:token"
        element={<ConfirmForgetPassword />}
      />
      <Route path="lsf-test" element={<LSF />} />
      <Route path="/" element={<DefinedLayout />}>
        <Route
          path="profile/*"
          element={
            <RequireAuth>
              <UserProfile />
            </RequireAuth>
          }
        />

        <Route
          path="organization/:id"
          element={
            <RequireAuth>
              <Organization />
            </RequireAuth>
          }
        />
        <Route
          path="workspace/:id"
          element={
            <RequireAuth>
              <Workspace />
            </RequireAuth>
          }
        />
        <Route
          path="create-annotation-project/:id"
          element={
            <RequireAuth>
              <CreateProject />
            </RequireAuth>
          }
        />
        <Route
          path="create-collection-project/:id"
          element={
            <RequireAuth>
              <CreateCollectionProject />
            </RequireAuth>
          }
        />
        <Route
          path="project/:id"
          element={
            <RequireAuth>
              <ViewCollectionProject />
            </RequireAuth>
          }
        />
        <Route
          path="*"
          element={
            <Result
              status={"404"}
              title="404"
              subTitle="Sorry, the page you visited does not exist."
              extra={<Button type="primary">Back Home</Button>}
            />
          }
        />
      </Route>
    </Routes>
  );
}

RequireAuth.propTypes = {
  children: PropTypes.any,
};

export default GlobalRoutes;
