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

const postAnnotation = async (result, task, completed_by, load_time, lead_time, task_status, notes) => {
  try {
    await axiosInstance.post(`/annotation/`, {
      result: result,
      task: task,
      completed_by: completed_by,
      lead_time: (new Date() - load_time) / 1000 + Number(lead_time ?? 0),
      task_status: task_status,
      notes: notes
    },
    )
    .then((res)=> {
    if(res.status != 201){
      message.error(res.data.message)
    }
  })
  } catch {
    message.error("Error submitting annotations");
  }
};

const patchAnnotation = async (result, annotationID, load_time, lead_time, task_status, notes) => {
  try {
    await axiosInstance.patch(`/annotation/${annotationID}/`, {
      result: result,
      lead_time: (new Date() - load_time) / 1000 + Number(lead_time ?? 0),
      task_status: task_status,
      notes: notes
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

const getNextProject = async (projectID, taskID) => {
  try {
    let labellingMode= localStorage.getItem("labellingMode");
    let requestUrl = labellingMode ? `/projects/${projectID}/next/?current_task_id=${taskID}&task_status=${labellingMode}` : `/projects/${projectID}/next/?current_task_id=${taskID}`;
    let response = await axiosInstance.post(requestUrl, {
      id: projectID,
    });
    if (response.status === 204) {
      if (localStorage.getItem("labelAll"))
        window.location.href = `/projects/${projectID}`;
      message.info("No more tasks for this project.");
    } else {
      return response.data;
    }
  } catch (err) {
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
  deleteAnnotation,
  fetchAnnotation
};
