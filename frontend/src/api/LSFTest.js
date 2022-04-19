import { message } from "antd";
import axiosInstance from "../utils/apiInstance";

const fetchProjects = async (projectID) => {
  try {
    let response = await axiosInstance.get(`/projects/${projectID}`);
    // console.log(response.data)
    return response.data;
  } catch {
    message.error("Error fetching projects");
  }
};

const fetchTasks = async (taskID) => {
  try {
    let response = await axiosInstance.get(`/task/${taskID}`);
    // console.log(response.data)
    return response.data;
  } catch {
    message.error("Error fetching tasks");
  }
};

const fetchPredictions = async (taskID) => {
  try {
    let response = await axiosInstance.get(`/task/${taskID}/predictions/`);
    return response.data;
  } catch {
    message.error("Error fetching predictions");
  }
};

const fetchAnnotations = async (taskID) => {
  try {
    let response = await axiosInstance.get(`/task/${taskID}/annotations/`);
    // console.log(response.data)
    return response.data;
  } catch {
    message.error("Error fetching annotations");
  }
};

const postAnnotations = async (result,task,completed_by) => {
  try {
    let response = await axiosInstance.post(`/annotation/`, {
      result: result,
      task: task,
      completed_by: completed_by
    });
    console.log(response.data)
  }
  catch {
    message.error("Error submitting annotations")
  }
}


const patchAnnotation = async (result, annotationID) => {
  try {
    console.log(result)
    let response = await axiosInstance.patch(`/annotation/${annotationID}/`, {
      result: result,
    });
    console.log(response.data)
  }
  catch {
    message.error("Error updating annotations")
  }
}

const postTasks = async (taskID) => {
  try {
    let response = await axiosInstance.patch(`/task/${taskID}/`, {
      task_status: "skipped"
    })
    console.log(response.data)
    return response.data
  }
  catch {
    message.error("Error skipping task.")
  }
}

const getNextProject = async (projectID) => {
  try {
    let response = await axiosInstance.post(`/projects/${projectID}/next/`, {
      id: projectID
    })
    console.log(response.data)
    return response.data
  }
  catch {
    message.error("Error getting next task.")
  }
}

const getProjectsandTasks = async (projectID, taskID) => {
  return Promise.all([fetchProjects(projectID), fetchTasks(taskID), fetchAnnotations(taskID), fetchPredictions(taskID)])
};

export { getProjectsandTasks, postAnnotations, postTasks, getNextProject, patchAnnotation };