import axios from "axios";
import { protectedAxios } from "../axiosInstances";
import { NewsUpdateDto } from "../../types";
import { API_URL } from "../../variables";

export const fetchNewsUpdateData = async (
  id: number
): Promise<NewsUpdateDto | null> => {
  try {
    const { data } = await axios.get<NewsUpdateDto>(
      `${API_URL}/newsUpdates/${id}`
    );
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const incrementNewsUpdateViews = async (
  id: number
): Promise<boolean> => {
  try {
    await protectedAxios.patch(`${API_URL}/newsUpdates/${id}`);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
