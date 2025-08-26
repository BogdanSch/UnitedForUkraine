// import axios from "axios";
import { protectedAxios } from "../utils/axiosInstances/index";
import { FC, createContext, useState, useEffect, useMemo } from "react";
import { useLocalStorage } from "../hooks";
import { API_URL } from "../variables";
import { TokenDateDto, UserDto } from "../types";
// import { refreshTokens } from "../utils/services/tokenService";
import { convertToUTCDate } from "../utils/dateHelper";

interface IAuthContextProps {
  user: UserDto | null;
  // accessToken: string | null;
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
  // accessToken: null,
  authenticateUser: async () => {},
  logoutUser: async () => {},
  isAuthenticated: () => false,
  isAdmin: () => false,
  refreshUserData: async () => {},
  loading: false,
});

export default AuthContext;

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  // const [refreshToken, setRefreshToken, removeRefreshToken] =
  //   useLocalStorage<string>("refreshToken", "");
  // const [
  //   refreshTokenExpirationTime,
  //   setRefreshTokenExpirationTime,
  //   removeRefreshTokenExpirationTime,
  // ] = useLocalStorage<string>("refreshTokenExpirationTime", "");
  // const [accessToken, setAccessToken, removeAccessToken] =
  //   useLocalStorage<string>("accessToken", "");
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

  const fetchUserData = async (): Promise<void> => {
    if (
      !accessTokenExpirationTimeUTC ||
      accessTokenExpirationTimeUTC.trim() === ""
    ) {
      setLoading(false);
      return;
    }

    try {
      const { data } = await protectedAxios.get<UserDto>(
        `${API_URL}/Auth/userInfo`
      );
      setUser(data);
      console.log("Fetched user info: ");
      console.log(data);
    } catch (error) {
      await logoutUser();
      console.log("Error while fetching the user info: " + error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // const expirationDateUtc = new Date(accessTokenExpirationTimeUTC).getTime();
    // const nowUtc = new Date().getTime();
    // // debugger;
    // if (expirationDateUtc < nowUtc) refreshTokens();
    fetchUserData();
  }, [accessTokenExpirationTimeUTC]);

  const authenticateUser = async (tokenDate: TokenDateDto): Promise<void> => {
    setLoading(true);

    // setRefreshToken(token.refreshToken);
    // setAccessToken(token.accessToken);
    setAccessTokenExpirationTimeUTC(
      convertToUTCDate(tokenDate.accessTokenExpirationTime)
    );
    await fetchUserData();
  };

  const logoutUser = async (): Promise<void> => {
    removeUser();
    // removeAccessToken();
    removeAccessTokenExpirationTimeUTC();
    // removeRefreshToken();

    await protectedAxios.post(`${API_URL}/Auth/logout`);
  };

  const isAuthenticated = () =>
    user != null && accessTokenExpirationTimeUTC.trim().length > 0;
  const isAdmin = () => user?.isAdmin ?? false;

  const refreshUserData = async (): Promise<void> => {
    if (!isAuthenticated()) return;
    setLoading(true);
    await fetchUserData();
  };

  const contextValue = useMemo(
    () => ({
      user,
      // accessToken,
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
