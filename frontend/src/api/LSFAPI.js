import { message } from "antd";
import axiosInstance from "../utils/apiInstance";

const fetchProject = async (projectID) => {
  try {
    let response = await axiosInstance.get(`/projects/${projectID}`);
    return response.data;
  } catch {
    message.error("Error fetching projects");
  }
};

const fetchTask = async (taskID) => {
  try {
    let response = await axiosInstance.get(`/task/${taskID}`);
    return response.data;
  } catch {
    message.error("Error fetching tasks");
  }
};

const fetchPrediction = async (taskID) => {
  try {
    let response = await axiosInstance.get(`/task/${taskID}/predictions/`);
    return response.data;
  } catch {
    message.error("Error fetching predictions");
  }
};

const fetchAnnotation = async (taskID) => {
  try {
    let response = await axiosInstance.get(`/task/${taskID}/annotations/`);
    return response.data;
  } catch {
    message.error("Error fetching annotations");
  }
};

const postAnnotation = async (result, task, completed_by) => {
  try {
    await axiosInstance.post(`/annotation/`, {
      result: result,
      task: task,
      completed_by: completed_by,
    });
  } catch {
    message.error("Error submitting annotations");
  }
};

const patchAnnotation = async (result, annotationID) => {
  try {
    await axiosInstance.patch(`/annotation/${annotationID}/`, {
      result: result,
    });
  } catch {
    message.error("Error updating annotations");
  }
};

const deleteAnnotation = async (annotationID) => {
  try {
    await axiosInstance.delete(`/annotation/${annotationID}/`);
  } catch {
    message.error("Error deleting annotations");
  }
};

const updateTask = async (taskID) => {
  try {
    let response = await axiosInstance.patch(`/task/${taskID}/`, {
      task_status: "skipped",
    });
    return response.data;
  } catch {
    message.error("Error skipping task.");
  }
};

const getNextProject = async (projectID) => {
  try {
    let response = await axiosInstance.post(`/projects/${projectID}/next/`, {
      id: projectID,
    });
    return response.data;
  } catch {
    message.error("Error getting next task.");
  }
};

const getProjectsandTasks = async (projectID, taskID) => {
  return Promise.all([
    fetchProject(projectID),
    fetchTask(taskID),
    fetchAnnotation(taskID),
    fetchPrediction(taskID),
  ]);
};

export {
  getProjectsandTasks,
  postAnnotation,
  updateTask,
  getNextProject,
  patchAnnotation,
  deleteAnnotation
};
