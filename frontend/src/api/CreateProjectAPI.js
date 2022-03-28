import axiosInstance from "../utils/apiInstance";
import { message } from "antd";

const getDomains = async () => {
  try {
    let response = await axiosInstance.get(`/projects/types/`);
    return response.data;
  } catch (e) {
    message.error("Error fetching Types");
  }
};

export { getDomains };
