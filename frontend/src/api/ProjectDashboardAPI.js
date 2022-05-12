import { message } from "antd";
import axiosInstance from "../utils/apiInstance";

const getTasks = async (projectID, page) => {
    try {
        let urlString = "/task/?project_id=" + projectID+"&page="+page;
        let response = await axiosInstance.get(urlString);
        return response.data;
    } catch {
        message.error("Error fetching tasks.")
    }
};

export { getTasks }