import { useReducer } from "react";
import UserContext from "./UserContext";
import UserReducer from "./UserReducer";
const UserState = (props) => {
  const initialState = {
    token: null,
    user: null,
    isAuth: false,
    isError: null,
  };
  const [state, dispatch] = useReducer(UserReducer, initialState);
  const login = async (formData) => {};
  const register = async (formData) => {};
  const logout = async () => {};
  const forgetPassword = async (formData) => {};
  const loadUser = async () => {};
  return (
    <UserContext.Provider
      value={{
        token: state.token,
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
