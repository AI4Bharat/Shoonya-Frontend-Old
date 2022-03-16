import { message } from "antd";
import axiosInstance from "../utils/apiInstance";

const inviteUsers = async (emails, id) => {
  try {
    let response = await axiosInstance.post(`/users/invite/generate/`, {
      emails: emails,
      organization_id: id,
    });
    return response.data;
  } catch {
    message.error("Error inviting users");
  }
};
export { inviteUsers };
