import axios from "axios";
import { API_URL } from "../../variables";
import { TokenDto } from "../../types";
import { convertToUTCDate } from "../dateHelper";

export const ENCODE_SYMBOL: string = "";

export const refreshTokens = async (): Promise<string> => {
  let refreshToken: string = JSON.parse(
    localStorage.getItem("refreshToken") || ""
  );
  if (!refreshToken) throw new Error("No refresh token available");

  const { data } = await axios.post<TokenDto>(`${API_URL}/Auth/refresh`, {
    refreshToken,
  });

  localStorage.setItem("accessToken", JSON.stringify(data.accessToken));
  localStorage.setItem(
    "accessTokenExpirationTimeUTC",
    JSON.stringify(convertToUTCDate(data.accessTokenExpirationTime))
  );
  localStorage.setItem("refreshToken", JSON.stringify(data.refreshToken));

  return data.accessToken;
};
