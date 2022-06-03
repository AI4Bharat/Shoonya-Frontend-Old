import { message } from "antd";
import axiosInstance from "../utils/apiInstance";

const getTasks = async (projectID, page, records, filter, userFilter=-1) => {
    try {
        let urlString = userFilter === -1 ? 
            "/task/?project_id=" + projectID+"&page="+page+"&records="+records+"&task_status="+filter 
            :"/task/?project_id=" + projectID+"&page="+page+"&records="+records+"&task_status="+filter+"&user_filter="+userFilter;
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