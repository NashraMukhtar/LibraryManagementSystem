import { useState, useEffect, createContext } from "react";
import { NotificationManager } from "react-notifications";
import userAPI from "../clientAPIs/userAPI";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [isUserAdmin, setIsUserAdmin] = useState(false);

  useEffect(() => {
    if (user) {
      setIsUserAdmin(user.isAdmin);
    }
  }, [user]);

  const login = async (username, password) => {
    try {
      const { user, token, refreshtoken } = await userAPI.login(
        username,
        password
      );
      NotificationManager.success("Logged In Successfuly");
      console.log("Logged In");
      setUser(user);
      setToken(token);
      setRefreshToken(refreshtoken);
      // console.log("User : ", user);
      // console.log("User Token : ", token);
      // console.log("Refresh Token : ", refreshtoken);
    } catch (err) {
      NotificationManager.error("Username OR Password Is Incorrect");
    }
  };
  const logout = async () => {
    setUser(null);
    setIsUserAdmin(false);
    setToken("");
    console.log("LoggedOut");
    NotificationManager.success("Logged Out Successfuly");
  };
  return (
    <UserContext.Provider
      value={{ user, login, logout, isUserAdmin, token, refreshToken }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider, UserContext };
