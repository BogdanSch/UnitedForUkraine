import axios from "axios";
import { FC, createContext, useState, useEffect, useMemo } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { API_URL } from "../variables";
import { UserDto } from "../types";

interface IAuthContextProps {
  user: UserDto | null;
  authToken: string | null;
  authenticateUser: (authToken: string) => Promise<void>;
  logoutUser: () => Promise<void>;
  isAuthenticated: () => boolean;
  isAdmin: () => boolean;
  refreshUserData: () => Promise<void>;
  loading: boolean;
}
type AuthProviderProps = {
  children: React.ReactNode;
};

const AuthContext = createContext<IAuthContextProps>({
  user: null,
  authToken: null,
  authenticateUser: async () => {},
  logoutUser: async () => {},
  isAuthenticated: () => false,
  isAdmin: () => false,
  refreshUserData: async () => {},
  loading: false,
});

export default AuthContext;

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [authToken, setAuthToken, removeAuthToken] = useLocalStorage<string>(
    "authToken",
    ""
  );
  const [user, setUser, removeUser] = useLocalStorage<UserDto | null>(
    "user",
    null
  );
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (authToken: string): Promise<void> => {
    if (!authToken || authToken.trim() === "") {
      setLoading(false);
      return;
    }

    const options = {
      method: "GET",
      url: `${API_URL}/Auth/userInfo`,
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };

    try {
      const { data } = await axios.request(options);
      setUser(data);
      console.log("Fetched user info: ");
      console.log(data);
    } catch (error) {
      await logoutUser();
      console.log("Error while fetching user info: " + error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchUserData(authToken);
    })();
  }, [authToken]);

  const authenticateUser = async (authToken: string): Promise<void> => {
    setLoading(true);
    setAuthToken(authToken);
    await fetchUserData(authToken);
  };

  const logoutUser = async (): Promise<void> => {
    const options = {
      method: "POST",
      url: `${API_URL}/Auth/logout`,
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };

    removeUser();
    removeAuthToken();
    setUser(null);

    await axios.request(options);
  };

  const isAuthenticated = () => user != null && authToken.trim().length > 0;
  const isAdmin = () => user?.isAdmin ?? false;

  const refreshUserData = async (): Promise<void> => {
    if (!isAuthenticated()) return;
    setLoading(true);
    await fetchUserData(authToken);
  };

  const contextValue = useMemo(
    () => ({
      user,
      authToken,
      authenticateUser,
      logoutUser,
      isAuthenticated,
      isAdmin,
      refreshUserData,
      loading,
    }),
    [user, authToken, loading]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
