import { message } from "antd";
import axiosInstance from "../utils/apiInstance";

// const inviteUsers = async (emails, organizationID) => {
//   console.log("ID is", organizationID);
//   try {
//     let response = await axiosInstance.post(`/users/invite/generate/`, {
//       emails: emails,
//       organization_id: organizationID,
//     });
//     return response.data;
//   } catch {
//     message.error("Error inviting users");
//   }
// };

const fetchUsersInWorkspace = async (workspaceID) => {
  try {
    let response = await axiosInstance.get(`workspaces/${workspaceID}/users/`);
    return response.data;
  } catch {
    message.error("Error fetching users");
  }
};
const fetchWorkspaceProjects = async (workspaceID) => {
  try {
    let response = await axiosInstance.get(`workspaces/${workspaceID}/projects/`);
    return response.data;
  } catch {
    message.error("Error fetching users");
  }
};

const fetchWorkspaceData = async (workspaceID) => {
  try {
    let response = await axiosInstance.get(`workspaces/${workspaceID}/`);
    return response.data;
  } catch {
    message.error("Error fetching Workspace details");
  }
};

const fetchWorkspaces = async () => {
  try {
    let response = await axiosInstance.get(`/workspaces/`);
    return response.data;
  } catch {
    message.error("Error fetching workspaces");
  }
};

const createWorkspace = async (data) => {
  try {
    let response = await axiosInstance.post(`/workspaces/`, data);
    return response.data;
  } catch {
    message.error("Error creating workspace");
  }
};


export {
  createWorkspace,
  fetchWorkspaces,
  fetchUsersInWorkspace,
  fetchWorkspaceData,
  fetchWorkspaceProjects
};
