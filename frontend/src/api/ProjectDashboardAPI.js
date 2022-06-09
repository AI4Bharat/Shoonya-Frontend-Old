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

const getReportsWithinRange = async (projectID, fromDate, toDate) => {
	return axiosInstance.post(`/projects/${projectID}/get_analytics/`, {
		from_date: fromDate,
		to_date: toDate,
	}).then((response)=>{
        if(response.status === 200) {
            return response.data;
        }

        if(response.data?.message) {
            message.error(response.data.message);
        } else {
            message.error('An unknown error occurred')
        }
        return []
    }).catch(()=>{
        message.error('Error fetching report.')
        return [];
    })
};

export { getTasks, getReportsWithinRange }