import axios from "axios";
import { API_URL } from "../../variables";
// import { useLocalStorage } from "../../hooks";
import { refreshTokens } from "../services/tokenService";
import { convertToUTCDate } from "../dateHelper";

const protectedAxios = axios.create({
  baseURL: API_URL,
});

protectedAxios.interceptors.request.use(
  async (config) => {
    // const accessToken: string = JSON.parse(
    //   localStorage.getItem("accessToken") || ""
    // );
    // const refreshToken: string = JSON.parse(
    //   localStorage.getItem("refreshToken") || ""
    // );
    const accessTokenExpirationTimeUTC: string = JSON.parse(
      localStorage.getItem("accessTokenExpirationTimeUTC") || ""
    );

    const nowUtc = new Date().getTime();
    const expiryUtc = new Date(
      convertToUTCDate(accessTokenExpirationTimeUTC)
    ).getTime();

    if (expiryUtc <= nowUtc) {
      await refreshTokens();
      // config.headers.Authorization = `Bearer ${newAccessToken}`;
    }
    config.withCredentials = true;

    return config;
  },
  (error) => Promise.reject(error)
);

export default protectedAxios;
