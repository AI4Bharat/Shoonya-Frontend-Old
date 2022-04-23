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

const getProject = async (project_id) => {
  try {
    let response = await axiosInstance.get(`/projects/${project_id}`);
    return response.data;
  } catch {
    message.error(`Error getting project with id ${project_id}`);
  }
};

const addAnnotatorsToProject = async (id, emails) => {
  try {
    let response = await axiosInstance.post(
      `/projects/${id}/add_project_users/`,
      {
        emails,
      }
    );

    if (response.status !== 201) {
      return message.error("Unable to add Annotator(s)");
    }

    message.success("Successfully Added Annotator(s)");
    return;
  } catch (error) {
    message.error(error);
  }
};

const publishProject = async (id) => {
  try {
    let response = await axiosInstance.post(`/projects/${id}/project_publish/`);

    if (response.status !== 200)
      return message.error("Unable to Publish Project");

    if (response.data.message === "This project is published")
      message.success("This Project is Published");
    else message.success("This Project has already been Published");

    return;
  } catch (error) {
    message.error(error);
  }
};

const updateProject = async (id, payload) => {
  try {
    console.log("Payload is ", payload);
    let response = await axiosInstance.put(`/projects/${id}/`, payload);

    if (response.status !== 200)
      return message.error("Unable to update Project");

    message.success("Successfully Updated Project");
    return;    
  } catch (error) {
    message.error(error);
  }
}

export { fetchProjects, getProject, addAnnotatorsToProject, publishProject, updateProject };
