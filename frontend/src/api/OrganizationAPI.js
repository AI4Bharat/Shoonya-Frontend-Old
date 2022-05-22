import { message } from "antd";
import axiosInstance from "../utils/apiInstance";

const inviteUsers = async (emails, organizationID, role) => {
  if (role === 0) {
    message.error("Please select a role for users!");
    return;
  }
  if (role === '' || role === undefined) {
    message.error("Plaase select a role for users!");
    return;
  }
  try {
    let response = await axiosInstance.post(`/users/invite/generate/`, {
      emails: emails,
      organization_id: organizationID,
      role: role,
    });

    return response.data;
  } catch {
    message.error("Error inviting users");
  }
};

const fetchUsers = async (organizationID) => {
  try {
    let response = await axiosInstance.get(
      `organizations/${organizationID}/users/`
    );
    return response.data;
  } catch (err) {
    message.error("Error fetching users");
  }
};
export { inviteUsers, fetchUsers };
