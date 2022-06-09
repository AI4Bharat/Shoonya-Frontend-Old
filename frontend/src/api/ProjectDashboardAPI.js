import { message } from "antd";
import axiosInstance from "../utils/apiInstance";

const getTasks = async (projectID, page, records, filter, userFilter=-1, searchFilters={}) => {
    try {
        let urlString = userFilter === -1 ? 
            "/task/?project_id=" + projectID+"&page="+page+"&records="+records+"&task_status="+filter 
            :"/task/?project_id=" + projectID+"&page="+page+"&records="+records+"&task_status="+filter+"&user_filter="+userFilter;
        if(searchFilters) {
            for (let key in searchFilters) {
                urlString += "&search_"+key.toLowerCase()+"="+searchFilters[key];
            }
        }
        console.log(urlString);
        let response = await axiosInstance.get(urlString);
        return response.data;
    } catch {
        message.error("Error fetching tasks.")
    }
};

export { getTasks }