import { message } from "antd";
import axiosInstance from "../utils/apiInstance";

const fetchProfile = async (id) => {
  try {
    let response = await axiosInstance.get(`/users/account/${id}/fetch/`);
    return response.data;
  } catch {
    message.error("Error fetching profile");
  }
};
export { fetchProfile };
