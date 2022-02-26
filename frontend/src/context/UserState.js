import { useReducer } from "react";
import UserContext from "./UserContext";
import UserReducer from "./UserReducer";
import axiosInstance from "../utils/apiInstance";
import { LOGIN_FAIL, LOGIN_SUCCESS, USER_LOADED } from "./type";
import {  message } from "antd";
const UserState = (props) => {
  const initialState = {
    token: null,
    user: null,
    isAuth: false,
    isError: null,
  };
  const [state, dispatch] = useReducer(UserReducer, initialState);
  const login = (formData) => {
    axiosInstance
      .post("users/auth/jwt/create", {
        email: formData.email,
        password: formData.password,
      })
      .then((res) => {
        dispatch({ type: LOGIN_SUCCESS, payload: res.data });
        console.log(res);
        loadUser();
      })
      .catch((err) => {
        dispatch({ type: LOGIN_FAIL, payload: err.response.data });
        message.error("Error logging in");
      });
  };
  const register = async (formData) => {};
  const logout = async () => {};
  const forgetPassword = async (formData) => {};
  const loadUser = async () => {
    axiosInstance
      .get("users/auth/users/me/")
      .then((res) => {
        dispatch({ type: USER_LOADED, payload: res.data });
        console.log(res);
      })
      .catch((err) => {
        message.error("Error fetching user data");
      });
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
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export default UserState;
