import { message } from "antd";
import axiosInstance from "../utils/apiInstance";

const fetchProfile = async (userID) => {
  try {
    let response = await axiosInstance.get(`/users/account/${userID}/fetch/`);
    return response.data;
  } catch {
    message.error("Error fetching profile");
  }
};
export { fetchProfile };
