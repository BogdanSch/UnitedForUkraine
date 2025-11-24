import { protectedAxios } from "../utils/axiosInstances/index";
import { FC, createContext, useState, useEffect, useMemo } from "react";
import { useLocalStorage } from "../hooks";
import { API_URL } from "../variables";
import { TokenDateDto, UserDto } from "../types";
import { convertToUTCDate } from "../utils/helpers/dateHelper";

interface IAuthContextProps {
  user: UserDto | null;
  authenticateUser: (tokenDate: TokenDateDto) => Promise<void>;
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
  authenticateUser: async () => {},
  logoutUser: async () => {},
  isAuthenticated: () => false,
  isAdmin: () => false,
  refreshUserData: async () => {},
  loading: false,
});

export default AuthContext;

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [
    accessTokenExpirationTimeUTC,
    setAccessTokenExpirationTimeUTC,
    removeAccessTokenExpirationTimeUTC,
  ] = useLocalStorage<string>("accessTokenExpirationTimeUTC", "");

  const [user, setUser, removeUser] = useLocalStorage<UserDto | null>(
    "user",
    null
  );
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (
    accessTokenExpirationTime: string
  ): Promise<void> => {
    if (
      !accessTokenExpirationTime ||
      accessTokenExpirationTime.trim().length === 0
    ) {
      setLoading(false);
      return;
    }

    try {
      const { data } = await protectedAxios.get<UserDto>(
        `${API_URL}/Auth/userInfo`
      );
      setUser(data);
    } catch (error) {
      await logoutUser();
      console.log("Error while fetching the user info: " + error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData(accessTokenExpirationTimeUTC);
  }, [accessTokenExpirationTimeUTC]);

  const authenticateUser = async (tokenDate: TokenDateDto): Promise<void> => {
    setLoading(true);

    const accessTokenExpirationTimeUTC: string = convertToUTCDate(
      tokenDate.accessTokenExpirationTime
    );
    setAccessTokenExpirationTimeUTC(accessTokenExpirationTimeUTC);

    await fetchUserData(accessTokenExpirationTimeUTC);
  };

  const logoutUser = async (): Promise<void> => {
    try {
      await protectedAxios.post(`${API_URL}/Auth/logout`);
    } finally {
      removeUser();
      removeAccessTokenExpirationTimeUTC();
    }
  };

  const isAuthenticated = () => {
    return user !== null && accessTokenExpirationTimeUTC.trim().length > 0;
  };

  const isAdmin = () => user?.isAdmin ?? false;

  const refreshUserData = async (): Promise<void> => {
    if (!isAuthenticated()) {
      await logoutUser();
      return;
    }
    setLoading(true);
    await fetchUserData(accessTokenExpirationTimeUTC);
  };

  const contextValue = useMemo(
    () => ({
      user,
      authenticateUser,
      logoutUser,
      isAuthenticated,
      isAdmin,
      refreshUserData,
      loading,
    }),
    [user, loading]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
