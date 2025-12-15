import { isAxiosError } from "axios";
import { API_URL } from "../../variables";
import { protectedAxios } from "../axiosInstances";

export const getTransactionReceipt = async (
  donationdId: number
): Promise<string | null> => {
  try {
    const urlParams = new URL(`${API_URL}/reports/receipt`);
    urlParams.searchParams.append("donationId", donationdId.toString());
    await protectedAxios.get(urlParams.href);
    return null;
  } catch (error) {
    if (isAxiosError(error))
      return error.response?.data.message || "Failed to get receipt";
    return "Failed to get receipt";
  }
};
