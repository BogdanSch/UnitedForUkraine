import axios from "axios";
import { API_URL } from "../../variables";
import { refreshTokens } from "../services/tokenService";

const protectedAxios = axios.create({
  baseURL: API_URL,
});

protectedAxios.interceptors.request.use(
  async (config) => {
    let accessTokenExpirationTimeUTC: string = "";
    const value = localStorage.getItem("accessTokenExpirationTimeUTC");

    if (value) accessTokenExpirationTimeUTC = value;

    const nowUtc = new Date().getTime();
    const expiryUtc = new Date(accessTokenExpirationTimeUTC)?.getTime();

    if (!Number.isNaN(expiryUtc) && expiryUtc <= nowUtc) {
      console.log("Refreshing the tokens");
      await refreshTokens();
    }
    config.withCredentials = true;

    return config;
  },
  (error) => Promise.reject(error)
);

export default protectedAxios;
