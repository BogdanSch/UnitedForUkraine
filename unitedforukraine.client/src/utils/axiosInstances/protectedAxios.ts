import axios from "axios";
import { API_URL } from "../../variables";
import { refreshTokens } from "../services/tokenService";
// import { convertToUTCDate } from "../dateHelper";

const protectedAxios = axios.create({
  baseURL: API_URL,
});

protectedAxios.interceptors.request.use(
  async (config) => {
    // debugger;
    const accessTokenExpirationTimeUTC: string = JSON.parse(
      localStorage.getItem("accessTokenExpirationTimeUTC") || ""
    );

    const nowUtc = new Date().getTime();
    const expiryUtc = new Date(accessTokenExpirationTimeUTC).getTime();

    if (!Number.isNaN(expiryUtc) && expiryUtc <= nowUtc) {
      await refreshTokens();
    }
    config.withCredentials = true;

    return config;
  },
  (error) => Promise.reject(error)
);

export default protectedAxios;
