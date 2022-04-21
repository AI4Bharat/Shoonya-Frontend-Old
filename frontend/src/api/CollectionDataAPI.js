import { message } from "antd";
import axiosInstance from "../utils/apiInstance";

const createTask = async (data, project_id) => {
  const dataObj = {
    data,
    project_id,
  };

  try {
    let response = await axiosInstance.post("/task/", dataObj);
    return response.data;
  } catch (error) {
    message.error("Error creating Task");
  }
};

const updateTask = async (data, project_id, task_id) => {
  const dataObj = {
    data,
    project_id,
  };

  try {
    let response = await axiosInstance.patch(`/task/${task_id}/`, dataObj);
    return response.data;
  } catch (error) {
    message.error("Error Updating Task");
  }
};

export { createTask, updateTask };
