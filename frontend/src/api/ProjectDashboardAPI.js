import { message } from "antd";
import axiosInstance from "../utils/apiInstance";

const getTasks = async (projectID, page, records, filter) => {
    try {
        let urlString = "/task/?project_id=" + projectID+"&page="+page+"&records="+records+"&task_status="+filter;
        let response = await axiosInstance.get(urlString);
        return response.data;
    } catch {
        message.error("Error fetching tasks.")
    }
};

export { getTasks }