import { message } from "antd";
import axiosInstance from "../utils/apiInstance";

const fetchProjects = async () => {
  try {
    let response = await axiosInstance.get(`/projects/`);
    console.log(response.data);
    return response.data;
  } catch {
    message.error("Error fetching projects");
  }
};

export { fetchProjects };
