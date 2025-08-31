import axios from "axios";
import { API_URL } from "../../variables";
// import { convertToUTCDate } from "../dateHelper";

const cookiesAxios = axios.create({
  baseURL: API_URL,
});

cookiesAxios.interceptors.request.use(
  async (config) => {
    config.withCredentials = true;
    return config;
  },
  (error) => Promise.reject(error)
);

export default cookiesAxios;
