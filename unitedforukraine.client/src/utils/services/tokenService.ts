// import axios from "axios";
import { protectedAxios } from "../axiosInstances";
import { API_URL } from "../../variables";
import { TokenDateDto } from "../../types";
import { convertToUTCDate } from "../dateHelper";

export const ENCODE_SYMBOL: string = "";

export const refreshTokens = async (): Promise<void> => {
  const { data } = await protectedAxios.post<TokenDateDto>(
    `${API_URL}/Auth/refresh`
  );

  localStorage.setItem(
    "accessTokenExpirationTimeUTC",
    JSON.stringify(convertToUTCDate(data.accessTokenExpirationTime))
  );
  // localStorage.setItem("accessToken", JSON.stringify(data.accessToken));
  // localStorage.setItem("refreshToken", JSON.stringify(data.refreshToken));

  // return data.accessToken;
};
