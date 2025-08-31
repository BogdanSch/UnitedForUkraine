// import axios from "axios";
import { cookiesAxios } from "../axiosInstances";
import { API_URL } from "../../variables";
import { TokenDateDto } from "../../types";
import { convertToUTCDate } from "../dateHelper";

export const refreshTokens = async (): Promise<void> => {
  // debugger;

  const { data } = await cookiesAxios.post<TokenDateDto>(
    `${API_URL}/Auth/refresh`
  );

  localStorage.setItem(
    "accessTokenExpirationTimeUTC",
    JSON.stringify(convertToUTCDate(data.accessTokenExpirationTime))
  );
};
