import { message } from "antd";
import axiosInstance from "../utils/apiInstance";

const fetchWorkspaces = async () => {
  try {
    let response = await axiosInstance.get(`/workspaces/`);
    console.log(response.data)
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
export { createWorkspace, fetchWorkspaces };
