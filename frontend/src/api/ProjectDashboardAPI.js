import { message } from "antd";
import axiosInstance from "../utils/apiInstance";

const getTasks = async (projectID, page, records, filters) => {
    try {
        let urlString = "/task/?project_id=" + projectID+"&page="+page+"&records="+records+"&task_statuses="+filters.toString();
        let response = await axiosInstance.get(urlString);
        return response.data;
    } catch {
        message.error("Error fetching tasks.")
    }
};

const getReviewTasks = async (projectID, page, records) => {
    try {
        let urlString = "/task/?project_id=" + projectID+"&page="+page+"&records="+records+"&mode=review";
        let response = await axiosInstance.get(urlString);
        return response.data;
    } catch {
        message.error("Error fetching tasks.")
    }
};

export { getTasks, getReviewTasks }