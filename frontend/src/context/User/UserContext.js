import { createContext } from "react";

const UserContext = createContext({
  user: null,
  refresh: undefined,
  access: undefined,
  isAuth: false,
  isError: null,
});

export default UserContext;
