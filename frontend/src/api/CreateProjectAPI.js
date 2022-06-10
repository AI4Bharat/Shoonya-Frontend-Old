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

const getFieldTypes = async (dataset_type) => {
  try {
    let response = await axiosInstance.get(
      `/data/dataset_fields/${dataset_type}/`
    );
    return response.data;
  } catch (e) {
    message.error("Error fetching dataset field types");
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

const getData = async (instanceIds, datasetType, page=1, records=10) => {
  try {
    let response = await axiosInstance.post(`/data/dataitems/get_data_items/?page=${page}&records=${records}`, {
      instance_ids: instanceIds,
      dataset_type: datasetType,
    });
    if (response.status >= 400) {
      message.error(response.message);
      return null;
    } else {
      return response.data;
    }
  } catch (e) {
    message.error("Error fetching Data");
  }
};

const getProject = async (id) => {
  try {
    let response = await axiosInstance.get(`/projects/${id}/`);
    return response.data;
  } catch (error) {
    message.error("Error Fetching Project");
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

export {
  getDomains,
  getInstanceIds,
  getData,
  getProject,
  getFieldTypes,
  createProject,
};
