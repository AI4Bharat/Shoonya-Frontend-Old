import { message } from "antd";
import axiosInstance from "../utils/apiInstance";

const fetchProjects = async () => {
  try {
    let response = await axiosInstance.get(`/projects/`);
    return response.data;
  } catch {
    message.error("Error fetching projects");
  }
};

const addAnnotatorsToProject = async (id, emails) => {
  console.log(Array.isArray(emails));
  try {
    let response = await axiosInstance.post(
      `/projects/${id}/add_project_users/`,
      {
        emails,
      }
    );

    console.log(response);
  } catch (error) {
    console.log(error);
  }
};

export { fetchProjects, addAnnotatorsToProject };
