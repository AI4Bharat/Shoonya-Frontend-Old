import {
  AUTH_ERROR,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  LOGOUT,
  PASSWORD_CHANGED,
  PASSWORD_CHANGED_FAIL,
  REGISTER_FAIL,
  USER_LOADED,
} from "../type";

const ACCESS_TOKEN = "shoonya_access_token";
const REFRESH_TOKEN = "shoonya_refresh_token";

// eslint-disable-next-line
export default (state, action) => {
  switch (action.type) {
    case USER_LOADED:
      return {
        ...state,
        ...action.payload,
        isAuth: true,
        user: action.payload,
        isError: null,
      };
    case LOGIN_SUCCESS:
      localStorage.setItem(ACCESS_TOKEN, action.payload.access);
      localStorage.setItem(REFRESH_TOKEN, action.payload.refresh);
      return {
        ...state,
        ...action.payload,
        access: action.payload.access,
        refresh: action.payload.refresh,
        isAuth: true,
        isError: null,
      };
    case LOGIN_FAIL:
      return {
        ...state,
        isError: true,
      };
    case AUTH_ERROR:
      return {
        ...state,
        token: null,
        user: null,
        isAuth: false,
        isError: true,
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
        isError: null,
        isAuth: false,
      };
    case PASSWORD_CHANGED_FAIL:
      return {
        ...state,
        isError: true,
        isAuth: false
      };
    default:
      return state;
  }
};
