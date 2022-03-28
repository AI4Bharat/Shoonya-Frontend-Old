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

const getInstanceIds = async (datasetType) => {
  try {
    let response = await axiosInstance.get(
      `/data/instances/?dataset_type=${datasetType}`
    );
    return response.data;
  } catch (e) {
    message.error("Error fetching Instance ID");
  }
};

const getData = async (instanceIds) => {
  try {
    let response = await axiosInstance.post(`/data/dataitems/get_data_items/`, {
      instance_ids: instanceIds,
    });
    return response.data;
  } catch (e) {
    message.error("Error fetching Data");
  }
};

const createProject = async (data) => {
  try {
    let response = await axiosInstance.post(`/projects/`, data);
    return response.data;
  } catch {
    message.error("Error creating project");
  }
};

export { getDomains, getInstanceIds, getData, createProject };
