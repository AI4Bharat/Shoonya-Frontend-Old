import { message } from "antd";
import axiosInstance from "../utils/apiInstance";

const getTasks = async (projectID) => {
    console.log('Project ID is ', projectID);
    try {
        let urlString = "/projects/" + projectID + "/get_project_tasks/";
        let response = await axiosInstance.get(urlString);
        console.log(response);
        return response.data;
    } catch {
        message.error("Error fetching tasks.")
    }
};

const getColumnNames = async (data) => {
    console.log(data);
}

export { getTasks, getColumnNames }