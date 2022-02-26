import { createContext } from "react";

const UserContext = createContext({
  user: null,
  refresh: null,
  access: null,
  isAuth: false,
  isError: null,
});

export default UserContext;
