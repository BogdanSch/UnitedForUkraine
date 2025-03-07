import axios from "axios";
import { FC, createContext, useState, useEffect, useMemo } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { API_URL } from "../variables";
import { User } from "../types";

interface IAuthContextProps {
  user: User | null;
  authToken: string | null;
  authenticateUser: (authToken: string) => void;
  logoutUser: () => void;
  isAuthenticated: () => boolean;
}
type AuthProviderProps = {
  children: React.ReactNode;
};

const AuthContext = createContext<IAuthContextProps>({
  user: null,
  authToken: null,
  authenticateUser: () => {},
  logoutUser: () => {},
  isAuthenticated: () => false,
});

export default AuthContext;

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [authToken, setAuthToken, removeAuthToken] = useLocalStorage<string>(
    "authToken",
    ""
  );
  const [user, setUser] = useState<User | null>(null);

  const fetchUserData = (authToken: string): void => {
    if (!authToken) return;

    console.log(authToken);

    axios
      .get(`${API_URL}/Auth/userInfo`, {
        headers: {
          Authorization: `Bearer ${authToken}`, // Properly include the Authorization header inside headers
        },
      })
      .then((response) => {
        setUser(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user info:", error.response?.data);
        logoutUser();
      });
  };

  useEffect(() => {
    fetchUserData(authToken);
  }, [authToken]);

  const authenticateUser = (authToken: string) => {
    setAuthToken(authToken);
    fetchUserData(authToken);
  };

  // const registerUser = (userData: User) => {
  //   setAuthToken(authToken);
  //   fetchUserData(authToken);
  // };

  const logoutUser = () => {
    setUser(null);
    removeAuthToken();
    axios.post(`${API_URL}/Auth/logout`);
  };

  const isAuthenticated = () => !!user && !!authToken;

  const contextValue = useMemo(
    () => ({
      user,
      authToken,
      authenticateUser,
      logoutUser,
      isAuthenticated,
    }),
    [user, authToken]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
