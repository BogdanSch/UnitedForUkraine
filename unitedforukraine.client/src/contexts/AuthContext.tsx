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
  // const [user, setUser] = useState<UserDto | null>(null);

  const fetchUserData = async (authToken: string): Promise<void> => {
    if (!authToken || authToken.trim() === "") {
      setLoading(false);
      return;
    }

    console.log(authToken);

    await axios
      .get(`${API_URL}/Auth/userInfo`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      .then((response) => {
        setUser(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        logoutUser();
        console.log("Error fetching user info:", error.response?.data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUserData(authToken);
  }, [authToken]);

  const authenticateUser = async (authToken: string): Promise<void> => {
    setLoading(true);
    setAuthToken(authToken);
    await fetchUserData(authToken);
  };

  const logoutUser = async (): Promise<void> => {
    await axios.post(`${API_URL}/Auth/logout`, null, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    removeUser();
    removeAuthToken();
    setUser(null);
  };

  const isAuthenticated = () => user != null && authToken.length > 0;
  const isAdmin = () => user?.isAdmin ?? false;

  const contextValue = useMemo(
    () => ({
      user,
      authToken,
      authenticateUser,
      logoutUser,
      isAuthenticated,
      isAdmin,
      loading,
    }),
    [user, authToken, loading]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
