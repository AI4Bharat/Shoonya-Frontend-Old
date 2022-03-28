import { message } from "antd";
import axiosInstance from "../utils/apiInstance";

const fetchProfile = async (userID) => {
  try {
    let response = await axiosInstance.get(`/users/account/${userID}/fetch/`);
    return response.data;
  } catch {
    message.error("Error fetching profile");
  }
};

const userProfileEdit = async ({
  email,
  first_name,
  last_name,
  username,
  phone,
}) => {
  try {
    let response = await axiosInstance.patch("users/account/update/", {
      email,
      first_name,
      last_name,
      username,
      phone,
    });

    if (response.status !== 200) throw new Error("Error Updating User Profile");

    return {
      email,
      first_name,
      last_name,
      username,
      phone,
    };
  } catch (err) {
    message.error("Error : Unable to Edit User Profile");
  }
};

const organizationEdit = async ({
  id,
  created_by,
  title,
  email_domain_name,
}) => {
  try {
    let response = await axiosInstance.patch(`organizations/${id}/`, {
      created_by,
      title,
      email_domain_name,
    });

    if (response.status !== 200)
      throw new Error("Error : Unable to edit Organization");

    return {
      created_by,
      title,
      email_domain_name,
    };
  } catch {
    message.error("Error : Unable to edit Organization");
  }
};

export { fetchProfile, userProfileEdit, organizationEdit };
