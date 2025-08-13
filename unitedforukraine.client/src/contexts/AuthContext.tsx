import axios from "axios";
import { FC, createContext, useState, useEffect, useMemo } from "react";
import { useLocalStorage } from "../hooks";
import { API_URL } from "../variables";
import { TokenDto, UserDto } from "../types";
import { refreshTokens } from "../utils/services/tokenService";
import { convertToUTCDate } from "../utils/dateHelper";

interface IAuthContextProps {
  user: UserDto | null;
  accessToken: string | null;
  authenticateUser: (token: TokenDto) => Promise<void>;
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
  accessToken: null,
  authenticateUser: async () => {},
  logoutUser: async () => {},
  isAuthenticated: () => false,
  isAdmin: () => false,
  refreshUserData: async () => {},
  loading: false,
});

export default AuthContext;

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [refreshToken, setRefreshToken, removeRefreshToken] =
    useLocalStorage<string>("refreshToken", "");
  // const [
  //   refreshTokenExpirationTime,
  //   setRefreshTokenExpirationTime,
  //   removeRefreshTokenExpirationTime,
  // ] = useLocalStorage<string>("refreshTokenExpirationTime", "");
  const [accessToken, setAccessToken, removeAccessToken] =
    useLocalStorage<string>("accessToken", "");
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

  const fetchUserData = async (accessToken: string): Promise<void> => {
    if (!accessToken || accessToken.trim() === "") {
      setLoading(false);
      return;
    }

    const options = {
      method: "GET",
      url: `${API_URL}/Auth/userInfo`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    try {
      const { data } = await axios.request<UserDto>(options);
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
    const expirationDateUtc = new Date(accessTokenExpirationTimeUTC).getTime(); // API date in ms
    const nowUtc = new Date().getTime();

    // debugger;
    if (expirationDateUtc < nowUtc) refreshTokens();

    (async () => {
      await fetchUserData(accessToken);
    })();
  }, [accessToken, accessTokenExpirationTimeUTC]);

  const authenticateUser = async (token: TokenDto): Promise<void> => {
    setLoading(true);

    setRefreshToken(token.refreshToken);
    setAccessToken(token.accessToken);
    setAccessTokenExpirationTimeUTC(
      convertToUTCDate(token.accessTokenExpirationTime)
    );
    await fetchUserData(token.accessToken);
  };

  const logoutUser = async (): Promise<void> => {
    const options = {
      method: "POST",
      url: `${API_URL}/Auth/logout`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    removeUser();
    removeAccessToken();
    removeAccessTokenExpirationTimeUTC();
    removeRefreshToken();

    await axios.request(options);
  };

  const isAuthenticated = () =>
    user != null &&
    accessToken.trim().length > 0 &&
    refreshToken.trim().length > 0;
  const isAdmin = () => user?.isAdmin ?? false;

  const refreshUserData = async (): Promise<void> => {
    if (!isAuthenticated()) return;
    setLoading(true);
    await fetchUserData(accessToken);
  };

  const contextValue = useMemo(
    () => ({
      user,
      accessToken,
      authenticateUser,
      logoutUser,
      isAuthenticated,
      isAdmin,
      refreshUserData,
      loading,
    }),
    [user, accessToken, loading]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
