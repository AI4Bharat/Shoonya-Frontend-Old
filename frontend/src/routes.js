import React, { useContext, useEffect } from "react";
import App from "./App";
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from "react-router-dom";
import { Login } from "./pages/Auth/Login";
import { ForgetPassword } from "./pages/Auth/ForgetPassword";
import { SignUp } from "./pages/Auth/SignUp";
import { ConfirmForgetPassword } from "./pages/Auth/ConfirmForgetPassword";
import Organization from "./pages/Organization/Organization";
import UserProfile from "./pages/Profile/UserProfile";
import Workspace from "./pages/Workspace/Workspace";
import UserContext from "./context/User/UserContext";
import LSF from "./pages/Label-Studio/LSF";
import ProjectDashboard from "./pages/Projects/ProjectDashboard"
import { Result, Button } from "antd";
import DefinedLayout from "./components/Layout/DefinedLayout";
import PropTypes from "prop-types";
import CreateProject from "./pages/CreateProject/CreateProject";
import CreateCollectionProject from "./pages/CreateProject/CreateCollectionProject";
import ProjectSettings from "./pages/Projects/ProjectSettings";
import AddCollectionData from "./components/AddCollectionData";
import Landing from "./pages/Landing/Landing";
import DatasetDashboard from "./pages/Dataset/DatasetDashboard";

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
    }
    // eslint-disable-next-line
  }, [userContext.refresh]);

  return (
    <Router>
      <Routes>
        <Route index element={<App />} />
        <Route path="login" element={<Login />} />
        <Route path="invite/:inviteCode" element={<SignUp />} />
        <Route path="forget-password" element={<ForgetPassword />} />
        <Route
          path="forget-password/confirm/:key/:token"
          element={<ConfirmForgetPassword />}
        />
        
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
            path="dashboard"
            element={
              <RequireAuth>
                <Landing />
              </RequireAuth>
            }
          />
          <Route
            path="projects/:project_id"
            component={ProjectDashboard}
            element={
              <RequireAuth>
                <ProjectDashboard />
              </RequireAuth>
            }
          />

          <Route 
            path="projects/:project_id/task/:task_id" 
            component={LSF}
            element={
              <RequireAuth>
                <LSF />
              </RequireAuth>
            } 
          />
          
          <Route
            path="projects/:id/settings"
            element={
              <RequireAuth>
                <ProjectSettings />
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
            path="add-collection-data/:id"
            element={
              <RequireAuth>
                <AddCollectionData />
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
          <Route
            path="dataset/:dataset_id"
            element={
              <RequireAuth>
                <DatasetDashboard />
              </RequireAuth>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

RequireAuth.propTypes = {
  children: PropTypes.any,
};

export default GlobalRoutes;
