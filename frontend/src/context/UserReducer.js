import {
  AUTH_ERROR,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  LOGOUT,
  PASSWORD_CHANGED,
  PASSWORD_CHANGED_FAIL,
  REGISTER_FAIL,
  USER_LOADED,
} from "./type";

const ACCESS_TOKEN = "shoonya_access_token";
const REFRESH_TOKEN = "shoonya_refresh_token";
export default (state, action) => {
  switch (action.type) {
    case USER_LOADED:
      return {
        ...state,
        ...action.payload,
        isAuth: true,
        user: action.payload.user,
        isError: null,
      };
    case LOGIN_SUCCESS:
      localStorage.setItem(ACCESS_TOKEN, action.payload.access);
      localStorage.setItem(REFRESH_TOKEN, action.payload.refresh);
      return {
        ...state,
        ...action.payload,
        isAuth: true,
        isError: null,
      };
    case LOGIN_FAIL:
      return {
        ...state,
        isError: "asdas",
      };
    case AUTH_ERROR:
      return {
        ...state,
        token: null,
        user: null,
        isAuth: false,
        isError: "asda",
      };

    case LOGOUT:
      localStorage.removeItem(ACCESS_TOKEN);
      localStorage.removeItem(REFRESH_TOKEN);
      return {
        ...state,
        token: null,
        isAuth: false,
        user: null,
        isError: null,
      };

    case REGISTER_FAIL:
      return {
        ...state,
      };
    case PASSWORD_CHANGED:
      return {
        ...state,
      };
    case PASSWORD_CHANGED_FAIL:
      return {
        ...state,
      };
    default:
      return state;
  }
};
