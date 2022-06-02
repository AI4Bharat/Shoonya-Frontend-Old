import { message } from "antd";
import axiosInstance from "../utils/apiInstance";

const fetchDataitems = async (instanceIds, page, records) => {
    try {
      let response = await axiosInstance.post(`/data/dataitems/get_data_items/?page=${page}&records=${records}`, {
        instance_ids: instanceIds,
      });
      return response.data;
    } catch (e) {
      message.error("Error fetching Data");
    }
  };

export {
    fetchDataitems,
}