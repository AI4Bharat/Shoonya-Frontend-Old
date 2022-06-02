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

const getProjectMembers = async (project_id) => {
  try {
    let response = await axiosInstance.get(
      `/projects/${project_id}/get_project_users/`
    );
    return response.data;
  } catch {
    message.error(`Error getting project members with id ${project_id}`);
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
  if (emails.length === 0) {
    message.error("Unable to add Annotators(s)")
    return false;
  }

  try {
    let response = await axiosInstance.post(
      `/projects/${id}/add_project_users/`,
      {
        emails,
      }
    );

    if (response.status !== 201) {
      message.error("Unable to add Annotator(s)");
      return false;
    }

    message.success("Successfully Added Annotator(s)");
    return true;
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
    let response = await axiosInstance.put(`/projects/${id}/`, payload);

    if (response.status !== 200)
      return message.error("Unable to update Project");

    message.success("Successfully Updated Project");
    return;
  } catch (error) {
    message.error(error);
  }
};
const exportProject = async (id) => {
  try {
    let response = await axiosInstance.post(`/projects/${id}/project_export/`);

    if (response.status !== 200){
      return message.error("Unable to Export Project");
    }
      message.success("Successfully Exported Project");
      return;
    } catch (error) {
      message.error(error);
    }
};

const PullNewData = async (id) => {
  try {
    let response = await axiosInstance.post(`/projects/${id}/pull_new_items/` );

    let result =  response.data.message


    if (response.status !== 200){
      return message.error("Unable to pull New Items Add more Annotators");
    }
    
      message.success("This Project is pulled");
      message.info(result);

    return;
  } catch (error) {
    message.error(error);
  }
};
const downloadProject = async (id) => {

  try {
    let response = await axiosInstance.get(`/projects/${id}/download?export_type=CSV`);
    console.log(response,"data")
    if (response.status !== 200){
      return message.error("Unable to Download Project");
    }
      message.success("Successfully Downloaded Project");
     
      return response;
    } catch (error) {
      message.error(error);
    }
};

export {
  fetchProjects,
  getProject,
  addAnnotatorsToProject,
  publishProject,
  updateProject,
  getProjectMembers ,
  exportProject,
  PullNewData,
  downloadProject,
};
