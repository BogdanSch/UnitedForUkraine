import axios from "axios";
import { API_URL } from "../../variables";
import { refreshTokens } from "../services/tokenService";

const EXPIRATION_OFFSET_MS: number = 30 * 1000;

const protectedAxios = axios.create({
  baseURL: API_URL,
});

protectedAxios.interceptors.request.use(
  async (config) => {
    let accessTokenExpirationTimeUTC: string = "";
    const value = localStorage.getItem("accessTokenExpirationTimeUTC");
    if (value) accessTokenExpirationTimeUTC = JSON.parse(value);

    const nowUtc = new Date().getTime();
    const expiryUtc = new Date(accessTokenExpirationTimeUTC)?.getTime();

    if (
      !Number.isNaN(expiryUtc) &&
      expiryUtc - EXPIRATION_OFFSET_MS <= nowUtc
    ) {
      console.log("Refreshing the tokens");
      await refreshTokens();
    }
    config.withCredentials = true;

    return config;
  },
  (error) => Promise.reject(error)
);
// protectedAxios.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     if (error.response?.status === 401 && !error.config._retry) {
//       error.config._retry = true;
//       try {
//         await refreshTokens();
//         return protectedAxios({ ...error.config, withCredentials: true });
//       } catch {
//         return Promise.reject(error);
//       }
//     }
//     return Promise.reject(error);
//   }
// );

export default protectedAxios;
