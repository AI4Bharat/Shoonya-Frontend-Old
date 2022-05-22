import React, { useReducer } from "react";
import UserContext from "./UserContext";
import UserReducer from "./UserReducer";
import axiosInstance from "../../utils/apiInstance";
import PropTypes from "prop-types";
import {
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  LOGOUT,
  PASSWORD_CHANGED,
  PASSWORD_CHANGED_FAIL,
  REGISTER_FAIL,
  USER_LOADED,
} from "../type";
import { message } from "antd";

const ACCESS_TOKEN = "shoonya_access_token";
const REFRESH_TOKEN = "shoonya_refresh_token";

const UserState = (props) => {
  const initialState = {
    access:
      localStorage.getItem(ACCESS_TOKEN) !== "undefined"
        ? localStorage.getItem(ACCESS_TOKEN)
        : undefined,
    refresh:
      localStorage.getItem(REFRESH_TOKEN) !== "undefined"
        ? localStorage.getItem(REFRESH_TOKEN)
        : undefined,
    user: null,
    isAuth: false,
    isError: null,
  };
  const [state, dispatch] = useReducer(UserReducer, initialState);
  const login = async (formData) => {
    try {
      let res = await axiosInstance.post("users/auth/jwt/create", {
        email: formData.email,
        password: formData.password,
      });
      dispatch({ type: LOGIN_SUCCESS, payload: res.data });
    } catch (err) {
      dispatch({ type: LOGIN_FAIL, payload: err.response.data });
      message.error("Error logging in");
    }
  };
  const register = async ({ formData, inviteCode }) => {
    try {
      await axiosInstance.patch(`users/invite/${inviteCode}/accept/`, formData);
    } catch (err) {
      dispatch({ type: REGISTER_FAIL, payload: err.response.data });
      throw "Error"
    }
  };
  const logout = async () => {
    dispatch({ type: LOGOUT });
  };
  const forgetPassword = ({ email }) => {
    axiosInstance
      .post("users/auth/users/reset_password/", {
        email: email,
      })
      .then((res) => {
        if (res.status === 204) {
          dispatch({ type: PASSWORD_CHANGED });
        } else {
          dispatch({ type: PASSWORD_CHANGED_FAIL });
          message.error("Wrong Email!");
        }
      })
      .catch(() => {
        dispatch({ type: PASSWORD_CHANGED_FAIL });
        message.error("Server Error");
      });

    return "Result";
  };
  const confirmForgetPassword = async ({ formData, key, token }) => {
    axiosInstance
      .post("users/auth/users/reset_password_confirm/", {
        uid: key,
        token: token,
        new_password: formData.password,
      })
      .then((res) => {
        message.success('Password changed successfully!');
      })
      .catch((err) => {
        message.error("Error changing password");
      });
  };
  const loadUser = async () => {
    try {
      let res = await axiosInstance.get("users/account/me/fetch");
      dispatch({ type: USER_LOADED, payload: res.data });
    } catch (err) {
      // console.log(err);
      message.error("Error fetching user data.");
    }
  };
  return (
    <UserContext.Provider
      value={{
        access: state.access,
        refresh: state.refresh,
        user: state.user,
        isAuth: state.isAuth,
        isError: state.isError,
        login,
        logout,
        loadUser,
        register,
        forgetPassword,
        confirmForgetPassword,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

UserState.propTypes = {
  children: PropTypes.any,
};

export default UserState;
