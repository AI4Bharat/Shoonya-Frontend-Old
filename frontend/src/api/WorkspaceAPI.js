import { message } from "antd";
import axiosInstance from "../utils/apiInstance";

// const inviteUsers = async (emails, organizationID) => {
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

const addAnnotatorsToWorkspace = async (workspaceID, users) => {
  try {
    let response = await axiosInstance.post(
      `workspaces/${workspaceID}/addmembers/`,
      { user_id: users?.join() }
    );
    return response.data;
  } catch {
    message.error("Error adding users");
  }
};

const removeAnnotatorsFromWorkspace = async (workspaceID, users) => {
  try {
    let response = await axiosInstance.post(
      `workspaces/${workspaceID}/removemembers/`,
      { user_id: users?.join() }
    );
    return response.data;
  } catch {
    message.error("Error adding users");
  }
};

const fetchUsersInWorkspace = async (workspaceID) => {
  try {
    let response = await axiosInstance.get(`workspaces/${workspaceID}/members/`);
    return response.data;
  } catch {
    message.error("Error fetching users");
  }
};
const fetchWorkspaceProjects = async (workspaceID) => {
  try {
    let response = await axiosInstance.get(
      `workspaces/${workspaceID}/projects/`
    );
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

const fetchWorkspaces = async (page) => {
  try {
    let response = await axiosInstance.get(`/workspaces/?page=` + page);
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
    return false;
  }
};

const archiveWorkspace = async (workspaceID) => {
  return axiosInstance
    .post(`/workspaces/${workspaceID}/archive/`)
    .then((response) => response.status === 200)
    .catch(() => {
      message.error("Error archiving workspace");
      return false;
    });
};

const assignManager = async (workspaceId, username) => {
  return axiosInstance
    .post(`/workspaces/${workspaceId}/assign_manager/`, { username })
    .then((response) => response.status === 200)
    .catch(() => {
      message.error("Error assigning manager");
      return false;
    });
};

const unAssignManagers = async (workspaceId, usernames) => {
  return axiosInstance
    .post(`/workspaces/${workspaceId}/unassign_manager/`, { usernames })
    .then((response) => response.status === 200)
    .catch(() => {
      message.error("Error unassigning managers");
      return false;
    });
};

export {
  createWorkspace,
  fetchWorkspaces,
  fetchUsersInWorkspace,
  fetchWorkspaceData,
  fetchWorkspaceProjects,
  archiveWorkspace,
  assignManager,
  unAssignManagers,
  addAnnotatorsToWorkspace,
  removeAnnotatorsFromWorkspace,
};
