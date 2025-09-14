import axios from "axios";
import { cookiesAxios } from "../axiosInstances";
import { API_URL } from "../../variables";
import { TokenDateDto } from "../../types";
import { convertToUTCDate } from "../helpers/dateHelper";

export const refreshTokens = async (): Promise<void> => {
  try {
    const { data } = await cookiesAxios.post<TokenDateDto>(
      `${API_URL}/Auth/refresh`
    );
    localStorage.setItem(
      "accessTokenExpirationTimeUTC",
      JSON.stringify(convertToUTCDate(data.accessTokenExpirationTime))
    );
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(
        "Error while refreshing tokens:",
        error.response?.data.message
      );
      localStorage.setItem("accessTokenExpirationTimeUTC", "");
    }
    console.log("Internal client error: ", error);
  }
};
