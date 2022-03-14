import { useReducer } from "react";
import UserContext from "./UserContext";
import UserReducer from "./UserReducer";
import axiosInstance from "../../utils/apiInstance";
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
  const login =  (formData) => {
    axiosInstance
      .post("users/auth/jwt/create", {
        email: formData.email,
        password: formData.password,
      })
      .then((res) => {
        dispatch({ type: LOGIN_SUCCESS, payload: res.data });
        loadUser();

      })
      .catch((err) => {
        dispatch({ type: LOGIN_FAIL, payload: err.response.data });
        message.error("Error logging in");
      });
  };
  const register = async ({ formData, inviteCode }) => {
    await axiosInstance
      .patch(`users/invite/${inviteCode}/accept/`, formData)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        dispatch({ type: REGISTER_FAIL, payload: err.response.data });
        return err;
      });
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
      .catch((err) => {
        dispatch({ type: PASSWORD_CHANGED_FAIL });
        message.error("Server Error");
      });

    return "Result";
  };
  const confirmForgetPassword = async ({ formData, key, token }) => {
    axiosInstance
      .post(`users/auth/users/reset_password_confirm`, {
        uid: key,
        token: token,
        new_password: formData.password,
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const loadUser = () => {
    axiosInstance
      .get("users/account/me/fetch")
      .then((res) => {
        dispatch({ type: USER_LOADED, payload: res.data });
      })
      .catch((err) => {
        message.error("Error fetching user data.");
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
        confirmForgetPassword,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export default UserState;
