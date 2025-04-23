import axios from "axios";
import { FC, createContext, useState, useEffect, useMemo } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { API_URL } from "../variables";
import { UserDto } from "../types";

interface IAuthContextProps {
  user: UserDto | null;
  authToken: string | null;
  authenticateUser: (authToken: string) => void;
  logoutUser: () => void;
  isAuthenticated: () => boolean;
  isAdmin: () => boolean;
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
  isAdmin: () => false,
});

export default AuthContext;

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [authToken, setAuthToken, removeAuthToken] = useLocalStorage<string>(
    "authToken",
    ""
  );
  const [user, setUser] = useState<UserDto | null>(null);

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

  const logoutUser = () => {
    setUser(null);
    removeAuthToken();
    axios.post(`${API_URL}/Auth/logout`);
  };

  const isAuthenticated = () => !!user && !!authToken;
  const isAdmin = () => user?.isAdmin ?? false;

  const contextValue = useMemo(
    () => ({
      user,
      authToken,
      authenticateUser,
      logoutUser,
      isAuthenticated,
      isAdmin,
    }),
    [user, authToken]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
